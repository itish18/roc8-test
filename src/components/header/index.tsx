import { Navbar } from "./navbar";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Header = () => {
  return (
    <div className="w-full space-y-5 py-5">
      <ul className="flex items-center justify-end gap-8 px-10 text-sm">
        <li className="cursor-pointer">Help</li>
        <li className="cursor-pointer">Orders & Returns</li>
        <li className="cursor-pointer">Hi, John</li>
      </ul>
      <Navbar />
      <div className="flex items-center justify-center bg-[#F4F4F4] py-2 font-[500]">
        <p className="flex items-center gap-8">
          <ChevronLeft />
          Get 10% off on business sign up
          <ChevronRight />
        </p>
      </div>
    </div>
  );
};
