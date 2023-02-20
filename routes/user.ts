import { PrismaClient, Prisma } from "../../VentureWisconsinShared/index";
import {
  ProcedureBuilder,
  RootConfig,
  DefaultErrorShape,
  DefaultDataTransformer,
  unsetMarker,
} from "@trpc/server";
import {
  createNewUserSchema,
  deleteUserSchema,
  getUserSchema,
  updatedUserSchema,
} from "../../VentureWisconsinShared/shared";
import { z } from "zod";
import bCrypt from "bcrypt";

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
      const parsedPayload = createNewUserSchema.parse(payload); //validate the incoming object
      return parsedPayload;
    })
    .mutation(async ({ input }) => {
      const hashedPassword = await bCrypt.hash(input.password, 0);
      const user = await prisma.user.create({
        data: { ...input, password: hashedPassword },
      });
      return user;
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
    .input((payload: unknown) => {
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
      const parsedEmail = deleteUserSchema.parse(payload);
      return parsedEmail;
    })
    .mutation(async ({ input }) => {
      const res = await prisma.user.delete({ where: { email: input } });
      return res.id;
    });

  const userSession = publicProcedure
    .input(async (payload: unknown) => {
      const parsedPayload = z.string().parse(payload);

      return parsedPayload;
    })

    .mutation(async ({ input }) => {
      // const isValidHash = await bCrypt.;
      return;
    });
  const userLogin = publicProcedure
    .input(async (payload: unknown) => {
      const loginSchema = z.object({
        username: z.string().min(1),
        password: z.string().min(8),
      });
      const parsedPayload = loginSchema.parse(payload);
      return { ...parsedPayload };
    })
    .mutation(async ({ input }) => {
      const hashedPassword = await bCrypt.hash(input.password, 0);
      return { ...input, hashedPassword };
    });

  const userRoutes = {
    userCreate: create,
    userGetByUnique: getByUnique,
    userListingUpdate: update,
    userRemove: remove,
    userGetAll: getAll,
    userLogin,
  };
  return userRoutes;
};
