import { UTApi } from "uploadthing/server";
import { NextResponse } from "next/server";

const utapi = new UTApi();

export async function POST(req: Request) {
  try {
    const { fileKey } = await req.json();

    if (!fileKey) {
      return NextResponse.json(
        { error: "File key is missing." },
        { status: 400 }
      );
    }

    const result = await utapi.deleteFiles(fileKey);

    if (!result.success) {
      throw new Error("Failed to delete file from UploadThing.");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[UPLOADTHING_DELETE_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error while deleting." },
      { status: 500 }
    );
  }
}
