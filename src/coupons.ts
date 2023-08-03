import { ProcedureBuilder, RootConfig, DefaultErrorShape, DefaultDataTransformer, unsetMarker } from "@trpc/server";
import {
  createCouponSchema,
  couponIdSchema,
  getAllCouponsSchema,
  getCouponSchema,
  updateCouponSchema,
  useCouponSchema,
  addCouponForUserByGroupSchema,
  GetCouponForUserBySchema,
} from "./shared";
import { PrismaClient, Prisma, Coupon, CouponsForUser, Listing } from "@prisma/client";
import { z } from "zod";
export const couponIsExpired = (date: string | undefined): boolean => {
  if (!date) {
    // throw Error("invalid date");
    return false;
  }
  //prisma likes to return the date as a string :(
  console.log(new Date(date).toDateString());
  console.log(new Date().getTime() > new Date(date as unknown as string).getTime());
  return new Date().getTime() > new Date(date as unknown as string).getTime();
};

const getDefaultCouponGroupName = (listingForCoupon: Listing | null | undefined) => {
  if (!listingForCoupon) {
    return "";
  }
  // alright so if a coupon doesn't have a group name explicitly given then assign it
  // the display title and id
  // listing can only have one default coupon
  return `${listingForCoupon?.displayTitle}`;
};
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
        input.groupName = getDefaultCouponGroupName(listingForCoupon);
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
      await prisma.couponsForUser.deleteMany({ where: { couponId: removedCoupon.id } });
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
        const couponExistsForUser = await prisma.couponsForUser.findFirst({
          where: {
            AND: {
              couponId: input.couponId,
              userEmail: input.email,
            },
          },
        });
        if (!couponExistsForUser) {
          const isCouponForListing = await prisma.coupon
            .findUnique({
              where: { id: input.couponId },
            })
            .then(async (coupon) => {
              const listing = await prisma.listing.findUnique({
                where: { id: coupon?.listingId ?? -1 },
              });
              return { coupon, listing };
            })
            .then(({ listing, coupon }) => getDefaultCouponGroupName(listing) === coupon?.groupName);
          if (isCouponForListing) {
            const response = await prisma.couponsForUser.create({
              data: { couponId: input.couponId, used: true, userEmail: input.email },
            });
            return response;
          } else {
            throw Error("Coupon does not exist for user and coupon is not for listing");
          }
        }
        const response = await prisma.couponsForUser.update({
          where: { id: couponExistsForUser?.id },
          data: { used: true },
        });
        return response;
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

  const getCouponsValidity = async (selectedCoupon: Coupon, couponsForUser: CouponsForUser[], listings: Listing[]) => {
    let couponUsedState: COUPON_USED_STATE = "INVALID";

    const groupExists = await prisma.groups
      .findUnique({ where: { groupName: selectedCoupon?.groupName ?? "" } })
      .then((g) => !!g);
    const couponAvailableToUser = couponsForUser.find((c) => c.couponId === selectedCoupon.id);
    if (couponAvailableToUser?.used) couponUsedState = "USED";
    else if (couponIsExpired(selectedCoupon?.expirationDate as unknown as string)) couponUsedState = "EXPIRED";
    else if (
      getDefaultCouponGroupName(listings.find((l) => l.id === selectedCoupon?.listingId ?? "")) ===
        selectedCoupon?.groupName ||
      groupExists
    ) {
      couponUsedState = "VALID";
    }
    return { couponId: selectedCoupon.id, couponUsedState };
  };
  type COUPON_USED_STATE = "USED" | "EXPIRED" | "VALID" | "INVALID";
  const getUserCouponRelation = publicProcedure
    .input((payload: unknown) => {
      const parsedPayload = GetCouponForUserBySchema.parse(payload); //validate the incoming object
      return parsedPayload;
    })
    .mutation(async ({ input }) => {
      const couponResponse = await prisma.couponsForUser
        .findMany({
          where: { userEmail: input.userEmail },
        })
        .then(async (couponsAvailableToUser: CouponsForUser[]) => {
          const usersCoupons = await prisma.coupon.findMany({
            where: { id: { in: couponsAvailableToUser.map((cIds) => cIds.couponId) } },
          });
          const listings = await prisma.listing.findMany({
            where: { id: { in: usersCoupons.map((c) => c.listingId ?? -1) } },
          });
          const couponsValidity = await Promise.all(
            usersCoupons.map((c) => getCouponsValidity(c, couponsAvailableToUser, listings))
          );
          return { usersCoupons, couponsAvailableToUser, listings, couponsValidity };
        });
      return couponResponse;
    });

  const getCouponsForListing = publicProcedure
    .input((payload: unknown) => {
      const parsedPayload = z.object({ listingId: z.number(), userEmail: z.string().email() }).parse(payload); //validate the incoming object
      return parsedPayload;
    })
    .query(async ({ input }) => {
      const couponsForListing = await prisma.coupon.findMany({ where: { listingId: input.listingId } });
      const listings = await prisma.listing.findMany({ where: { id: input.listingId } });
      const couponsForUser = await prisma.couponsForUser.findMany({ where: { userEmail: input.userEmail } });
      const couponAvailability = await Promise.all(
        couponsForListing.map((c) => getCouponsValidity(c, couponsForUser, listings))
      );
      return { couponsForListing, couponAvailability };
    });

  const getCouponsForGroup = publicProcedure
    .input((payload: unknown) => {
      const parsedPayload = z.object({ groupName: z.string().min(1) }).parse(payload);
      return parsedPayload;
    })
    .mutation(async ({ input }) => {
      const couponsByGroup = await prisma.coupon.findMany({ where: { groupName: input.groupName } });
      console.log(couponsByGroup);
      return couponsByGroup;
    });

  const getListingForCoupon = publicProcedure
    .input((payload: unknown) => {
      const parsedPayload = z.object({ listingId: z.number() }).parse(payload);
      return parsedPayload;
    })
    .mutation(async ({ input }) => {
      const listingForCoupon = await prisma.listing.findUnique({ where: { id: input.listingId } });
      return listingForCoupon;
    });
  const couponRoutes = {
    couponCreate: create,
    couponGetByUnique: getByUnique,
    couponUpdate: update,
    couponRemove: remove,
    couponGetAll: getAll,
    couponUse,
    addCouponForUserByGroup,
    hasCouponBeenUsed,
    getUserCouponRelation,
    getCouponsForListing,
    getCouponsForGroup,
    getListingForCoupon,
  };
  return couponRoutes;
};
