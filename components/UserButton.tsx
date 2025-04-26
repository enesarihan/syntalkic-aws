"use client";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import SignOutButton from "./Sign-Out-Button";
import { useEffect, useState } from "react";
import { getAuth, User as GoogleUser, onAuthStateChanged } from "firebase/auth";
import GetUserPhoto from "./GetUserPhoto";

const UserButton = () => {
  const [currentUser, setCurrentUser] = useState<GoogleUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex gap-2 items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex justify-center items-center">
            <GetUserPhoto className="flex items-center justify-center rounded-full object-cover size-[30px]" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="text-sm font-medium leading-none">
              {currentUser?.displayName}
            </div>
            <div className="text-sm text-muted-foreground leading-none">
              {currentUser?.email}
            </div>
          </DropdownMenuLabel>

          <DropdownMenuItem>
            <Button variant={"outline"} className="w-full" asChild>
              <Link href={"/user/profile"} className="w-full">
                Profile
              </Link>
            </Button>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <SignOutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
