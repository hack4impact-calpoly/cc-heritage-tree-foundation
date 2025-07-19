import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Announcement from "@/database/announcementSchema";
import s3 from "@/app/api/tree/aws";

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!);
  }
}

// new announcement

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const { from, to, subject, message, attachment, attachmentName } = body;

    if (!from || !to || !subject || !message) {
      return NextResponse.json("Missing required fields: from, to, subject, message", { status: 400 });
    }

    const readStatus = to.map((userID: string) => ({
      userID,
      read: false,
    }));

    let attachmentUrl = null;

    if (attachment) {
      try {
        const base64Data = attachment.split(",")[1];
        if (!base64Data) {
          throw new Error("Invalid base64 data format");
        }

        const buffer = Buffer.from(base64Data, "base64");

        const originalName = attachmentName || "attachment";
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(7);
        const extension = originalName.split(".").pop() || "";
        const nameWithoutExtension = originalName.replace(/\.[^/.]+$/, "");
        const fileName = `message-attachments/${timestamp}-${randomSuffix}-${nameWithoutExtension}.${extension}`;

        const contentTypeMatch = attachment.match(/data:([^;]+)/);
        const contentType = contentTypeMatch ? contentTypeMatch[1] : "application/octet-stream";

        if (!process.env.AWS_S3_MESSAGES_ATTACHMENT_BUCKET_NAME) {
          throw new Error("AWS_S3_MESSAGES_ATTACHMENT_BUCKET_NAME environment variable is not set");
        }

        const uploadParams = {
          Bucket: process.env.AWS_S3_MESSAGES_ATTACHMENT_BUCKET_NAME,
          Key: fileName,
          Body: buffer,
          ContentType: contentType,
        };

        const uploadResult = await s3.upload(uploadParams).promise();
        attachmentUrl = uploadResult.Location;
      } catch (uploadError: any) {
        console.error("S3 upload failed:", uploadError?.message || "Unknown error");
        return NextResponse.json("Failed to upload attachment: " + (uploadError?.message || "Unknown error"), {
          status: 400,
        });
      }
    }

    const newAnnouncement = new Announcement({
      from,
      to,
      subject,
      time: new Date(),
      message,
      readStatus,
      attachmentUrl,
    });

    await newAnnouncement.save();

    return NextResponse.json(
      { message: "Announcement sent successfully", announcement: newAnnouncement },
      { status: 201 },
    );
  } catch (err) {
    return NextResponse.json("Failed to send announcement: " + err, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const announcements = await Announcement.find();
    return NextResponse.json(announcements, { status: 200 });
  } catch (err) {
    return NextResponse.json("Failed to fetch announcements: " + err, { status: 400 });
  }
}
