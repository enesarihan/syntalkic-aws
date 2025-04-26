"use client";
import { getAuth, User as GoogleUser, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const GetUserPhoto = ({ className }: { className?: string }) => {
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
      <Avatar className={className}>
        <AvatarImage src={currentUser.photoURL} />
        <AvatarFallback>{firstInitial}</AvatarFallback>
      </Avatar>
    );
  } else if (profileImageUrl) {
    return (
      <Avatar className={className}>
        <AvatarImage src={profileImageUrl} />
        <AvatarFallback>{firstInitial}</AvatarFallback>
      </Avatar>
    );
  } else {
    return (
      <Avatar className={className}>
        <AvatarFallback>{firstInitial}</AvatarFallback>
      </Avatar>
    );
  }
};

export default GetUserPhoto;
