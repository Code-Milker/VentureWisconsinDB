import express from 'express';
import cors from 'cors';
import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import { PrismaClient } from "@prisma/client";
import * as trpcExpress from "@trpc/server/adapters/express";
import { GroupsRoutes } from "./groups";
import { ListingsRoutes } from "./listing";
import { UserRoutes } from "./user";
import { CouponRoutes } from "./coupons";
import { S3Routes } from './image';  // Import the S3 routes

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
app.use(cors());

app.use(express.static(__dirname + '/public'));

// Use the S3 routes
app.post('/upload-image', S3Routes.upload.single('image'), S3Routes.uploadImage);
app.get('/fetch-image/:key', S3Routes.fetchImage);

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.get("/", (req, res) => res.send("Venture Wisconsin API"));

app.get("/download-app", function(req, res) {
  res.sendFile(__dirname + "/download-app.html");
});

app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
