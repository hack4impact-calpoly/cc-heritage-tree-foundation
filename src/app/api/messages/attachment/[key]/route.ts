import { NextRequest, NextResponse } from "next/server";
import s3 from "@/app/api/tree/aws";

export async function GET(req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  try {
    const { key } = await params;
    const decodedKey = decodeURIComponent(key);

    // Generate a pre-signed URL that expires in 1 hour
    const presignedUrl = await s3.getSignedUrlPromise("getObject", {
      Bucket: process.env.AWS_S3_MESSAGES_ATTACHMENT_BUCKET_NAME!,
      Key: decodedKey,
      Expires: 3600, // 1 hour in seconds
    });

    return NextResponse.json({ url: presignedUrl }, { status: 200 });
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    return NextResponse.json({ error: "Failed to generate download URL" }, { status: 500 });
  }
}
