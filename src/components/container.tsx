import type { ReactElement } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export const Container = ({
  children,
  pageHeading,
  subHeading,
  tagline,
}: {
  children: ReactElement;
  pageHeading?: string;
  subHeading?: string;
  tagline?: string;
}) => {
  const router = useRouter();
  const user = localStorage.getItem("user");

  const handleLogout = () => {
    localStorage.removeItem("user");
    Cookies.remove("user");
    router.replace("/login");
  };
  return (
    <div className="mx-auto w-full max-w-[35%] py-5">
      <div className="w-full space-y-10 rounded-3xl border border-neutral-300 py-8">
        <h2 className="text-center text-4xl font-bold">{pageHeading}</h2>
        <div className="space-y-4">
          <h2 className="text-center text-3xl font-semibold">{subHeading}</h2>
          <h3 className="text-center text-xl">{tagline}</h3>
        </div>
        {children}
      </div>
      {user && (
        <div className="mt-10 px-10 text-center">
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      )}
    </div>
  );
};
