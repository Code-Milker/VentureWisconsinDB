"use strict";
var __awaiter = (this && this.__awaiter) || function(thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function(resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __importDefault = (this && this.__importDefault) || function(mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllData = exports.createData = void 0;
const client_1 = require("@prisma/client");
const data_1 = require("./data");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const createData = () => __awaiter(void 0, void 0, void 0, function*() {
  try {
    yield prisma.listing.createMany({ data: (0, data_1.getMockListings)() });
    yield prisma.groups.createMany({ data: data_1.mockGroups });
    const mockUsersWithHashedPassword = yield Promise.all(data_1.mockUsers.map((u) => __awaiter(void 0, void 0, void 0, function*() {
      return Object.assign(Object.assign({}, u), { password: yield bcrypt_1.default.hash(u.password, 0) });
    })));
    yield prisma.user.createMany({ data: mockUsersWithHashedPassword });
    const listings = yield prisma.listing.findMany();
    const users = yield prisma.user.findMany();
    const groups = yield prisma.groups.findMany();
    const { bar430, dPub, mollys } = (0, data_1.getCoupons)(listings, groups, users);
    yield prisma.coupon.createMany({
      data: [...bar430, ...dPub, ...mollys],
    });
    users.forEach((u) => { });
  }
  catch (e) {
    console.log("failed on create data");
    console.log(e);
  }
});
exports.createData = createData;
const deleteAllData = () => __awaiter(void 0, void 0, void 0, function*() {
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
deleteAllData()
  .then(() => (0, exports.createData)())
  .then(() => console.log("data import success"))
  .catch(() => console.log("data import fail"));
