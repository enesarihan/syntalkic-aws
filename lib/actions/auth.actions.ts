"use server";

import { auth, db } from "@/firebase/admin";
import { getAuth } from "firebase-admin/auth";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    const userRecord = await db.collection("users").doc(uid).get();

    if (userRecord.exists) {
      return {
        success: false,
        message: "User already in exists. Please sign in instead.",
      };
    }

    await db.collection("users").doc(uid).set({
      name: name,
      email: email,
    });

    await getAuth().updateUser(uid, {
      displayName: name,
    });

    return {
      success: true,
      message: "Account created successfully. Please Sign In.",
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error creating a user ", error);

    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "Email already in use.",
      };
    }

    return {
      success: false,
      message: "Failed to create a account",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);

    if (!userRecord) {
      return {
        success: false,
        message: "User does not exist . Create an account instead.",
      };
    }

    await setSessionCookie(idToken);
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to log into an account ",
    };
  }
}

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK * 100,
  });
  cookieStore.set("session", sessionCookie, {
    maxAge: ONE_WEEK,
    httpOnly: true,
    secure: false,
    path: "/",
    sameSite: "lax",
  });
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.error(error);

    return null;
  }
}

export async function isAuthenticated() {
  const user = await getCurrentUser();

  return !!user;
}

export async function signInWithGoogle(idToken: string) {
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const { uid, email, name } = decodedToken;

    const userRecord = await db.collection("users").doc(uid).get();

    if (!userRecord.exists) {
      await db.collection("users").doc(uid).set({
        name: name,
        email: email,
      });
    }

    await setSessionCookie(idToken);

    return {
      success: true,
      message: "Signed in with Google successfully..",
    };
  } catch (error) {
    console.error("Error was signing Google!:", error);
    return {
      success: false,
      message: "Error was signing Google!.",
    };
  }
}
