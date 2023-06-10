import {
  ProcedureBuilder,
  RootConfig,
  DefaultErrorShape,
  DefaultDataTransformer,
  unsetMarker,
} from "@trpc/server";
import {
  createCouponSchema,
  couponIdSchema,
  getAllCouponsSchema,
  getCouponSchema,
  updateCouponSchema,
  useCouponSchema,
  addCouponForUserByGroupSchema,
  GetCouponForUserBySchema,
} from "../shared";
import { PrismaClient, Prisma } from "../../prisma/prisma/output";
import { z } from "zod";

export const CouponRoutes = (
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >,
  publicProcedure: ProcedureBuilder<{
    _config: RootConfig<{
      ctx: object;
      meta: object;
      errorShape: DefaultErrorShape;
      transformer: DefaultDataTransformer;
    }>;
    _ctx_out: object;
    _input_in: typeof unsetMarker;
    _input_out: typeof unsetMarker;
    _output_in: typeof unsetMarker;
    _output_out: typeof unsetMarker;
    _meta: object;
  }>
) => {
  if (!publicProcedure) {
    throw Error("public Procedure not found");
  }
  const create = publicProcedure
    .input(async (payload: unknown) => {
      const parsedPayload = createCouponSchema.parse(payload); //validate the incoming object
      const listingAlreadyHasCoupon = !!(await prisma.coupon.findFirst({
        where: { listingId: parsedPayload.listingId },
      }));
      const admin = await prisma.user
        .findUnique({
          where: { email: parsedPayload.email },
        })
        .then((user) => user?.role === "ADMIN");
      if (listingAlreadyHasCoupon && !admin) {
        throw Error("Listing already has coupon and User do not have admin permissions ");
      }

      return parsedPayload;
    })
    .mutation(async ({ input }) => {
      const expirationDate = new Date(input.expirationDate).toISOString();
      const listingForCoupon = await prisma.listing.findUnique({
        where: { id: input.listingId as number },
      });
      if (listingForCoupon === null) {
        throw Error("can't find listing");
      }
      if (!input.groupName) {
        input.groupName = `${listingForCoupon?.displayTitle}${listingForCoupon.id}`;
      }
      const coupon = await prisma.coupon.create({
        data: { ...input, expirationDate },
      });
      // return coupon;
    });

  const getByUnique = publicProcedure
    .input((payload: unknown) => {
      const parsedName = getCouponSchema.parse(payload); //validate the incoming object
      return parsedName;
    })
    .query(async ({ input }) => {
      const coupon = await prisma.coupon.findUnique({ where: { name: input } });
      if (coupon === null) {
        throw Error("No coupon found");
      }
      return coupon;
    });

  const getAll = publicProcedure
    .input((email: unknown) => {
      const parsedPayload = getAllCouponsSchema.parse(email);
      return parsedPayload;
    })
    .query(async ({ input }) => {
      if (input) {
        const coupons = await prisma.coupon.findMany({
          where: { email: input },
        });
        return coupons;
      } else {
        const coupons = await prisma.coupon.findMany({});
        return coupons;
      }
    });

  const update = publicProcedure
    .input((payload: unknown) => {
      console.log(payload);
      const parsedPayload = updateCouponSchema.parse(payload); //validate the incoming object
      return parsedPayload;
    })
    .mutation(async ({ input }) => {
      const { groupName, ...i } = input;
      const coupon = await prisma.coupon.update({
        where: { id: input.id },
        data: { ...input },
      });
      return coupon;
    });

  const remove = publicProcedure
    .input((payload: unknown) => {
      const parsedName = couponIdSchema.parse(payload);
      return parsedName;
    })
    .mutation(async ({ input }) => {
      const removedCoupon = await prisma.coupon.delete({
        where: { id: input.id },
      });
      return removedCoupon.id;
    });

  const couponUse = publicProcedure
    .input((payload: unknown) => {
      const parsedName = useCouponSchema.parse(payload);
      return parsedName;
    })
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { email: input.email },
      });
      if (user?.id && input.email) {
        const couponToUpdateForUser = await prisma.couponsForUser.findFirst({
          where: { couponId: input.couponId, userEmail: input.email },
        });

        const response = await prisma.couponsForUser.update({
          where: {
            id: couponToUpdateForUser?.id,
          },

          data: { used: true },
        });
        return response;
        // }
      }
    });
  const addCouponForUserByGroup = publicProcedure
    .input(async (payload: unknown) => {
      const parsedPayload = addCouponForUserByGroupSchema.parse(payload); //passed in the correct info
      const group = await prisma.groups.findUnique({
        where: { groupName: parsedPayload.groupName },
      });
      if (
        group?.activationCode === "NotRequired" ||
        group?.activationCode === "Not Required" || // no code required
        group?.activationCode === parsedPayload.code // code required
      ) {
        return parsedPayload;
      } else {
        throw Error("invalid code");
      }
      //time to verify the code
    })
    .mutation(async ({ input }) => {
      // first find all of the coupons
      const coupons = await prisma.coupon.findMany({
        where: { groupName: input.groupName },
      });
      // now grab all the existing coupons that a user has access to
      const usersExistingCouponIds = await prisma.couponsForUser
        .findMany({
          where: { userEmail: input.userEmail },
        })
        .then((userCoupons) => userCoupons.map((c) => c.couponId));
      // we only want to add coupons the user hasn't used
      const couponsPromises = coupons
        .filter((c) => {
          return !usersExistingCouponIds.includes(c.id);
        })
        // create an array promise
        .map((c) => {
          return prisma.couponsForUser.create({
            data: {
              couponId: c.id,
              used: false,
              userEmail: input.userEmail,
            },
          });
        });
      // add all coupons that the user is elidible for
      return await Promise.all(couponsPromises);
    });
  const hasCouponBeenUsed = publicProcedure
    .input((payload: unknown) => {
      const parsedPayload = z.object({ couponId: z.number() }).parse(payload); //validate the incoming object
      return parsedPayload;
    })
    .query(async ({ input }) => {
      const coupon = await prisma.couponsForUser.findFirst({
        where: { couponId: input.couponId },
      });
      return coupon?.used ?? false;
    });
  const getCouponsForUser = publicProcedure
    .input((payload: unknown) => {
      const parsedPayload = GetCouponForUserBySchema.parse(payload); //validate the incoming object
      return parsedPayload;
    })
    .query(async ({ input }) => {
      const coupons = await prisma.couponsForUser
        .findMany({
          where: { userEmail: input.userEmail },
        })
        .then((c) => c.map((c) => c.couponId))
        .then((cIds) => prisma.coupon.findMany({ where: { id: { in: cIds } } }));
      return coupons;
    });

  const couponRoutes = {
    couponCreate: create,
    couponGetByUnique: getByUnique,
    couponUpdate: update,
    couponRemove: remove,
    couponGetAll: getAll,
    couponUse,
    addCouponForUserByGroup,
    getCouponsForUser,
    hasCouponBeenUsed,
  };
  return couponRoutes;
};
