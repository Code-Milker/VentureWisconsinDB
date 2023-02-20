import { PrismaClient, Prisma } from "../../VentureWisconsinShared/index";
import {
  DefaultDataTransformer,
  DefaultErrorShape,
  ProcedureBuilder,
  RootConfig,
  unsetMarker,
} from "@trpc/server";
import {
  listingSchema,
  deleteListingSchema,
  getAllListingsParams,
  getListingSchema,
} from "../../VentureWisconsinShared/shared";

export interface GetAllListingsParams {
  namePrefix?: string;
}

export const ListingsRoutes = (
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
      console.log("in create");
      const parsedPayload = listingSchema.parse(payload); //validate the incoming object
      return parsedPayload;
    })
    .mutation(async ({ input }) => {
      const listing = await prisma.listing.create({
        data: { ...input },
      });
      console.log(listing);
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
        where: { name: { startsWith: input.name } },
      });
      return listings;
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
      return deletedListing;
    });

  async function DBTests() {
    // await create({
    //   address: "515 N Main St, Oshkosh, WI 54901",
    //   name: "d pub",
    //   website: "https://www.facebook.com/DistilleryPub/",
    //   email: "dpub@oshkosh.com",
    //   phone: "(920) 233-2565",
    //   category: "bars",
    //   description:
    //     "Located in historic downtown Oshkosh. Quaint, laid back pub, full-service restaurant and amazing mugs of imported beer.",
    // });
    // await create({
    //   email: "mollys@oshkosh.com",
    //   website: "mollymcguiresoshkosh.com",
    //   phone: "(920) 233-3301",
    //   address: "539 Campus Pl, Oshkosh, WI 54901",
    //   name: "Molly McGuire's",
    //   category: "bars",
    //   description:
    //     "Pub grub, cocktails & draft beer served in a wood-paneled space with a pool table & arcade games.",
    // });
    // await create({
    //   address: "430 N Main St, Oshkosh, WI 54901",
    //   name: "Bar 430",
    //   email: "bar430@oshkosh.com",
    //   website: "bar430.com",
    //   phone: "(920) 230-1114",
    //   category: "bars",
    //   description:
    //     "Venue for classic bar fare with some creative twists, a robust drink menu & brunch on weekends.",
    // });
    // await create({
    //   address: "566 N Main St, Oshkosh, WI 54901",
    //   website: "https://www.facebook.com/fletchslocaltaphouse/",
    //   name: "Fletch's Local Tap House",
    //   email: "fletch's@oshkosh.com",
    //   phone: "(920) 385-1571",
    //   category: "bars",
    //   description: "A place to do things.",
    // });
    // let listings = await getAll({});
    // if (!listings) {
    //   console.log("no listings found ");
    //   return;
    // }
    // await remove(listings[0].name);
    // listings[1].description = "new description";
    // console.log(listings[1]);
    // await update(listings[1]);
    // listings = await getAll({});
    // console.log(listings);
  }

  const listingRoutes = {
    listingCreate: create,
    listingGetByUnique: getByUnique,
    listingUpdate: update,
    listingRemove: remove,
    listingGetAll: getAll,
  };
  return listingRoutes;
};
