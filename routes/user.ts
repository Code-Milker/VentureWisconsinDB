import { PrismaClient, Prisma, User } from "../../VentureWisconsinShared/index";
import { z } from "zod";
import {
  ProcedureBuilder,
  RootConfig,
  DefaultErrorShape,
  DefaultDataTransformer,
  unsetMarker,
} from "@trpc/server";

export const UserRoutes = (
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
      const createUserSchema = z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string(),
        role: z.string(),
      });
      const parsedPayload = createUserSchema.parse(payload); //validate the incoming object
      return parsedPayload;
    })
    .mutation(async ({ input }) => {
      const user = await prisma.user.create({
        data: { ...input },
      });
      return user;
    });

  const getByUnique = publicProcedure
    .input((payload: unknown) => {
      const getListingSchema = z.string();
      const parsedName = getListingSchema.parse(payload); //validate the incoming object
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
    .input((payload: unknown) => {
      const updatedUserSchema = z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string(),
        role: z.string(),
      });

      const parsedPayload = updatedUserSchema.parse(payload); //validate the incoming object
      return parsedPayload;
    })
    .mutation(async ({ input }) => {
      const listings = await prisma.user.update({
        where: { email: input.email },
        data: { ...input },
      });
      return listings;
    });

  const remove = publicProcedure
    .input((payload: unknown) => {
      const deleteUserSchema = z.string(); //validate the incoming object
      const parsedEmail = deleteUserSchema.parse(payload);
      return parsedEmail;
    })
    .mutation(async ({ input }) => {
      const res = await prisma.user.delete({ where: { email: input } });
      return res.id;
    });

  // async function DBTests() {
  //   await create({
  //     email: "ty@deso.org",
  //     firstName: "Tyler",
  //     lastName: "Fischer",
  //     role: USER_ROLE.ADMIN,
  //   });

  //   await create({
  //     email: "dave@dingdong.org",
  //     firstName: "Dave",
  //     lastName: "Shuma",
  //     role: USER_ROLE.USER,
  //   });

  //   await create({
  //     email: "evan@venture-wisconsin.org",
  //     firstName: "Evan",
  //     lastName: "Freimuth",
  //     role: USER_ROLE.USER,
  //   });

  //   await create({
  //     email: "kyle@corndog.org",
  //     firstName: "Kyle",
  //     lastName: "Esser",
  //     role: USER_ROLE.USER,
  //   });
  //   let users = await getAll({});

  //   if (!users) {
  //     console.log("no listings found ");
  //     return;
  //   }
  //   await remove("dave@dingdong.org");

  //   users[2].firstName = "Not Evan";
  //   await update(users[2]);
  //   users = await getAll({});
  // }
  const userRoutes = {
    userCreate: create,
    userGetByUnique: getByUnique,
    userListingUpdate: update,
    userRemove: remove,
    userGetAll: getAll,
  };
  return userRoutes;
};
