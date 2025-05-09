import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Announcement from "@/database/announcementSchema";

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!);
  }
}

// update read status
export async function PATCH(req: NextRequest, { params }: { params: { messageID: string } }) {
  await connectDB();

  try {
    const messageID = params.messageID; // get message ID
    const { userID, read } = await req.json();

    if (!messageID || !userID) {
      return new Response(JSON.stringify({ error: "Message and User IDs are required" }), {
        status: 400,
      });
    }

    const updatedMessage = await Announcement.findOneAndUpdate(
      { _id: messageID, "readStatus.userID": userID },
      { $set: { "readStatus.$.read": read } },
      { new: true, runValidators: true },
    );

    if (!updatedMessage) {
      return new Response(JSON.stringify({ message: "Message not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(updatedMessage), { status: 200 });
  } catch (err) {
    let errorMessage = "An unknown error occurred";
    if (err instanceof Error) {
      errorMessage = err.message;
    }

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
}

// delete message from database
export async function DELETE(req: NextRequest, { params }: { params: { messageID: string } }) {
  await connectDB();

  try {
    const messageID = params.messageID; // get message ID

    if (!messageID) {
      return new Response(JSON.stringify({ error: "Message ID is required" }), {
        status: 400,
      });
    }

    const deletedMessage = await Announcement.findByIdAndDelete(messageID).lean();

    if (!deletedMessage) {
      return new Response(JSON.stringify({ message: "Message not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: "Message deleted successfully" }), {
      status: 200,
    });
  } catch (err) {
    let errorMessage = "An unknown error occurred";
    if (err instanceof Error) {
      errorMessage = err.message;
    }

    return new Response(JSON.stringify({ error: `Failed to delete message: ${errorMessage}` }), {
      status: 500,
    });
  }
}
