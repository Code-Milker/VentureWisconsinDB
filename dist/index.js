"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@trpc/server");
const standalone_1 = require("@trpc/server/adapters/standalone");
const coupons_1 = require("./routes/coupons");
const listing_1 = require("./routes/listing");
const user_1 = require("./routes/user");
const groups_1 = require("./routes/groups");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const t = server_1.initTRPC.create();
const publicProcedure = t.procedure;
const router = t.router;
const listingRoutes = (0, listing_1.ListingsRoutes)(prisma, publicProcedure);
const couponRoutes = (0, coupons_1.CouponRoutes)(prisma, publicProcedure);
const userRoutes = (0, user_1.UserRoutes)(prisma, publicProcedure);
const groupRoutes = (0, groups_1.GroupsRoutes)(prisma, publicProcedure);
const appRouter = router(Object.assign(Object.assign(Object.assign(Object.assign({}, listingRoutes), couponRoutes), userRoutes), groupRoutes));
(0, standalone_1.createHTTPServer)({
    router: appRouter,
    createContext() {
        return {};
    },
}).listen(3000);
