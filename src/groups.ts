import { DefaultDataTransformer, DefaultErrorShape, ProcedureBuilder, RootConfig, unsetMarker } from "@trpc/server";
import { PrismaClient, Prisma } from "../prisma";
import { z } from "zod";
import { DefaultArgs } from "../prisma/runtime/library";

export const GroupsRoutes = (
  prisma: PrismaClient,
  publicProcedure: ProcedureBuilder<any>
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
