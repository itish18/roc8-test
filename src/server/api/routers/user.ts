import { z } from "zod";
import bcrypt from "bcryptjs";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { sendMail } from "@/utils/mail";
import { generateOTP } from "@/utils/otp-generator";

export const userRouter = createTRPCRouter({
  getUserById: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: Number(input.id) },
        include: {
          categories: true,
        },
      });

      return { id: user?.id, favorite: user?.categories };
    }),

  createUser: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email().min(1),
        password: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.email || !input.password || !input.name) {
        return { error: "Provide all credentials" };
      }

      const existingUser = await ctx.db.user.findFirst({
        where: { email: input.email },
      });

      if (existingUser) {
        return {
          error: "User already exists",
        };
      }

      const password = input.password;
      const hashedPassword = await bcrypt.hash(password, 8);

      const otp = generateOTP(6);

      await sendMail(input.email, otp);

      const createdUser = await ctx.db.user.create({
        data: {
          ...input,
          password: hashedPassword,
          isVerified: false,
          verificationToken: otp,
        },
      });
      return { success: "User created successfully", userId: createdUser.id };
    }),

  verfiyUser: publicProcedure
    .input(
      z.object({
        token: z.string().min(1),
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { token, id } = input;

      if (!token || !id) {
        return { error: "Invalid credentials" };
      }

      const existingUser = await ctx.db.user.findUnique({
        where: { id: Number(id), verificationToken: token, isVerified: false },
      });

      if (!existingUser) {
        return { error: "Invalid otp" };
      }

      await ctx.db.user.update({
        where: { id: Number(id) },
        data: { isVerified: true, verificationToken: "" },
      });

      return { success: "Account verified" };
    }),

  loginUser: publicProcedure
    .input(
      z.object({
        email: z.string().min(1),
        password: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { email, password } = input;
      if (!email || !password) {
        return { error: "All fields required" };
      }

      const existingUser = await ctx.db.user.findFirst({
        where: { email },
      });

      if (!existingUser) {
        return { error: "Incorrect credentials" };
      }

      const checkedPassword: boolean = await bcrypt.compare(
        password,
        existingUser.password,
      );

      if (!checkedPassword) {
        return { error: "Incorrect credentials" };
      }

      if (!existingUser.isVerified) {
        const otp = generateOTP(6);

        await sendMail(input.email, otp);

        return {
          success: "OTP sent successfully",
          redirect: `/verify?userId=${existingUser.id}`,
        };
      }

      return {
        success: "login successfull",
        data: { id: existingUser.id },
      };
    }),
});
