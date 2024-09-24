import {
  createNewUserSchema,
  deleteUserSchema,
  getUserSchema,
  pinListingSchema,
  updatedUserSchema,
} from "./shared";
import { z } from "zod";
import bCrypt from "bcrypt";
import { PrismaClient, Prisma } from "../prisma";
import { USER_ROLE } from "./consts";
import { DefaultArgs } from "../prisma/runtime/library";
export const UserRoutes = (
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  publicProcedure,
) => {
  if (!publicProcedure) {
    throw Error("public Procedure not found");
  }
  const validateUserPermission = async (
    session: string,
    expectedRole: USER_ROLE,
  ) => {
    const user = await prisma.user.findFirst({
      where: { jwt: session },
    });
    if (user === null) return false;
    return user.role === expectedRole;
  };

  const create = publicProcedure
    .input((payload: unknown) => {
      const parsedPayload = createNewUserSchema.parse(payload); //validate the incoming object
      return { ...parsedPayload, email: parsedPayload.email.toLowerCase() };
    })
    .mutation(async ({ input }) => {
      const hashedPassword = await bCrypt.hash(input.password, 0);
      let role = "USER";
      const user = await prisma.user.create({
        data: { ...input, jws: hashedPassword, role },
      });
      return {
        ...user,
        session: user.jwt,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      };
    });

  const getByUnique = publicProcedure
    .input((payload: unknown) => {
      const parsedName = getUserSchema.parse(payload); //validate the incoming object
      return parsedName;
    })
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({ where: { email: input } });
      if (user === null) {
        throw Error("No user found");
      }
      return user;
    });

  const getAll = publicProcedure
    .input((payload: unknown) => {})
    .query(async ({ input }) => {
      const users = await prisma.user.findMany();
      return users;
    });

  const update = publicProcedure
    .input(async (payload: unknown) => {
      const parsedPayload = updatedUserSchema.parse(payload); //validate the incoming object
      // const hasCorrectPermissions = validateUserPermission(parsedPayload.session, USER_ROLE.ADMIN);
      // if (!hasCorrectPermissions) {
      //   throw Error("invalid permissions");
      // }
      return { ...parsedPayload, email: parsedPayload.email.toLowerCase() };
    })
    .mutation(async ({ input }) => {
      const { session, ...data } = input;
      const user = await prisma.user.update({
        where: { email: input.email },
        data,
      });
      return user;
    });

  const remove = publicProcedure
    .input((payload: unknown) => {
      const parsedEmail = deleteUserSchema.parse(payload);
      return parsedEmail.toLowerCase();
    })
    .mutation(async ({ input }) => {
      const res = await prisma.user.delete({ where: { email: input } });
      return res.id;
    });

  // const userLogin = publicProcedure
  //   .input(async (payload: unknown) => {
  //     const loginSchema = z.object({
  //       email: z.string().min(1),
  //       password: z.string().min(8),
  //     });
  //     const parsedPayload = loginSchema.parse(payload);
  //     return { ...parsedPayload, email: parsedPayload.email.toLowerCase() };
  //   })
  //   .mutation(async ({ input }) => {
  //     let user;
  //     try {
  //       user = await prisma.user.findUnique({
  //         where: { email: input.email },
  //       });
  //     } catch (e) {
  //       console.log(e);
  //     }
  //     console.log("user", user);
  //     if (user === null) {
  //       return false;
  //     }
  //     const isCorrectLogin = await bCrypt.compare(
  //       input.password,
  //       user.password,
  //     );
  //     console.log(isCorrectLogin);
  //     console.log("here?");
  //     if (isCorrectLogin) {
  //       return {
  //         email: user.email,
  //         session: user.password,
  //         role: user.role,
  //         firstName: user.firstName,
  //         lastName: user.lastName,
  //       };
  //     } else {
  //       return {
  //         email: null,
  //         session: null,
  //         role: null,
  //         firstName: null,
  //         lastName: null,
  //       };
  //     }
  //   });

  const userUnPinListing = publicProcedure
    .input((payload: unknown) => {
      const parsedPayload = pinListingSchema.parse(payload);
      return {
        ...parsedPayload,
        userEmail: parsedPayload.userEmail.toLowerCase(),
      };
    })
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { email: input.userEmail },
      });
      const listing = await prisma.listing.findUnique({
        where: { name: input.listingName },
      });
      await prisma.pinnedUserListing.deleteMany({
        where: { userId: user?.id, listingId: listing?.id },
      });
    });
  const userPinListing = publicProcedure
    .input((payload: unknown) => {
      const parsedPayload = pinListingSchema.parse(payload);
      return {
        ...parsedPayload,
        userEmail: parsedPayload.userEmail.toLowerCase(),
      };
    })
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { email: input.userEmail },
      });

      const listing = await prisma.listing.findUnique({
        where: { name: input.listingName },
      });
      if (listing && user) {
        const res = await prisma.pinnedUserListing.create({
          data: { userId: user.id, listingId: listing.id },
        });
      }
      // return res.id;
    });
  const getUserPins = publicProcedure
    .input((payload: unknown) => {
      const parsedPayload = z.string().email().parse(payload);
      return parsedPayload;
    })
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({ where: { email: input } });
      if (user) {
        const pins = await prisma.pinnedUserListing.findMany({
          where: { userId: user.id },
        });
        const pinnedIds = pins.map((p: { listingId: any }) => p.listingId);
        const pinnedListing = await prisma.listing.findMany({
          where: { id: { in: pinnedIds } },
        });
        return pinnedListing;
      } else {
        return [];
      }
    });
  const getUserInfo = publicProcedure
    .input((payload: unknown) => {
      const parsedPayload = z
        .object({ email: z.string().email() })
        .parse(payload);
      return parsedPayload;
    })
    .mutation(async ({ input }) => {
      const userCouponsAndListings = await Promise.all([
        prisma.listing.findMany({ where: { email: input.email } }),
        prisma.coupon.findMany({ where: { email: input.email } }),
      ]).then((res) => {
        return { coupons: res[1], listings: res[0] };
      });
      return userCouponsAndListings;
    });

  const getUserListerRequesters = publicProcedure.mutation(async () => {
    const listings = await prisma.listing.findMany();
    const usersWaitingToBeListers = await prisma.user
      .findMany({
        where: {
          pendingAccountChange: true,
        },
      })
      .then((users) => {
        return users
          .filter((user) => {
            return user.role === USER_ROLE.USER; // filter to USER role only
          })
          .map((user) => {
            const listing = listings.find((l) => {
              return l.email === user.email;
            });
            return {
              email: user.email,
              listing: listing ?? {},
            };
          });
      });
    return usersWaitingToBeListers;
  });

  const manageUserApprovalRequest = publicProcedure
    .input((payload: unknown) => {
      const parsedPayload = z
        .object({ email: z.string().email(), accepted: z.boolean() })
        .parse(payload);
      return parsedPayload;
    })
    .mutation(async ({ input }) => {
      await prisma.user.update({
        where: { email: input.email },
        data: {
          pendingAccountChange: false,
          role: input.accepted ? "LISTER" : "USER",
        },
      });
      if (!input.accepted) {
        await prisma.listing.deleteMany({ where: { email: input.email } });
      }
    });
  const userApprovalRequestPending = publicProcedure
    .input((payload: unknown) => {
      const parsedPayload = z
        .object({ email: z.string().email() })
        .parse(payload);
      return parsedPayload;
    })
    .query(async ({ input }) => {
      return await prisma.user
        .findUnique({
          where: { email: input.email },
        })
        .then((u) => u?.pendingAccountChange);
    });

  const userRoutes = {
    userCreate: create,
    userGetByUnique: getByUnique,
    userUpdate: update,
    userRemove: remove,
    userGetAll: getAll,
    // userLogin,
    userPinListing,
    userUnPinListing,
    getUserPins,
    getUserInfo,
    getUserListerRequesters,
    manageUserApprovalRequest,
    userApprovalRequestPending,
  };
  return userRoutes;
};
