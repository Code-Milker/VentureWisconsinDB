import express from 'express';
import cors from 'cors';
import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import { PrismaClient } from "../prisma";
import * as trpcExpress from "@trpc/server/adapters/express";
import { GroupsRoutes } from "./groups";
import { ListingsRoutes } from "./listing";
import { UserRoutes } from "./user";
import { CouponRoutes } from "./coupons";
import { S3Routes } from './image';  // Import the S3 routes
import multer from 'multer';
import { redeem } from './redeem';

import { authenticateJWT } from './authJwt';  // Import the JWT authentication middleware
import passport from 'passport';
const PORT = process.env.PORT || 80;
export type AppRouter = typeof appRouter;
const prisma = new PrismaClient();
const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => {
  return { req, res };
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
app.use(express.json())
app.use(express.static(__dirname + '/public'));

// Use the S3 routes
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

app.post('/uploadImages', upload.fields([
  { name: 'images', maxCount: 4 },
  { name: 'listingId', maxCount: 1 } // if listingId is a file; otherwise, it's accessed via req.body
]), async (req, res, next) => {
  // @ts-ignore
  await S3Routes.uploadImages(req.files.images, req.body.listingId, res, prisma);
  res.status(200).json({ success: true, message: 'images uploaded successfully' })
});


app.get("/", (req, res) => res.send("Venture Wisconsin API"));

app.get("/download-app", function(req, res) {
  res.sendFile(__dirname + "/download-app.html");
});
app.use('/', redeem)

// app.use(passport.initialize());
//
// app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
//
// app.get(
//   '/auth/google/callback',
//   passport.authenticate('google', { session: false }),
//   (req, res) => {
//     // Assuming that the user and token are passed in the done callback
//     const { user, token } = req.user as { user: any; token: string };
//     res.json({ user, token });
//   }
// );

app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});

app.use(
  "/trpc",
  //TODO authenticateJWT,
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);
export default app
