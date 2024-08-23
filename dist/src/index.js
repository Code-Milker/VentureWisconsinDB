"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const server_1 = require("@trpc/server");
const prisma_1 = require("../prisma");
const trpcExpress = __importStar(require("@trpc/server/adapters/express"));
const groups_1 = require("./groups");
const listing_1 = require("./listing");
const user_1 = require("./user");
const coupons_1 = require("./coupons");
const image_1 = require("./image"); // Import the S3 routes
const multer_1 = __importDefault(require("multer"));
const redeem_1 = require("./redeem");
const authJwt_1 = require("./authJwt"); // Import the JWT authentication middleware
const passport_1 = __importDefault(require("passport"));
const PORT = process.env.PORT || 80;
const prisma = new prisma_1.PrismaClient();
const createContext = ({ req, res }) => {
    return { req, res };
};
const t = server_1.initTRPC.context().create();
const publicProcedure = t.procedure;
const router = t.router;
const listingRoutes = (0, listing_1.ListingsRoutes)(prisma, publicProcedure);
const couponRoutes = (0, coupons_1.CouponRoutes)(prisma, publicProcedure);
const userRoutes = (0, user_1.UserRoutes)(prisma, publicProcedure);
const groupRoutes = (0, groups_1.GroupsRoutes)(prisma, publicProcedure);
const appRouter = router(Object.assign(Object.assign(Object.assign(Object.assign({}, listingRoutes), couponRoutes), userRoutes), groupRoutes));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static(__dirname + '/public'));
// Use the S3 routes
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
app.post('/uploadImages', upload.fields([
    { name: 'images', maxCount: 4 },
    { name: 'listingId', maxCount: 1 } // if listingId is a file; otherwise, it's accessed via req.body
]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    yield image_1.S3Routes.uploadImages(req.files.images, req.body.listingId, res, prisma);
    res.status(200).json({ success: true, message: 'images uploaded successfully' });
}));
app.get("/", (req, res) => res.send("Venture Wisconsin API"));
app.get("/download-app", function (req, res) {
    res.sendFile(__dirname + "/download-app.html");
});
app.use('/', redeem_1.redeem);
app.use(passport_1.default.initialize());
app.get('/auth/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport_1.default.authenticate('google', { session: false }), (req, res) => {
    // Assuming that the user and token are passed in the done callback
    const { user, token } = req.user;
    res.json({ user, token });
});
app.listen(PORT, () => {
    console.log('Server running on port', PORT);
});
app.use("/trpc", authJwt_1.authenticateJWT, trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
}));
exports.default = app;
