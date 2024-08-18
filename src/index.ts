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

import multer from 'multer';
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
app.use(express.json())
app.use(express.static(__dirname + '/public'));

// Use the S3 routes
//
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

app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);
app.get('/redeem', (req, res) => {
  // Extract and parse the JSON from the query parameter
  const data: any = req.query.data;
  if (data) {
    try {
      const parsedData = JSON.parse(decodeURIComponent(data));
      const { couponId, email, listingName } = parsedData;

      // Generate the HTML response
      const htmlResponse = `
        <html>
          <head>
            <title>Coupon Redemption</title>
          </head>
          <body>
            <h1>Coupon Redemption</h1>
            <p><strong>Coupon ID:</strong> ${couponId}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Listing Name:</strong> ${listingName}</p>
          </body>
        </html>
      `;

      res.send(htmlResponse);
    } catch (error) {
      res.status(400).send('Invalid data parameter');
    }
  } else {
    res.status(400).send('Missing data parameter');
  }
});
