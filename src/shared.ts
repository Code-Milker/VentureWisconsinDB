import { z } from "zod";

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
  image1: z.string().min(1),
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

export const getAllListingsParams = z.object({
  name: z.string().default(""),
});

export const deleteListingSchema = z.string(); //validate the incoming object
export const getAllCouponsSchema = z.string().optional();
export const createCouponSchema = z.object({
  name: z.string(),
  listingId: z.number().int().optional(),
  description: z.string(),
  email: z.string(),
  groupName: z.string(),
});

export const getCouponSchema = z.string();

export const updateCouponSchema = z.object({
  id: z.number(),
  name: z.string(),
  listingId: z.number().int(),
  description: z.string(),
  expired: z.boolean().optional(),
  groupName: z.string(),
});

export const deleteCouponSchema = z.string(); //validate the incoming object
export const useCouponSchema = z.object({
  email: z.string().email(),
  couponId: z.number(),
});
export const createNewUserSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  password: z.string().min(8).max(16),
  email: z.string().email(),
});
export const getUserSchema = z.string();

export const updatedUserSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  role: z.string(),
  session: z.string(),
});
export const pinListingSchema = z.object({
  listingName: z.string(),
  userEmail: z.string().email(),
});

export const createGroupSchema = z.object({
  groupName: z.string(),
});

export const deleteUserSchema = z.string(); //validate the incoming object
