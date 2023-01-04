import { PrismaClient, Prisma, User } from "@prisma/client";
import { z } from "zod";
import { USER_ROLE } from "./consts";

export const UserFactory = (
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >
) => {
  async function createUser(payload: Omit<User, "id" | "createdAt">) {
    const createUserSchema = z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
      role: z.string(),
    });

    try {
      const parsedPayload = createUserSchema.parse(payload); //validate the incoming object
      const user = await prisma.user.create({
        data: { ...parsedPayload },
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function getUserByEmail(email: string) {
    const getListingSchema = z.string();
    try {
      const parsedName = getListingSchema.parse(email); //validate the incoming object
      const user = await prisma.user.findUnique({ where: { email } });
      return user;
    } catch (e) {
      console.log(e);
    }
  }

  async function getAllUsers() {
    try {
      const users = await prisma.user.findMany();
      return users;
    } catch (e) {
      console.log(e);
    }
  }

  async function updateUser(payload: Partial<User>) {
    const updatedUserSchema = z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
      role: z.string(),
    });

    try {
      const parsedPayload = updatedUserSchema.parse(payload); //validate the incoming object
      const listings = await prisma.user.update({
        where: { email: parsedPayload.email },
        data: { ...parsedPayload },
      });
      return listings;
    } catch (e) {
      console.log(e);
    }
  }

  async function deleteUser(email: string) {
    const deleteUserSchema = z.string(); //validate the incoming object
    try {
      const parsedEmail = deleteUserSchema.parse(email);
      await prisma.user.delete({ where: { email: parsedEmail } });
    } catch (e) {
      console.log(e);
    }
  }

  async function userDBTests() {
    await createUser({
      email: "ty@deso.org",
      firstName: "Tyler",
      lastName: "Fischer",
      role: USER_ROLE.ADMIN,
    });

    await createUser({
      email: "dave@dingdong.org",
      firstName: "Dave",
      lastName: "Shuma",
      role: USER_ROLE.USER,
    });

    await createUser({
      email: "evan@venture-wisconsin.org",
      firstName: "Evan",
      lastName: "Freimuth",
      role: USER_ROLE.USER,
    });

    await createUser({
      email: "kyle@corndog.org",
      firstName: "Kyle",
      lastName: "Esser",
      role: USER_ROLE.USER,
    });
    let users = await getAllUsers();

    if (!users) {
      console.log("no listings found ");
      return;
    }
    await deleteUser("dave@dingdong.org");

    users[2].firstName = "Not Evan";
    await updateUser(users[2]);
    users = await getAllUsers();
  }
  const factory = {
    createUser,
    getUserByEmail,
    getAllUsers,
    updateUser,
    deleteUser,
    userDBTests,
  };
  return factory;
};
