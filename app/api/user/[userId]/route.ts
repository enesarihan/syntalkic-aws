import { db } from "@/firebase/admin";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userDoc = await db.collection("users").doc(params.userId).get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();
    return NextResponse.json({
      id: userDoc.id,
      name: userData?.displayName || userData?.name || "Anonymous",
      email: userData?.email || "",
      profileImageUrl: userData?.profileImageUrl || "",
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
