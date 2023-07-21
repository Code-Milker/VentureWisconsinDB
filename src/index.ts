import { initTRPC } from "@trpc/server";
import { CreateHTTPContextOptions, createHTTPServer } from "@trpc/server/adapters/standalone";
import { CouponRoutes } from "./routes/coupons";
import { ListingsRoutes } from "./routes/listing";
import { UserRoutes } from "./routes/user";
import { GroupsRoutes } from "./routes/groups";
import { PrismaClient, Prisma } from "../prisma/prisma/output";
import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";

export type AppRouter = typeof appRouter;
const prisma = new PrismaClient();
const t = initTRPC.create();
const publicProcedure = t.procedure;
const router = t.router;
const listingRoutes = ListingsRoutes(prisma, publicProcedure);
const couponRoutes = CouponRoutes(prisma, publicProcedure);
const userRoutes = UserRoutes(prisma, publicProcedure);
const groupRoutes = GroupsRoutes(prisma, publicProcedure);
const appRouter = router({
  ...listingRoutes,
  ...couponRoutes,
  ...userRoutes,
  ...groupRoutes,
});

createHTTPServer({
  router: appRouter,
  createContext(opts: CreateHTTPContextOptions) {
    return {};
  },
}).listen(3000);

// export const addCouponGroups = async () => {
//   await prisma.groups.create({ data: { groupName: "Venture 2023" } });
//   await prisma.groups.create({ data: { groupName: "Brew Deck" } });
//   await prisma.groups.create({ data: { groupName: "Wine Tags" } });
// };
// export const updateCouponGroups = async () => {
//   await prisma.groups.update({
//     where: { groupName: "Wine Tags" },
//     data: { activationCode: "qwerty" },
//   });
// };
// export const getCouponUserRelation = async () => {};
// updateCouponGroups();
