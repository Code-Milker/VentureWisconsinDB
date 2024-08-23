import { PrismaClient } from "../prisma";
import { mockGroups, getCoupons, getMockListings, mockUsers } from "./data";
import bCrypt from "bcrypt";

export const createData = async (prisma: PrismaClient) => {
  try {
    // Create listings one by one
    //
    const user = await prisma.user.findFirst();
    const mockListings = getMockListings();
    for (const listing of mockListings) {
      await prisma.listing.create({ data: listing });
    }

    // Create groups one by one
    for (const group of mockGroups) {
      await prisma.groups.create({ data: group });
    }

    // Hash user passwords and create users one by one
    const mockUsersWithHashedPassword = await Promise.all(
      mockUsers.map(async (u) => {
        return { ...u, password: await bCrypt.hash(u.password, 10) };
      }),
    );

    for (const user of mockUsersWithHashedPassword) {
      // @ts-ignore
      await prisma.user.create({ data: user });
    }

    // Get all necessary data to create coupons
    const listings = await prisma.listing.findMany();
    const users = await prisma.user.findMany();
    const groups = await prisma.groups.findMany();
    const { dPub } = getCoupons(listings, groups, users);
    // Create coupons one by one
    const allCoupons = [...dPub];
    for (const coupon of allCoupons) {
      await prisma.coupon.create({ data: coupon });
    }

    console.log("Data creation succeeded");
  } catch (e) {
    console.log("Failed on create data");
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
};

export const deleteAllData = async (prisma: PrismaClient) => {
  try {
    //delete all listings
    const listings = await prisma.listing.findMany();
    await prisma.listing.deleteMany({
      where: { id: { in: listings.map((m) => m.id) } },
    });
    // delete all coupons
    const coupons = await prisma.coupon.findMany();
    await prisma.coupon.deleteMany({
      where: { id: { in: coupons.map((c) => c.id) } },
    });
    // delete all user coupons
    const couponsForUser = await prisma.couponsForUser.findMany();
    await prisma.couponsForUser.deleteMany({
      where: { id: { in: couponsForUser.map((c) => c.id) } },
    });
    // delete all groups
    const groups = await prisma.groups.findMany();
    await prisma.groups.deleteMany({
      where: { groupName: { in: groups.map((g) => g.groupName) } },
    });
    // delete all pins
    const userPins = await prisma.pinnedUserListing.findMany();
    await prisma.pinnedUserListing.deleteMany({
      where: { id: { in: userPins.map((p) => p.id) } },
    });
    // delete all users
    const users = await prisma.user.findMany();
    await prisma.user.deleteMany();
    await prisma.pinnedUserListing.deleteMany({
      where: { id: { in: users.map((p) => p.id) } },
    });
    console.log("delete data succeeded");
  } catch (e) {
    console.log("failed on delete data");
    console.log(e);
  }
};

async function getDatabaseFileName(prisma: PrismaClient) {
  const result = await prisma.$queryRaw`PRAGMA database_list;`;
  // @ts-ignore
  const dbFileName = result[0]?.file;
  console.log("Database file name:", dbFileName);
}
