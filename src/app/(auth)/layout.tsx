"use client";

import { useRouter } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = localStorage.getItem("user");
  const router = useRouter();

  if (user) {
    router.replace("/");
  }

  return <>{children}</>;
}
