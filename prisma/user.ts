import { PrismaClient, Prisma, User } from "@prisma/client";
import { z } from "zod";
import { IFactory, USER_ROLE } from "./consts";

export const UserFactory = (
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >
) => {
  async function create(payload: Omit<User, "id" | "createdAt">) {
    const createUserSchema = z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
      role: z.string(),
    });

    const parsedPayload = createUserSchema.parse(payload); //validate the incoming object
    const user = await prisma.user.create({
      data: { ...parsedPayload },
    });
    return user;
  }

  async function getByUnique(email: string) {
    const getListingSchema = z.string();
    const parsedName = getListingSchema.parse(email); //validate the incoming object
    const user = await prisma.user.findUnique({ where: { email } });
    if (user === null) {
      throw Error("No user found");
    }
    return user;
  }

  async function getAll(filter: any) {
    const users = await prisma.user.findMany();
    return users;
  }

  async function update(email: Partial<User>) {
    const updatedUserSchema = z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
      role: z.string(),
    });

    const parsedPayload = updatedUserSchema.parse(email); //validate the incoming object
    const listings = await prisma.user.update({
      where: { email: parsedPayload.email },
      data: { ...parsedPayload },
    });
    return listings;
  }

  async function remove(identifier: string) {
    const deleteUserSchema = z.string(); //validate the incoming object
    const parsedEmail = deleteUserSchema.parse(identifier);
    const res = await prisma.user.delete({ where: { email: parsedEmail } });
    return res.id;
  }

  async function DBTests() {
    await create({
      email: "ty@deso.org",
      firstName: "Tyler",
      lastName: "Fischer",
      role: USER_ROLE.ADMIN,
    });

    await create({
      email: "dave@dingdong.org",
      firstName: "Dave",
      lastName: "Shuma",
      role: USER_ROLE.USER,
    });

    await create({
      email: "evan@venture-wisconsin.org",
      firstName: "Evan",
      lastName: "Freimuth",
      role: USER_ROLE.USER,
    });

    await create({
      email: "kyle@corndog.org",
      firstName: "Kyle",
      lastName: "Esser",
      role: USER_ROLE.USER,
    });
    let users = await getAll({});

    if (!users) {
      console.log("no listings found ");
      return;
    }
    await remove("dave@dingdong.org");

    users[2].firstName = "Not Evan";
    await update(users[2]);
    users = await getAll({});
  }
  const factory: IFactory<User, "id" | "createdAt"> = {
    create,
    getByUnique,
    getAll,
    update,
    remove,
    DBTests,
  };
  return factory;
};
