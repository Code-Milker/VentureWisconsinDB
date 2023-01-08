import { Listing, PrismaClient } from "@prisma/client";
import { ListingsFactory } from "./listing";
import { UserFactory } from "./user";
import { CouponsFactory } from "./coupons";
import express from "express";
const app = express();
app.use(express.json());
const prisma = new PrismaClient();
const listingFactory = ListingsFactory(prisma);
const userFactory = UserFactory(prisma);
const couponFactory = CouponsFactory(prisma);

// async function main() {
//   await listingFactory.ListingsDBTests();
//   console.log("listing test complete");
//   await userFactory.userDBTests();
//   console.log("user test complete");
//   await couponFactory.CouponDBTests();
//   console.log("coupon test complete");
// }

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

app.get("/users", async (req, res) => {
  const users = await userFactory.getAllUsers();
  res.json(users);
});

app.get("/listings", async (req, res) => {
  const users = await listingFactory.getAllListings();
  res.json(users);
});

app.post("/listing/create", async (request, res) => {
  const createdPayload = await listingFactory.createListing(request.body);
  res.send(createdPayload);
});

const server = app.listen(3000, () =>
  console.log(`🚀 Server ready at: http://localhost:3000`)
);

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
