"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { Button } from "./ui/button";

const SignOutButton = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await fetch("/api/logout", { method: "POST" });
      toast.success("Signed out successfully!");
      router.push("/sign-in");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(`Error when signing out: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <Button variant="outline" className="w-full" disabled>
        Loading...
      </Button>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Button variant="outline" onClick={handleLogout} className="w-full">
      Sign Out
    </Button>
  );
};

export default SignOutButton;
