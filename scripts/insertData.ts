import { PrismaClient } from "@prisma/client";
import { mockGroups, getCoupons, getMockListings, mockUsers } from "./data";
import bCrypt from "bcrypt";
const prisma = new PrismaClient();
export const createData = async () => {
  try {
    await prisma.listing.createMany({ data: getMockListings() });
    await prisma.groups.createMany({ data: mockGroups });
    const mockUsersWithHashedPassword = await Promise.all(
      mockUsers.map(async (u) => {
        return { ...u, password: await bCrypt.hash(u.password, 0) };
      })
    );
    await prisma.user.createMany({ data: mockUsersWithHashedPassword });
    const listings = await prisma.listing.findMany();
    const users = await prisma.user.findMany();
    const groups = await prisma.groups.findMany();
    const { bar430, dPub, mollys } = getCoupons(listings, groups, users);
    await prisma.coupon.createMany({
      data: [...bar430, ...dPub, ...mollys],
    });
    users.forEach((u) => {});
  } catch (e) {
    console.log("failed on create data");
    console.log(e);
  }
};

export const deleteAllData = async () => {
  try {
    //delete all listings
    const listings = await prisma.listing.findMany();
    await prisma.listing.deleteMany({ where: { id: { in: listings.map((m) => m.id) } } });
    // delete all coupons
    const coupons = await prisma.coupon.findMany();
    await prisma.coupon.deleteMany({ where: { id: { in: coupons.map((c) => c.id) } } });
    // delete all user coupons
    const couponsForUser = await prisma.couponsForUser.findMany();
    await prisma.couponsForUser.deleteMany({ where: { id: { in: couponsForUser.map((c) => c.id) } } });
    // delete all groups
    const groups = await prisma.groups.findMany();
    await prisma.groups.deleteMany({ where: { groupName: { in: groups.map((g) => g.groupName) } } });
    // delete all pins
    const userPins = await prisma.pinnedUserListing.findMany();
    await prisma.pinnedUserListing.deleteMany({ where: { id: { in: userPins.map((p) => p.id) } } });
    // delete all users
    const users = await prisma.user.findMany();
    await prisma.user.deleteMany();
    await prisma.pinnedUserListing.deleteMany({ where: { id: { in: users.map((p) => p.id) } } });
  } catch (e) {
    console.log("failed on delete data");
    console.log(e);
  }
};
const res = deleteAllData()
  .then(() => createData())
  .then(() => console.log("data import success"))
  .catch(() => console.log("data import fail"));
