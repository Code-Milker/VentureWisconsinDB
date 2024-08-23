"use strict";
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
exports.deleteAllData = exports.createData = void 0;
const data_1 = require("./data");
const bcrypt_1 = __importDefault(require("bcrypt"));
const createData = (prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create listings one by one
        //
        const user = yield prisma.user.findFirst();
        const mockListings = (0, data_1.getMockListings)();
        for (const listing of mockListings) {
            yield prisma.listing.create({ data: listing });
        }
        // Create groups one by one
        for (const group of data_1.mockGroups) {
            yield prisma.groups.create({ data: group });
        }
        // Hash user passwords and create users one by one
        const mockUsersWithHashedPassword = yield Promise.all(data_1.mockUsers.map((u) => __awaiter(void 0, void 0, void 0, function* () {
            return Object.assign(Object.assign({}, u), { password: yield bcrypt_1.default.hash(u.password, 10) });
        })));
        for (const user of mockUsersWithHashedPassword) {
            // @ts-ignore
            yield prisma.user.create({ data: user });
        }
        // Get all necessary data to create coupons
        const listings = yield prisma.listing.findMany();
        const users = yield prisma.user.findMany();
        const groups = yield prisma.groups.findMany();
        const { dPub } = (0, data_1.getCoupons)(listings, groups, users);
        // Create coupons one by one
        const allCoupons = [...dPub];
        for (const coupon of allCoupons) {
            yield prisma.coupon.create({ data: coupon });
        }
        console.log("Data creation succeeded");
    }
    catch (e) {
        console.log("Failed on create data");
        console.error(e);
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.createData = createData;
const deleteAllData = (prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //delete all listings
        const listings = yield prisma.listing.findMany();
        yield prisma.listing.deleteMany({ where: { id: { in: listings.map((m) => m.id) } } });
        // delete all coupons
        const coupons = yield prisma.coupon.findMany();
        yield prisma.coupon.deleteMany({ where: { id: { in: coupons.map((c) => c.id) } } });
        // delete all user coupons
        const couponsForUser = yield prisma.couponsForUser.findMany();
        yield prisma.couponsForUser.deleteMany({ where: { id: { in: couponsForUser.map((c) => c.id) } } });
        // delete all groups
        const groups = yield prisma.groups.findMany();
        yield prisma.groups.deleteMany({ where: { groupName: { in: groups.map((g) => g.groupName) } } });
        // delete all pins
        const userPins = yield prisma.pinnedUserListing.findMany();
        yield prisma.pinnedUserListing.deleteMany({ where: { id: { in: userPins.map((p) => p.id) } } });
        // delete all users
        const users = yield prisma.user.findMany();
        yield prisma.user.deleteMany();
        yield prisma.pinnedUserListing.deleteMany({ where: { id: { in: users.map((p) => p.id) } } });
    }
    catch (e) {
        console.log("failed on delete data");
        console.log(e);
    }
});
exports.deleteAllData = deleteAllData;
function getDatabaseFileName(prisma) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield prisma.$queryRaw `PRAGMA database_list;`;
        // @ts-ignore
        const dbFileName = (_a = result[0]) === null || _a === void 0 ? void 0 : _a.file;
        console.log('Database file name:', dbFileName);
    });
}
