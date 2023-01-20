// import { PrismaClient, Prisma } from "../../VentureWisconsinShared/index";
import {
  Listing,
  PrismaClient,
  Prisma,
} from "../../VentureWisconsinShared/index";
import { z } from "zod";
import { IFactory } from "./consts";

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
  async function create(payload: Omit<Listing, "id">) {
    const createListingSchema = z.object({
      name: z.string(),
      address: z.string(),
      category: z.string(),
      description: z.string(),
      email: z.string(),
      phone: z.string(),
      website: z.string(),
    });
    const parsedPayload = createListingSchema.parse(payload); //validate the incoming object
    const listing = await prisma.listing.create({
      data: { ...parsedPayload },
    });
    return listing;
  }

  async function getByUnique(name: string) {
    const getListingSchema = z.string();
    const parsedName = getListingSchema.parse(name); //validate the incoming object
    const listing = await prisma.listing.findUnique({
      where: { name },
    });
    if (listing === null) {
      throw Error("No listing found");
    }

    return listing;
  }

  async function getAll(payload: GetAllListingsParams) {
    const getAllListingsParams = z.object({
      name: z.string().default(""),
    });
    getAllListingsParams.parse(payload);
    const listings = await prisma.listing.findMany({
      where: { name: { startsWith: payload.namePrefix } },
    });
    return listings;
  }

  async function update(payload: Partial<Listing>) {
    const updatedListingSchema = z.object({
      id: z.number().int(),
      name: z.string(),
      address: z.string(),
      category: z.string(),
      description: z.string(),
      email: z.string(),
      phone: z.string(),
    });

    const parsedPayload = updatedListingSchema.parse(payload); //validate the incoming object
    const listings = await prisma.listing.update({
      where: { name: parsedPayload.name },
      data: { ...parsedPayload },
    });
    return listings;
  }

  async function remove(name: string) {
    const deleteListingSchema = z.string(); //validate the incoming object
    const parsedName = deleteListingSchema.parse(name);
    const deletedListing = await prisma.listing.delete({
      where: { name: parsedName },
    });
    return deletedListing.id;
  }

  async function DBTests() {
    await create({
      address: "515 N Main St, Oshkosh, WI 54901",
      name: "d pub",
      website: "https://www.facebook.com/DistilleryPub/",
      email: "dpub@oshkosh.com",
      phone: "(920) 233-2565",
      category: "bars",
      description:
        "Located in historic downtown Oshkosh. Quaint, laid back pub, full-service restaurant and amazing mugs of imported beer.",
    });
    await create({
      email: "mollys@oshkosh.com",
      website: "mollymcguiresoshkosh.com",
      phone: "(920) 233-3301",
      address: "539 Campus Pl, Oshkosh, WI 54901",
      name: "Molly McGuire's",
      category: "bars",
      description:
        "Pub grub, cocktails & draft beer served in a wood-paneled space with a pool table & arcade games.",
    });
    await create({
      address: "430 N Main St, Oshkosh, WI 54901",
      name: "Bar 430",
      email: "bar430@oshkosh.com",
      website: "bar430.com",
      phone: "(920) 230-1114",
      category: "bars",
      description:
        "Venue for classic bar fare with some creative twists, a robust drink menu & brunch on weekends.",
    });
    await create({
      address: "566 N Main St, Oshkosh, WI 54901",
      website: "https://www.facebook.com/fletchslocaltaphouse/",
      name: "Fletch's Local Tap House",
      email: "fletch's@oshkosh.com",
      phone: "(920) 385-1571",
      category: "bars",
      description: "A place to do things.",
    });
    let listings = await getAll({});

    if (!listings) {
      console.log("no listings found ");
      return;
    }

    await remove(listings[0].name);
    listings[1].description = "new description";
    console.log(listings[1]);
    await update(listings[1]);

    listings = await getAll({});
    console.log(listings);
  }

  const factory: IFactory<Listing, "id"> = {
    create,
    getByUnique,
    update,
    remove,
    DBTests,
    getAll,
  };
  return factory;
};
