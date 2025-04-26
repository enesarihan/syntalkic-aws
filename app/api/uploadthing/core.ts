import { db } from "@/firebase/client";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase-admin/auth";
import { z } from "zod";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB" },
  })
    .input(z.object({ token: z.string() }))
    .middleware(async ({ input }) => {
      const token = input?.token;
      if (!token) throw new UploadThingError("Unauthorized");

      const decoded = await getAuth().verifyIdToken(token);
      return { userId: decoded.uid };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const userId = metadata.userId;
      const profileImageUrl = file.ufsUrl;

      const userDocRef = doc(db, "users", userId);

      try {
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          await updateDoc(userDocRef, {
            profileImageUrl: profileImageUrl,
            updatedAt: new Date(),
          });
        } else {
          await setDoc(userDocRef, {
            profileImageUrl: profileImageUrl,
            createdAt: new Date(),
          });
        }
        return { uploadedBy: userId, url: profileImageUrl };
      } catch (err) {
        console.error("Firestore Error:", err);
        throw new Error("Failed to upload/add profile picture");
      }
    }),
} satisfies FileRouter;
export type OurFileRouter = typeof ourFileRouter;
