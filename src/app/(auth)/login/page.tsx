"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { api } from "@/trpc/react";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Container } from "@/components/container";

const formSchema = z.object({
  email: z
    .string()
    .email({
      message: "Valid email is required",
    })
    .min(1, {
      message: "Email is required",
    }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = api.user.loginUser.useMutation({
    onSettled: (data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        if (data.redirect) {
          router.replace(data.redirect);
        } else {
          Cookies.set("user", JSON.stringify(data.data));
          localStorage.setItem("user", data?.data);
          router.replace("/");
        }
      }
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }

  return (
    <Container
      pageHeading="Login"
      subHeading="Welcome back to ECOMMERCE"
      tagline=" The next gen business marketplace"
    >
      <>
        {" "}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mx-auto max-w-[70%] space-y-10"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                      />
                      <Button
                        onClick={() => setShowPassword((prev) => !prev)}
                        type="button"
                        variant="ghost"
                        className="hover:bg-transparent"
                      >
                        Show
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isPending}
              className="w-full bg-black py-6 hover:bg-black/90"
            >
              LOGIN
            </Button>
          </form>
        </Form>
        <div className="mx-auto h-[1px] w-full max-w-[70%] rounded bg-neutral-300" />
        <p className="text-center">
          Don{"'"}t have an account?{" "}
          <Link href="/sign-up" className="font-semibold text-black">
            SIGN UP
          </Link>
        </p>
      </>
    </Container>
  );
}
