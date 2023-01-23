import { PrismaClient } from "@prisma/client";
import { initTRPC } from "@trpc/server";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { CouponRoutes } from "./routes/coupons";
import { ListingsRoutes } from "./routes/listing";

export type AppRouter = typeof appRouter;

const t = initTRPC.create();

const publicProcedure = t.procedure;
const router = t.router;

const prisma = new PrismaClient();
const listingRoutes = ListingsRoutes(prisma, publicProcedure);
const couponRoutes = CouponRoutes(prisma, publicProcedure);
const appRouter = router({ ...listingRoutes, ...couponRoutes });

createHTTPServer({
  router: appRouter,
  createContext() {
    return {};
  },
}).listen(3000);
