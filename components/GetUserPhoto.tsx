"use client";
import { getAuth, User as GoogleUser, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/client"; // Firebase Firestore'a bağlantı

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
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null); // Firestore'dan alınacak profil fotoğrafı URL'si

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);

      if (user) {
        const fetchUserProfile = async () => {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setProfileImageUrl(userData?.profileImageUrl || null);
          }
        };

        fetchUserProfile();
      }
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
  } else if (profileImageUrl) {
    return (
      <div className="rounded-full overflow-hidden">
        <Image
          alt="profile-cover"
          src={profileImageUrl}
          width={parseInt(width) * 4}
          height={parseInt(height) * 4}
          className={cn(className, "object-cover rounded-full")}
        />
      </div>
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
