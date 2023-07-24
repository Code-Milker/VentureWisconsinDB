import { DefaultDataTransformer, DefaultErrorShape, ProcedureBuilder, RootConfig, unsetMarker } from "@trpc/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { USER_ROLE } from "./consts";
import { listingSchema, getListingSchema, getAllListingsParams, deleteListingSchema } from "./shared";

export interface GetAllListingsParams {
  namePrefix?: string;
}

export const ListingsRoutes = (
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
    .input((payload: unknown) => {
      const parsedPayload = listingSchema.parse(payload); //validate the incoming object
      return parsedPayload;
    })
    .mutation(async ({ input }) => {
      const listing = await prisma.listing
        .create({
          data: { ...input },
        })
        .then(async (listing) => {
          await prisma.user.findUnique({ where: { email: listing.email } });
          await prisma.user.update({ where: { email: listing.email }, data: { pendingAccountChange: true } });
          return listing;
        });
      return listing;
    });
  const getByUnique = publicProcedure
    .input((payload: unknown) => {
      const parsedName = getListingSchema.parse(name); //validate the incoming object
      return parsedName;
    })
    .query(async ({ input }) => {
      const listing = await prisma.listing.findUnique({
        where: { name: input },
      });

      if (listing === null) {
        throw Error("No listing found");
      }
      return listing;
    });
  const getAll = publicProcedure
    .input((payload: unknown) => {
      const res = getAllListingsParams.parse(payload);
      return res;
    })
    .query(async ({ input }) => {
      const listings = await prisma.listing.findMany({
        where: { name: { startsWith: input.name }, email: { startsWith: input.email } },
      });
      return listings;
    });
  const getAllApprovedListings = publicProcedure
    .input((payload: unknown) => {
      const res = getAllListingsParams.parse(payload);
      return res;
    })
    .query(async ({ input }) => {
      const listings = await prisma.listing.findMany({
        where: { name: { startsWith: input.name }, email: { startsWith: input.email } },
      });
      const approvedListings = await prisma.user
        .findMany({
          where: {
            AND: {
              email: { in: listings.map((l) => l.email) },
              NOT: { role: USER_ROLE.USER },
            },
          },
        })
        .then((approvedUsers) => {
          return listings.filter((l) => approvedUsers.map((u) => u.email).includes(l.email));
        });
      return approvedListings;
    });

  const update = publicProcedure
    .input((payload: unknown) => {
      const parsedPayload = listingSchema.parse(payload); //validate the incoming object
      return parsedPayload;
    })
    .mutation(async ({ input }) => {
      const listings = await prisma.listing.update({
        where: { name: input.name },
        data: { ...input },
      });
      return listings;
    });

  const remove = publicProcedure
    .input((payload: unknown) => {
      const parsedName = deleteListingSchema.parse(payload);
      return parsedName;
    })
    .mutation(async ({ input }) => {
      const deletedListing = await prisma.listing.delete({
        where: { name: input },
      });
      const couponsAssociatedWithListing = await prisma.coupon.findMany({ where: { listingId: deletedListing.id } });
      await prisma.couponsForUser.deleteMany({
        where: { couponId: { in: couponsAssociatedWithListing.map((c) => c.id) } },
      });
      await prisma.coupon.deleteMany({ where: { listingId: deletedListing.id } });
      return deletedListing;
    });

  const listingRoutes = {
    listingCreate: create,
    listingGetByUnique: getByUnique,
    listingUpdate: update,
    listingRemove: remove,
    listingGetAll: getAll,
    getAllApprovedListings,
  };
  return listingRoutes;
};
