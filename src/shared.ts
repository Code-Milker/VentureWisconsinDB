import { z } from "zod";
import { Listing } from "../prisma";

export const listingSchema = z.object({
  address: z.string().min(1),
  experience1: z.string().optional().nullable(),
  experience2: z.string().optional().nullable(),
  experience3: z.string().optional().nullable(),
  experience4: z.string().optional().nullable(),
  category: z.string().optional(),
  city: z.string().min(1),
  description: z.string().min(1),
  displayTitle: z.string().min(1),
  email: z.string().email().min(1),
  image1: z.string().min(1).optional().nullable(),
  image2: z.string().min(1).optional().nullable(),
  image3: z.string().min(1).optional().nullable(),
  image4: z.string().min(1).optional().nullable(),
  name: z.string().min(1),
  phone: z.string().min(10),
  subTitle: z.string().optional(),
  website: z.string().min(1),
  zipcode: z.string().min(5),
});

export const getListingSchema = z.string();
export const getListingByIdSchema = z.number();

export const getAllListingsParams = z.object({
  name: z.string().default(""),
  email: z.string().default(""),
});

export const deleteListingSchema = z.string(); //validate the incoming object
export const getAllCouponsSchema = z.string().optional();

export enum CouponTypes {
  percent = "% off",
  offers = "offers",
  dollar = "$ off",
}
type CouponRequest = {
  couponType: CouponTypes;
  listingId?: number;
  name?: string;
  description?: string;
  email?: string;
  dollarsOff?: string;
  expirationDate?: string;
  amountRequiredToQualify?: string;
  percentOff?: string;
  itemName?: string;
  percentOffFor?: string;
};
export const createCouponSchema = z.object({
  name: z.string(),
  listingId: z.number().int(),
  description: z.string(),
  email: z.string(),
  expirationDate: z.string(),
  groupName: z.string().optional().nullable(),
  dollarsOff: z.string().optional().nullable(),
  amountRequiredToQualify: z.string().optional().nullable(),
  percentOff: z.string().optional().nullable(),
  itemName: z.string().optional().nullable(),
  percentOffFor: z.string().optional().nullable(),
  couponType: z.string(),
});
export const getCouponSchema = z.string();
export const couponIdSchema = z.object({
  id: z.number(),
});
export const updateCouponSchema = createCouponSchema.merge(couponIdSchema);
export const useCouponSchema = z.object({
  email: z.string().email(),
  couponId: z.string(),
  passcode: z.string(),
});
export const createNewUserSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  password: z.string().min(8).max(16),
  email: z.string().email(),
});
export const getUserSchema = z.string();

export const updatedUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string(),
  role: z.string(),
  session: z.string().optional(),
});
export const pinListingSchema = z.object({
  listingName: z.string(),
  userEmail: z.string().email(),
});

export const createGroupSchema = z.object({
  groupName: z.string(),
});
export const addCouponForUserByGroupSchema = z.object({
  userEmail: z.string().email(),
  groupName: z.string(),
  code: z.string().min(6),
});

export const GetCouponForUserBySchema = z.object({
  userEmail: z.string().email(),
});

export const deleteUserSchema = z.string(); //validate the incoming object

export const getDefaultCouponGroupName = (
  listingForCoupon: Listing | null | undefined,
) => {
  if (!listingForCoupon) {
    return "";
  }
  // alright so if a coupon doesn't have a group name explicitly given then assign it
  // the display title and id
  // listing can only have one default coupon
  return `${listingForCoupon?.name}`;
};
