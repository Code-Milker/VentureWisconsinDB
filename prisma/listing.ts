import { PrismaClient, Prisma, Listing } from "@prisma/client";
import { z } from "zod";

export interface GetAllListingsParams {
  namePrefix?: string;
}
export const ListingsFactory = (
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >
) => {
  async function createListing(payload: Omit<Listing, "id">) {
    const createListingSchema = z.object({
      name: z.string(),
      address: z.string(),
      category: z.string(),
      description: z.string(),
      email: z.string(),
      phone: z.string(),
      website: z.string(),
    });

    try {
      const parsedPayload = createListingSchema.parse(payload); //validate the incoming object
      const listing = await prisma.listing.create({
        data: { ...parsedPayload },
      });
      return listing;
    } catch (e) {
      console.log(e);
    }
  }

  async function getListingsByName(name: string) {
    const getListingSchema = z.string();
    try {
      const parsedName = getListingSchema.parse(name); //validate the incoming object
      const listings = await prisma.listing.findMany({
        where: { name: { startsWith: parsedName } },
      });
      return listings;
    } catch (e) {
      console.log(e);
    }
  }

  async function getAllListings(payload: GetAllListingsParams) {
    const getAllListingsParams = z.object({
      name: z.string().default(""),
    });
    getAllListingsParams.parse(payload);
    try {
      const listings = await prisma.listing.findMany({
        where: { name: { startsWith: payload.namePrefix } },
      });
      return listings;
    } catch (e) {
      console.log(e);
    }
  }

  async function updateListing(payload: Partial<Listing>) {
    const updatedListingSchema = z.object({
      id: z.number().int(),
      name: z.string(),
      address: z.string(),
      category: z.string(),
      description: z.string(),
      email: z.string(),
      phone: z.string(),
    });

    try {
      const parsedPayload = updatedListingSchema.parse(payload); //validate the incoming object
      const listings = await prisma.listing.update({
        where: { name: parsedPayload.name },
        data: { ...parsedPayload },
      });
      return listings;
    } catch (e) {
      console.log(e);
    }
  }

  async function deleteListing(id: number) {
    const deleteListingSchema = z.number().int(); //validate the incoming object
    try {
      const parsedId = deleteListingSchema.parse(id);
      await prisma.listing.delete({ where: { id: parsedId } });
    } catch (e) {
      console.log(e);
    }
  }

  async function ListingsDBTests() {
    await createListing({
      address: "515 N Main St, Oshkosh, WI 54901",
      name: "d pub",
      website: "https://www.facebook.com/DistilleryPub/",
      email: "dpub@oshkosh.com",
      phone: "(920) 233-2565",
      category: "bars",
      description:
        "Located in historic downtown Oshkosh. Quaint, laid back pub, full-service restaurant and amazing mugs of imported beer.",
    });
    await createListing({
      email: "mollys@oshkosh.com",
      website: "mollymcguiresoshkosh.com",
      phone: "(920) 233-3301",
      address: "539 Campus Pl, Oshkosh, WI 54901",
      name: "Molly McGuire's",
      category: "bars",
      description:
        "Pub grub, cocktails & draft beer served in a wood-paneled space with a pool table & arcade games.",
    });
    await createListing({
      address: "430 N Main St, Oshkosh, WI 54901",
      name: "Bar 430",
      email: "bar430@oshkosh.com",
      website: "bar430.com",
      phone: "(920) 230-1114",
      category: "bars",
      description:
        "Venue for classic bar fare with some creative twists, a robust drink menu & brunch on weekends.",
    });
    await createListing({
      address: "566 N Main St, Oshkosh, WI 54901",
      website: "https://www.facebook.com/fletchslocaltaphouse/",
      name: "Fletch's Local Tap House",
      email: "fletch's@oshkosh.com",
      phone: "(920) 385-1571",
      category: "bars",
      description: "A place to do things.",
    });
    let listings = await getAllListings({});

    if (!listings) {
      console.log("no listings found ");
      return;
    }

    await deleteListing(listings[0].id);
    listings[1].description = "new description";
    console.log(listings[1]);
    await updateListing(listings[1]);

    listings = await getAllListings({});
    console.log(listings);
  }

  const factory = {
    createListing,
    getListingsByName,
    updateListing,
    deleteListing,
    ListingsDBTests,
    getAllListings,
  };
  return factory;
};
