import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/database/db";
import s3 from "@/app/api/tree/aws";
import { Buffer } from "buffer";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const formData = await req.formData();
    // SINGLE file
    const file = formData.get("file") as File;
    if (!file || !(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "No valid file provided" }, { status: 400 });
    }

    // Upload to S3
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = file.name;

    const params = {
      Bucket: process.env.AWS_S3_PROFILE_PIC_BUCKET_NAME!,
      Key: `${Date.now()}_${filename}`,
      Body: buffer,
      ContentType: file.type,
    };

    const result = await s3.upload(params).promise();

    console.log("Uploaded to S3:", result.Location);

    return NextResponse.json({ message: "Success", url: result.Location }, { status: 200 });
  } catch (error) {
    console.error("Error submitting profile pic:", error);
    return NextResponse.json({ error: "Error submitting profile pic" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const formData = await req.formData();
    // SINGLE file
    const file = formData.get("file") as File;
    if (!file || !(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "No valid file provided" }, { status: 400 });
    }

    // Upload to S3
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = file.name;

    const params = {
      Bucket: process.env.AWS_S3_PROFILE_PIC_BUCKET_NAME!,
      Key: `${Date.now()}_${filename}`,
      Body: buffer,
      ContentType: file.type,
    };

    const result = await s3.upload(params).promise();

    console.log("Uploaded to S3:", result.Location);

    return NextResponse.json({ message: "Success", url: result.Location }, { status: 200 });
  } catch (error) {
    console.error("Error submitting profile pic:", error);
    return NextResponse.json({ error: "Error submitting profile pic" }, { status: 500 });
  }
}
