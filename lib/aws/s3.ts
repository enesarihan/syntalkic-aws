import {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const REGION = process.env.AWS_REGION;
const BUCKET = process.env.AWS_S3_BUCKET_NAME;

if (!REGION || !BUCKET) {
  // Build-time'da hata fırlatmak yerine sadece uyarı verelim
  console.warn(
    "AWS_REGION veya AWS_S3_BUCKET_NAME tanımlı değil. S3 fonksiyonları çalışmayabilir."
  );
}

export const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function listObjects(prefix?: string) {
  if (!BUCKET) {
    throw new Error("AWS_S3_BUCKET_NAME environment variable is not set.");
  }

  const command = new ListObjectsV2Command({
    Bucket: BUCKET,
    Prefix: prefix,
  });

  const response = await s3.send(command);

  return (
    response.Contents?.map((item) => ({
      key: item.Key!,
      size: item.Size ?? 0,
      lastModified: item.LastModified?.toISOString() ?? "",
      // Basit public URL (bucket'ı public yaptıysan çalışır)
      url: `https://${BUCKET}.s3.${REGION}.amazonaws.com/${item.Key}`,
    })) ?? []
  );
}

export async function uploadObject(
  key: string,
  body: Buffer,
  contentType?: string
) {
  if (!BUCKET) {
    throw new Error("AWS_S3_BUCKET_NAME environment variable is not set.");
  }

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  await s3.send(command);
}
