import { getAuth } from "firebase/auth";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { updateProfile as firebaseUpdateProfile } from "firebase/auth";

export async function updateProfile(user: { name: string }) {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) throw new Error("User not Found.");

    const db = getFirestore();
    const userRef = doc(db, "users", currentUser.uid); // Firestore'da 'users' koleksiyonunda kullanıcı belgelerini güncelliyoruz

    await updateDoc(userRef, {
      name: user.name,
      displayName: user.name,
    });

    await firebaseUpdateProfile(currentUser, {
      displayName: user.name,
    });

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return { success: false, message: "Something went wrong" + error };
  }
}
