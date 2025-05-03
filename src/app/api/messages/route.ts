import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Announcement from "@/database/announcementSchema";

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
    const { from, to, subject, message } = body;

    const readStatus = to.map((userID: string) => ({
      userID,
      read: false,
    }));

    const newAnnouncement = new Announcement({
      from,
      to,
      subject,
      time: new Date(),
      message,
      readStatus,
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
