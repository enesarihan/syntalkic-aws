import { NextResponse } from "next/server";
import { listObjects } from "@/lib/aws/s3";

export async function GET() {
  try {
    const objects = await listObjects();
    return NextResponse.json({ objects });
  } catch (error) {
    console.error("S3 list error:", error);
    return NextResponse.json(
      { error: "S3 bucket listelenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

