"use server";
import { db, auth } from "@/firebase/admin";
import { FirebaseError } from "firebase/app";
import { getCurrentUser } from "@/lib/actions/auth.actions"; // varsa

// Firebase Admin ile güncelleme fonksiyonu
export async function updateProfile(user: { name: string }) {
  try {
    // Kullanıcı bilgilerini almak için custom auth method
    const getUser = await getCurrentUser();
    if (!getUser?.id) throw new Error("User not found");

    // Firestore'da kullanıcıyı bulmak
    const currentUser = await db
      .collection("users")
      .where("uid", "==", getUser.id)
      .get();

    if (currentUser.empty) {
      throw new Error("User not found in Firestore");
    }

    // Firestore kullanıcı belgesini güncelleme
    await db.collection("users").doc(currentUser.docs[0].id).update({
      name: user.name,
    });

    // Firebase Auth'da kullanıcı bilgilerini güncelleme
    if (getUser) {
      // Firebase Admin SDK kullanarak auth bilgilerini güncelle
      await auth.updateUser(getUser.id, {
        displayName: user.name,
      });
    } else {
      throw new Error("No authenticated user in Firebase Auth");
    }

    return {
      success: true,
      message: "Profile updated successfully.",
    };
  } catch (error: unknown) {
    const firebaseError = error as FirebaseError;
    console.error("Update profile error:", error);
    return {
      success: false,
      message:
        firebaseError?.message ||
        "Something went wrong while updating profile.",
    };
  }
}
