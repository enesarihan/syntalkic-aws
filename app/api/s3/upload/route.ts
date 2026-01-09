import { NextResponse } from "next/server";
import { uploadObject } from "@/lib/aws/s3";

export const maxDuration = 60; // büyük dosyalar için biraz süre tanıyalım

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Dosya bulunamadı. 'file' field zorunlu." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const timestamp = Date.now();
    const key = `uploads/${timestamp}-${file.name}`;

    await uploadObject(key, buffer, file.type);

    return NextResponse.json({
      success: true,
      key,
      message: "Dosya S3 bucket'a yüklendi.",
    });
  } catch (error) {
    console.error("S3 upload error:", error);
    return NextResponse.json(
      { error: "S3'e yükleme sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}

