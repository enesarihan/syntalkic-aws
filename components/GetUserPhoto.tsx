"use client";
import { getAuth, User as GoogleUser, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const GetUserPhoto = ({
  className,
  height,
  width,
}: {
  className?: string;
  height: string;
  width: string;
}) => {
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

  const firstInitial = currentUser?.displayName?.charAt(0)?.toUpperCase() ?? "";
  const isGoogleUser = currentUser?.providerData?.some(
    (provider) => provider.providerId === "google.com"
  );

  if (isGoogleUser && currentUser?.photoURL) {
    return (
      <Image
        alt="profile-cover"
        src={currentUser.photoURL}
        width={parseInt(width) * 4}
        height={parseInt(height) * 4}
        className={cn(className)}
      />
    );
  } else {
    return (
      <Button
        className={cn(
          `w-${width} h-${height} p-3 bg-slate-900 dark:bg-gray-200`,
          className
        )}
      >
        {firstInitial}
      </Button>
    );
  }
};

export default GetUserPhoto;
