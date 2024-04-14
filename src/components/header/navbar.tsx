import { Search, ShoppingCart } from "lucide-react";

const navLinks = ["Categories", "Sale", "Clearance", "New stock", "Trending"];

export const Navbar = () => {
  return (
    <nav>
      <div className="flex w-full items-center justify-between px-10">
        <h1 className="text-3xl font-extrabold">ECOMMERCE</h1>
        <ul className="-ml-20 flex items-center gap-10 font-semibold">
          {navLinks.map((link, index) => (
            <li className="cursor-pointer" key={index}>
              {link}
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-12">
          <button>
            <Search />
          </button>
          <button>
            <ShoppingCart />
          </button>
        </div>
      </div>
    </nav>
  );
};
