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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";

import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/components/container";

const formSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export default function Verify() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pin: "",
    },
  });

  const { mutate, isPending } = api.user.verfiyUser.useMutation({
    onSettled: (data: { success?: string; error?: string }) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        toast.success(data.success);
        router.push("/login");
      }
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({ token: values.pin, id: searchParams.get("userId") });
  }
  return (
    <Container
      pageHeading="Verify your email"
      tagline="Enter the 8 digit code you have received"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto max-w-[70%] space-y-10"
        >
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl">Code</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup className="flex w-full items-center justify-between">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={isPending}
            className="w-full bg-black py-6 hover:bg-black/90"
          >
            VERIFY
          </Button>
        </form>
      </Form>
    </Container>
  );
}
