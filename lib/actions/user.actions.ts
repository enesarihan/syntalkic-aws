import { getAuth, updatePassword } from "firebase/auth";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { updateProfile as firebaseUpdateProfile } from "firebase/auth";

export async function updateProfile(user: { name: string }) {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) throw new Error("User not Found.");

    const db = getFirestore();
    const userRef = doc(db, "users", currentUser.uid);

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

export async function updatePasswordU(newPassword: string) {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.error("User not Found!");
      return { success: false, message: "Please sign in first!" };
    }

    await updatePassword(currentUser, newPassword);

    return { success: true, message: "Password change sucessfully" };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong while changing password!" + error,
    };
  }
}
