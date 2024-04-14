/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { Container } from "@/components/container";
import { api } from "@/trpc/react";
import { toast } from "sonner";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

import { Checkbox } from "@/components/ui/checkbox";
import { Loader } from "@/components/loader";
import Cookies from "js-cookie";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Favorite {
  id?: number;
  userId: number;
  catId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface User {
  id: number | undefined;
  favorite: Favorite[] | undefined;
}

export default function Home() {
  const userString: string | undefined = Cookies.get("user");
  const router = useRouter();

  if (!userString) {
    router.replace("/login");
  }

  const [userFavorite, setUserFavorite] = useState<Favorite[]>([]);
  const [clickedCat, setClickedCat] = useState<Favorite>({});

  const user = userString ? JSON.parse(userString) : undefined;
  const { data, isLoading, error } = api.cat.get.useQuery<Category[]>();
  const { data: userData, isLoading: userDataLoading } =
    api.user.getUserById.useQuery<User>({
      id: user?.id.toString(),
    });

  useEffect(() => {
    if (userData) {
      setUserFavorite(userData.favorite);
    }
  }, [userData]);

  const { mutate } = api.cat.update.useMutation({
    onMutate: () => {
      const isFavCat = userFavorite.find(
        (fav) => fav.catId == clickedCat.catId,
      );
      if (isFavCat) {
        setUserFavorite((prev) =>
          prev.filter((fav) => fav.catId != clickedCat.catId),
        );
      } else {
        setUserFavorite((prev) => [...prev, clickedCat]);
      }
    },
  });

  if (isLoading || userDataLoading) {
    return (
      <div className="mx-auto my-32 flex max-w-[35%] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    toast.error(error.message);
    return;
  }

  const handleMarkChange = (catId: number) => {
    if (userData) {
      mutate({ userId: userData?.id, catId });
      setClickedCat({ userId: userData?.id, catId });
    }
  };

  return (
    <Container
      pageHeading="Please mark your interests!"
      tagline="We will keep you notified."
    >
      <div className="space-y-8 px-20">
        <p className="text-2xl font-semibold">My saved interests!</p>
        {data?.slice(0, 6).map((cat: Category) => (
          <div key={cat.id} className="flex items-center space-x-2">
            <Checkbox
              id={cat.id.toString()}
              onCheckedChange={() => handleMarkChange(cat.id)}
              checked={
                userFavorite?.find((fav) => fav.catId === cat.id)
                  ? true
                  : undefined
              }
            />
            <label
              htmlFor={cat.id.toString()}
              className="text-lg  leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {cat.name}
            </label>
          </div>
        ))}

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <button>Previous</button>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <button>Next</button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </Container>
  );
}
