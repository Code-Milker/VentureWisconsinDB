import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import { CouponRoutes } from "./coupons";
import { PrismaClient } from "@prisma/client";
import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import { GroupsRoutes } from "./groups";
import { ListingsRoutes } from "./listing";
import { UserRoutes } from "./user";
import { createData } from "../scripts/insertData";
const PORT = process.env.PORT || 80;
export type AppRouter = typeof appRouter;
const prisma = new PrismaClient();
const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => {
  return {};
};
type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

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
const app = express();
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);
app.get("/", (req, res) => res.send("Venture Wisconsin API"));

app.get("/privacy-policy", function (req, res) {
  res.sendFile(__dirname + "/privacy-policy.html");
});
app.listen(PORT, () => {
  console.log(PORT);
  // createData(prisma)
  //   .then(() => {
  //     console.log("success");
  //   })
  //   .catch((e) => {
  //     console.log(e);
  //   });
});
