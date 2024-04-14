// import { faker } from "@faker-js/faker";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const catRouter = createTRPCRouter({
  // add: publicProcedure.query(async ({ ctx }) => {
  //   const categories = [];
  //   for (let i = 0; i < 100; i++) {
  //     categories.push(faker.commerce.department());
  //   }

  //   await ctx.db.category.createMany({
  //     data: categories.map((name) => ({ name })),
  //   });
  // }),

  get: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.category.findMany();
    return categories;
  }),

  update: publicProcedure
    .input(z.object({ userId: z.number().min(1), catId: z.number().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { userId, catId } = input;

      if (!userId || !catId) {
        return { error: "Id's required" };
      }
      const existingUser = await ctx.db.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        return { error: "User not found" };
      }

      const foundCategory = await ctx.db.category.findUnique({
        where: { id: catId },
      });

      if (!foundCategory) {
        return { error: "Category not found" };
      }

      const allCategories = await ctx.db.category.findMany();

      const isFavorite = await ctx.db.favoriteCategory.findFirst({
        where: {
          userId,
          catId,
        },
      });

      if (isFavorite) {
        await ctx.db.favoriteCategory.delete({
          where: {
            id: isFavorite.id,
          },
        });
        return { success: "Removed as favorite", categories: allCategories };
      }

      await ctx.db.favoriteCategory.create({
        data: {
          userId,
          catId,
        },
      });

      return { success: "Marked favorite", categories: allCategories };
    }),
});
