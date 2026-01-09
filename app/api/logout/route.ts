import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });
  const isSecure =
    process.env.NODE_ENV === "production" && process.env.USE_HTTPS === "true";
  response.cookies.set("session", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
    secure: isSecure,
  });
  return response;
}
