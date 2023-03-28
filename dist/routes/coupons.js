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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponRoutes = void 0;
const shared_1 = require("../shared");
const CouponRoutes = (prisma, publicProcedure) => {
    if (!publicProcedure) {
        throw Error("public Procedure not found");
    }
    const create = publicProcedure
        .input((payload) => {
        const parsedPayload = shared_1.createCouponSchema.parse(payload); //validate the incoming object
        return parsedPayload;
    })
        .mutation(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        const coupon = yield prisma.coupon.create({
            data: Object.assign({}, input),
        });
        return coupon;
    }));
    const getByUnique = publicProcedure
        .input((payload) => {
        const parsedName = shared_1.getCouponSchema.parse(payload); //validate the incoming object
        return parsedName;
    })
        .query(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        const coupon = yield prisma.coupon.findUnique({ where: { name: input } });
        if (coupon === null) {
            throw Error("No coupon found");
        }
        return coupon;
    }));
    const getAll = publicProcedure
        .input((email) => {
        const parsedPayload = shared_1.getAllCouponsSchema.parse(email);
        return parsedPayload;
    })
        .query(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        if (input) {
            const coupons = yield prisma.coupon.findMany({
                where: { email: input },
                include: { couponsUsedByUser: true },
            });
            return coupons;
        }
        else {
            const coupons = yield prisma.coupon.findMany({
                include: { couponsUsedByUser: true },
            });
            return coupons;
        }
    }));
    const update = publicProcedure
        .input((payload) => {
        const parsedPayload = shared_1.updateCouponSchema.parse(payload); //validate the incoming object
        return parsedPayload;
    })
        .mutation(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        const { groupName } = input, i = __rest(input, ["groupName"]);
        if (groupName) {
            const alreadyExists = yield prisma.groups.findUnique({
                where: { groupName },
            });
            if (!alreadyExists) {
                yield prisma.groups.create({
                    data: { groupName: groupName },
                });
            }
        }
        const coupon = yield prisma.coupon.update({
            where: { id: input.id },
            data: Object.assign({}, input),
        });
        return coupon;
    }));
    const remove = publicProcedure
        .input((payload) => {
        const parsedName = shared_1.deleteCouponSchema.parse(name);
        return parsedName;
    })
        .mutation(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        const removedCoupon = yield prisma.coupon.delete({
            where: { name: input },
        });
        return removedCoupon.id;
    }));
    const couponUse = publicProcedure
        .input((payload) => {
        const parsedName = shared_1.useCouponSchema.parse(payload);
        return parsedName;
    })
        .mutation(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield prisma.user.findUnique({
            where: { email: input.email },
        });
        if ((user === null || user === void 0 ? void 0 : user.id) && input.email) {
            const existAlready = yield prisma.couponsForUser.findFirst({
                where: { couponId: input.couponId, userEmail: input.email },
            });
            if (!existAlready) {
                const response = yield prisma.couponsForUser.create({
                    data: {
                        userId: user === null || user === void 0 ? void 0 : user.id,
                        couponId: input.couponId,
                        userEmail: input.email,
                        used: true,
                    },
                });
                return response;
            }
            else {
                const response = yield prisma.couponsForUser.update({
                    where: {
                        id: existAlready.id,
                    },
                    data: Object.assign(Object.assign({}, existAlready), { used: true }),
                });
                return response;
            }
        }
    }));
    const couponRoutes = {
        couponCreate: create,
        couponGetByUnique: getByUnique,
        couponUpdate: update,
        couponRemove: remove,
        couponGetAll: getAll,
        couponUse,
    };
    return couponRoutes;
};
exports.CouponRoutes = CouponRoutes;
