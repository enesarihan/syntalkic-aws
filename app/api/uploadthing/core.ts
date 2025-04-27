import { db } from "@/firebase/admin";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getAuth } from "firebase-admin/auth";
import { z } from "zod";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "8MB" },
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

      const userDocRef = db.collection("users").doc(userId); // ADMIN doğru kullanım

      try {
        const docSnap = await userDocRef.get(); // ADMIN doğru kullanım

        if (docSnap.exists) {
          await userDocRef.update({
            profileImageUrl: profileImageUrl,
            updatedAt: new Date(),
          });
        } else {
          await userDocRef.set({
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
