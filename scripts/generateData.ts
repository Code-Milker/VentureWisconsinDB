import { PrismaClient } from "../prisma";
import { generateGroups } from "./addCouponGroups";
import { addCouponsFromCSV } from "./addCoupons";
import { addListings } from "./addListings";
import { mockUsers } from './data'

export const createData = async (prisma: PrismaClient) => {
  try {
    await deleteAllData(prisma)
    for (const user of mockUsers) {
      await prisma.user.create({ data: user });
    }
    await addListings(prisma)
    await generateGroups(prisma)
    await addCouponsFromCSV(prisma)
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

createData(new PrismaClient())
  .then(res => { console.log('success: ', res) })
  .catch(err => { console.log('error:', err) })
