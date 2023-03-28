import { initTRPC } from "@trpc/server";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { CouponRoutes } from "./routes/coupons";
import { ListingsRoutes } from "./routes/listing";
import { UserRoutes } from "./routes/user";
import { GroupsRoutes } from "./routes/groups";

import { PrismaClient, Prisma } from "@prisma/client";
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
  createContext() {
    return {};
  },
}).listen(3000);
