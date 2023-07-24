import { DefaultDataTransformer, DefaultErrorShape, ProcedureBuilder, RootConfig, unsetMarker } from "@trpc/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { z } from "zod";

export const GroupsRoutes = (
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
  const getAll = publicProcedure
    .input((payload: unknown) => {
      return z.object({ email: z.string().email() }).parse(payload);
    })
    .mutation(async ({ input }) => {
      const userGroupNames = await prisma.couponsForUser
        .findMany({ where: { userEmail: input.email } })
        .then((uc) => {
          return prisma.coupon.findMany({ where: { id: { in: uc.map((c) => c.couponId) } } });
        })
        .then((uc) => {
          return [...new Set(uc.map((c) => c.groupName))].filter((c) => !!c) as string[]; // set removes dupes
        });
      const groupName = await prisma.groups.findMany();
      return groupName
        .map((g) => {
          return {
            groupName: g.groupName,
            hasActivationCode: g.activationCode !== "NotRequired",
            description: g.description,
          };
        })
        .filter((g) => {
          if (!input.email) return true; // not filtering by what the user has
          return !userGroupNames.includes(g.groupName); // user has this package, don't send it to the drop down
        });
    });
  return { getAllGroups: getAll };
};
