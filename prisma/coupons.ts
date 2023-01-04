import { PrismaClient, Prisma, Coupon } from "@prisma/client";
import { z } from "zod";

export const CouponsFactory = (
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >
) => {
  async function createCoupon(payload: Omit<Coupon, "id">) {
    const createCouponSchema = z.object({
      name: z.string(),
      listingId: z.number().int(),
      deal: z.string(),
      expires: z.date(),
    });
    try {
      const parsedPayload = createCouponSchema.parse(payload); //validate the incoming object
      const coupon = await prisma.coupon.create({
        data: { ...parsedPayload },
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function getCouponByName(name: string) {
    const getCouponSchema = z.string();
    try {
      const parsedName = getCouponSchema.parse(name); //validate the incoming object
      const coupon = await prisma.coupon.findUnique({ where: { name } });
      return coupon;
    } catch (e) {
      console.log(e);
    }
  }

  async function getAllCoupons() {
    try {
      const coupons = await prisma.coupon.findMany();
      return coupons;
    } catch (e) {
      console.log(e);
    }
  }

  async function updateCoupon(payload: Partial<Coupon>) {
    const createCouponSchema = z.object({
      id: z.number().int(),
      name: z.string(),
      listingId: z.number().int(),
      deal: z.string(),
      expires: z.date(),
    });

    try {
      const parsedPayload = createCouponSchema.parse(payload); //validate the incoming object
      const coupon = await prisma.coupon.update({
        where: { id: parsedPayload.id },
        data: { ...parsedPayload },
      });
      return coupon;
    } catch (e) {
      console.log(e);
    }
  }

  async function deleteCoupon(id: number) {
    const deleteCouponSchema = z.number().int(); //validate the incoming object
    try {
      const parsedId = deleteCouponSchema.parse(id);
      await prisma.coupon.delete({ where: { id: parsedId } });
    } catch (e) {
      console.log(e);
    }
  }

  async function CouponDBTests() {
    await createCoupon({
      deal: "50% off banana bread",
      expires: new Date(4, 5, 20),
      name: "grandmas cookies shop",
      listingId: 4,
    });
    await createCoupon({
      deal: "bogo bloodies",
      expires: new Date(4, 5, 20),
      name: "billy's funeral home",
      listingId: 4,
    });
    let coupons = await getAllCoupons();

    if (!coupons) {
      console.log("no coupon found ");
      return;
    }

    await deleteCoupon(coupons[0].id);
    coupons[1].deal = "new description";
    coupons[1].listingId = 2;
    console.log(coupons[1]);
    await updateCoupon(coupons[1]);

    coupons = await getAllCoupons();
    console.log(coupons);
  }

  const factory = {
    createCoupon,
    getAllCoupons,
    updateCoupon,
    deleteCoupon,
    CouponDBTests,
  };
  return factory;
};
