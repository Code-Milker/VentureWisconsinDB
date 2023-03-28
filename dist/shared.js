"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserSchema = exports.createGroupSchema = exports.pinListingSchema = exports.updatedUserSchema = exports.getUserSchema = exports.createNewUserSchema = exports.useCouponSchema = exports.deleteCouponSchema = exports.updateCouponSchema = exports.getCouponSchema = exports.createCouponSchema = exports.getAllCouponsSchema = exports.deleteListingSchema = exports.getAllListingsParams = exports.getListingSchema = exports.listingSchema = void 0;
const zod_1 = require("zod");
exports.listingSchema = zod_1.z.object({
    address: zod_1.z.string().min(1),
    experience1: zod_1.z.string().optional().nullable(),
    experience2: zod_1.z.string().optional().nullable(),
    experience3: zod_1.z.string().optional().nullable(),
    experience4: zod_1.z.string().optional().nullable(),
    category: zod_1.z.string().optional(),
    city: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    displayTitle: zod_1.z.string().min(1),
    email: zod_1.z.string().email().min(1),
    image1: zod_1.z.string().min(1),
    image2: zod_1.z.string().min(1).optional().nullable(),
    image3: zod_1.z.string().min(1).optional().nullable(),
    image4: zod_1.z.string().min(1).optional().nullable(),
    name: zod_1.z.string().min(1),
    phone: zod_1.z.string().min(10),
    subTitle: zod_1.z.string().optional(),
    website: zod_1.z.string().min(1),
    zipcode: zod_1.z.string().min(5),
});
exports.getListingSchema = zod_1.z.string();
exports.getAllListingsParams = zod_1.z.object({
    name: zod_1.z.string().default(""),
});
exports.deleteListingSchema = zod_1.z.string(); //validate the incoming object
exports.getAllCouponsSchema = zod_1.z.string().optional();
exports.createCouponSchema = zod_1.z.object({
    name: zod_1.z.string(),
    listingId: zod_1.z.number().int().optional(),
    description: zod_1.z.string(),
    email: zod_1.z.string(),
    groupName: zod_1.z.string(),
});
exports.getCouponSchema = zod_1.z.string();
exports.updateCouponSchema = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string(),
    listingId: zod_1.z.number().int(),
    description: zod_1.z.string(),
    expired: zod_1.z.boolean().optional(),
    groupName: zod_1.z.string(),
});
exports.deleteCouponSchema = zod_1.z.string(); //validate the incoming object
exports.useCouponSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    couponId: zod_1.z.number(),
});
exports.createNewUserSchema = zod_1.z.object({
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
    password: zod_1.z.string().min(8).max(16),
    email: zod_1.z.string().email(),
});
exports.getUserSchema = zod_1.z.string();
exports.updatedUserSchema = zod_1.z.object({
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
    email: zod_1.z.string(),
    role: zod_1.z.string(),
    session: zod_1.z.string(),
});
exports.pinListingSchema = zod_1.z.object({
    listingName: zod_1.z.string(),
    userEmail: zod_1.z.string().email(),
});
exports.createGroupSchema = zod_1.z.object({
    groupName: zod_1.z.string(),
});
exports.deleteUserSchema = zod_1.z.string(); //validate the incoming object
