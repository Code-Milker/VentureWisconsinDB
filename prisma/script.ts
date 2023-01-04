import { PrismaClient } from "@prisma/client";
import { ListingsFactory } from "./listing";
import { UserFactory } from "./user";
import { CouponsFactory } from "./coupons";

const prisma = new PrismaClient();
const listingFactory = ListingsFactory(prisma);
const userFactory = UserFactory(prisma);
const couponFactory = CouponsFactory(prisma);
async function main() {
  await listingFactory.ListingsDBTests();
  console.log("listing test complete");
  await userFactory.userDBTests();
  console.log("user test complete");
  await couponFactory.CouponDBTests();
  console.log("coupon test complete");
}

async function createUser(userInput: { email: string }) {
  const user = await prisma.user.create({ data: { email: userInput.email } });
}

export interface CreateListingParams {
  name: string;
  address: string;
}

async function createCoupon(userInput: { email: string }) {
  const user = await prisma.user.create({ data: { email: userInput.email } });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
