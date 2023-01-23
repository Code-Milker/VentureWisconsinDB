import {
  PrismaClient,
  Prisma,
  Coupon,
} from "../../VentureWisconsinShared/index";
import { z } from "zod";
import {
  ProcedureBuilder,
  RootConfig,
  DefaultErrorShape,
  DefaultDataTransformer,
  unsetMarker,
} from "@trpc/server";

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
      const createCouponSchema = z.object({
        name: z.string(),
        listingId: z.number().int(),
        deal: z.string(),
        expires: z.date(),
      });
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
      const getCouponSchema = z.string();
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
    .input((payload: unknown) => {})
    .query(async ({ input }) => {
      const coupons = await prisma.coupon.findMany();
      return coupons;
    });

  const update = publicProcedure
    .input((payload: unknown) => {
      const createCouponSchema = z.object({
        id: z.number().int(),
        name: z.string(),
        listingId: z.number().int(),
        deal: z.string(),
        expires: z.date(),
      });

      const parsedPayload = createCouponSchema.parse(payload); //validate the incoming object
      return parsedPayload;
    })
    .mutation(async ({ input }) => {
      const coupon = await prisma.coupon.update({
        where: { id: input.id },
        data: { ...input },
      });
      return coupon;
    });

  const remove = publicProcedure
    .input((payload: unknown) => {
      const deleteCouponSchema = z.string(); //validate the incoming object
      const parsedName = deleteCouponSchema.parse(name);
      return parsedName;
    })
    .mutation(async ({ input }) => {
      const removedCoupon = await prisma.coupon.delete({
        where: { name: input },
      });
      return removedCoupon.id;
    });

  // async function DBTests() {
  //   await create({
  //     deal: "50% off banana bread",
  //     expires: new Date(4, 5, 20),
  //     name: "grandmas cookies shop",
  //     listingId: 4,
  //   });
  //   await create({
  //     deal: "bogo bloodies",
  //     expires: new Date(4, 5, 20),
  //     name: "billy's funeral home",
  //     listingId: 4,
  //   });
  //   let coupons = await getAll({});

  //   if (!coupons) {
  //     console.log("no coupon found ");
  //     return;
  //   }

  //   await remove(coupons[0].name);
  //   coupons[1].deal = "new description";
  //   coupons[1].listingId = 2;
  //   console.log(coupons[1]);
  //   await update(coupons[1]);

  //   coupons = await getAll({});
  //   console.log(coupons);
  // }

  const couponRoutes = {
    couponCreate: create,
    couponGetByUnique: getByUnique,
    couponListingUpdate: update,
    couponRemove: remove,
    couponGetAll: getAll,
  };
  return couponRoutes;
};
