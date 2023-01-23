// import { PrismaClient } from "../../VentureWisconsinShared/index";
// import { ListingsRoutes } from "./listing";
// import { UserFactory } from "./user";
// import express from "express";
// import { CouponFactory } from "./coupons";

// const app = express();
// app.use(express.json());
// const prisma = new PrismaClient();
// const listing = ListingsRoutes(prisma);
// const user = UserFactory(prisma);
// const coupon = CouponFactory(prisma);
// coupon;

// async function createUser(userInput: { email: string }) {
//   const user = await prisma.user.create({ data: { email: userInput.email } });
// }

// export interface CreateListingParams {
//   name: string;
//   address: string;
// }

// async function createCoupon(userInput: { email: string }) {
//   const user = await prisma.user.create({ data: { email: userInput.email } });
// }

// // Listing calls
// app.post("/listing/getAll", async (req, res) => {
//   const users = await listing.getAll(req.body);
//   res.send(users);
// });

// app.post("/listing/create", async (request, res) => {
//   const createdPayload = await listing.create(request.body);
//   res.send(createdPayload);
// });

// app.post("/listing/update", async (request, res) => {
//   const createdPayload = await listing.update(request.body);
//   res.send(createdPayload);
// });

// app.delete("/listing/delete", async (request, res) => {
//   console.log(request.body);
//   const createdPayload = await listing.remove(request.body);
// });

// app.get("/users", async (req, res) => {
//   const users = await user.getAll({});
//   res.send(users);
// });
// // Listing calls
// // app.post("/listing/getAll", async (req, res) => {
// //   const users = await listing.getAll(req.body);
// //   res.send(users);
// // });

// // app.post("/listing/create", async (request, res) => {
// //   const createdPayload = await user.create(request.body);
// //   res.send(createdPayload);
// // });

// // app.post("/listing/update", async (request, res) => {
// //   const createdPayload = await user.update(request.body);
// //   res.send(createdPayload);
// // });

// // app.delete("/listing/delete", async (request, res) => {
// //   console.log(request.body);
// //   const createdPayload = await user.remove(request.body);
// // });

// const server = app.listen(3000, async () => {
//   console.log(`🚀 Server ready at: http://localhost:3000`);
// });
