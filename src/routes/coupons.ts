import { Prisma, PrismaClient } from "@prisma/client";
import {
  ProcedureBuilder,
  RootConfig,
  DefaultErrorShape,
  DefaultDataTransformer,
  unsetMarker,
} from "@trpc/server";
import {
  createCouponSchema,
  deleteCouponSchema,
  getAllCouponsSchema,
  getCouponSchema,
  updateCouponSchema,
  useCouponSchema,
} from "../shared";

export const CouponRoutes = (
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >,
  publicProcedure:
    | ProcedureBuilder<{
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
    | undefined
) => {
  if (!publicProcedure) {
    throw Error("public Procedure not found");
  }
  const create = publicProcedure
    .input((payload: unknown) => {
      const parsedPayload = createCouponSchema.parse(payload); //validate the incoming object
      return parsedPayload;
    })
    .mutation(async ({ input }) => {
      const coupon = await prisma.coupon.create({
        data: { ...input },
      });
      return coupon;
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
          include: { couponsUsedByUser: true },
        });
        return coupons;
      } else {
        const coupons = await prisma.coupon.findMany({
          include: { couponsUsedByUser: true },
        });
        return coupons;
      }
    });

  const update = publicProcedure
    .input((payload: unknown) => {
      const parsedPayload = updateCouponSchema.parse(payload); //validate the incoming object
      return parsedPayload;
    })
    .mutation(async ({ input }) => {
      const { groupName, ...i } = input;
      if (groupName) {
        const alreadyExists = await prisma.groups.findUnique({
          where: { groupName },
        });
        if (!alreadyExists) {
          await prisma.groups.create({
            data: { groupName: groupName },
          });
        }
      }
      const coupon = await prisma.coupon.update({
        where: { id: input.id },
        data: { ...input },
      });
      return coupon;
    });

  const remove = publicProcedure
    .input((payload: unknown) => {
      const parsedName = deleteCouponSchema.parse(name);
      return parsedName;
    })
    .mutation(async ({ input }) => {
      const removedCoupon = await prisma.coupon.delete({
        where: { name: input },
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
        const existAlready = await prisma.couponsForUser.findFirst({
          where: { couponId: input.couponId, userEmail: input.email },
        });

        if (!existAlready) {
          const response = await prisma.couponsForUser.create({
            data: {
              userId: user?.id,
              couponId: input.couponId,
              userEmail: input.email,
              used: true,
            },
          });
          return response;
        } else {
          const response = await prisma.couponsForUser.update({
            where: {
              id: existAlready.id,
            },
            data: { ...existAlready, used: true },
          });
          return response;
        }
      }
    });

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
