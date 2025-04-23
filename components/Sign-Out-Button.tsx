"use client";
import { auth } from "@/firebase/client";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { isAuthenticated } from "@/lib/actions/auth.actions";

const SignOutButton = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const authenticated = await isAuthenticated();
      setIsLoggedIn(authenticated);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        toast.success("Sign out Successfully!");
        router.push("/sign-in");
      })
      .catch((error) => {
        toast.error(`Error when Signing out: ${error.message}`);
      });
  };

  if (loading) {
    return (
      <Button variant="outline" className="w-full">
        Loading...
      </Button>
    );
  }

  if (isLoggedIn) {
    return (
      <Button variant="outline" onClick={handleLogout} className="w-full">
        Sign Out
      </Button>
    );
  } else {
    return null;
  }
};

export default SignOutButton;
