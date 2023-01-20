import {
  PrismaClient,
  Prisma,
  Coupon,
} from "../../VentureWisconsinShared/index";
import { z } from "zod";
import { IFactory } from "./consts";

export const CouponFactory = (
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >
) => {
  async function create(payload: Omit<Coupon, "id">) {
    const createCouponSchema = z.object({
      name: z.string(),
      listingId: z.number().int(),
      deal: z.string(),
      expires: z.date(),
    });
    const parsedPayload = createCouponSchema.parse(payload); //validate the incoming object
    const coupon = await prisma.coupon.create({
      data: { ...parsedPayload },
    });
    return coupon;
  }

  async function getByUnique(name: string) {
    const getCouponSchema = z.string();
    const parsedName = getCouponSchema.parse(name); //validate the incoming object
    const coupon = await prisma.coupon.findUnique({ where: { name } });
    if (coupon === null) {
      throw Error("No coupon found");
    }
    return coupon;
  }

  async function getAll(filter: any) {
    const coupons = await prisma.coupon.findMany();
    return coupons;
  }

  async function update(payload: Partial<Coupon>) {
    const createCouponSchema = z.object({
      id: z.number().int(),
      name: z.string(),
      listingId: z.number().int(),
      deal: z.string(),
      expires: z.date(),
    });

    const parsedPayload = createCouponSchema.parse(payload); //validate the incoming object
    const coupon = await prisma.coupon.update({
      where: { id: parsedPayload.id },
      data: { ...parsedPayload },
    });
    return coupon;
  }

  async function remove(name: string) {
    const deleteCouponSchema = z.string(); //validate the incoming object
    const parsedName = deleteCouponSchema.parse(name);
    const removedCoupon = await prisma.coupon.delete({
      where: { name: parsedName },
    });
    return removedCoupon.id;
  }

  async function DBTests() {
    await create({
      deal: "50% off banana bread",
      expires: new Date(4, 5, 20),
      name: "grandmas cookies shop",
      listingId: 4,
    });
    await create({
      deal: "bogo bloodies",
      expires: new Date(4, 5, 20),
      name: "billy's funeral home",
      listingId: 4,
    });
    let coupons = await getAll({});

    if (!coupons) {
      console.log("no coupon found ");
      return;
    }

    await remove(coupons[0].name);
    coupons[1].deal = "new description";
    coupons[1].listingId = 2;
    console.log(coupons[1]);
    await update(coupons[1]);

    coupons = await getAll({});
    console.log(coupons);
  }

  const factory: IFactory<Coupon, "id"> = {
    create,
    getByUnique,
    getAll,
    update,
    remove,
    DBTests,
  };
  return factory;
};
