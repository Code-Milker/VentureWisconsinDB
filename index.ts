import { PrismaClient } from "../VentureWisconsinShared/index";
import { initTRPC } from "@trpc/server";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { CouponRoutes } from "./routes/coupons";
import { ListingsRoutes } from "./routes/listing";
import { UserRoutes } from "./routes/user";

export type AppRouter = typeof appRouter;

const prisma = new PrismaClient();
const t = initTRPC.create();

const publicProcedure = t.procedure;
const router = t.router;

const listingRoutes = ListingsRoutes(prisma, publicProcedure);
const couponRoutes = CouponRoutes(prisma, publicProcedure);
const userRoutes = UserRoutes(prisma, publicProcedure);
const appRouter = router({ ...listingRoutes, ...couponRoutes, ...userRoutes });

createHTTPServer({
  router: appRouter,
  createContext() {
    return {};
  },
}).listen(3000);
