"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Container } from "@/components/container";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Username is required",
  }),
  email: z
    .string()
    .email({
      message: "Valid email is required",
    })
    .min(2, {
      message: "Email is required",
    }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

export default function Register() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = api.user.createUser.useMutation({
    onSettled: (data: {
      success?: string;
      error?: string;
      userId?: number;
    }) => {
      if (data.error) {
        toast.error(data.error);
        form.reset();
      }
      if (data.success) {
        router.push(`/verify?userId=${data.userId}`);
      }
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }

  return (
    <Container pageHeading="Create your account">
      <>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mx-auto max-w-[70%] space-y-10"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
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
                    <Input {...field} type="password" />
                  </FormControl>

                  <FormMessage />
                  <FormDescription>
                    Must me at least 8 chars long
                  </FormDescription>
                </FormItem>
              )}
            />
            <Button
              disabled={isPending}
              className="w-full bg-black py-6 hover:bg-black/90"
            >
              CREATE ACCOUNT
            </Button>
          </form>
        </Form>
        <p className="text-center">
          Have an Account?{" "}
          <Link href="/login" className="font-semibold text-black">
            LOGIN
          </Link>
        </p>
      </>
    </Container>
  );
}
