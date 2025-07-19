import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Announcement from "@/database/announcementSchema";
import s3 from "@/app/api/tree/aws";

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ messageID: string }> }) {
  await connectDB();

  try {
    const { messageID } = await params;
    const { action, userID, read, userEmail } = await req.json();

    if (!messageID) {
      return new Response(JSON.stringify({ error: "Message ID is required" }), {
        status: 400,
      });
    }

    let updateOperation;
    let query;

    switch (action) {
      case "edit_read":
        if (!userID) {
          return new Response(JSON.stringify({ error: "User ID is required for read status update" }), {
            status: 400,
          });
        }

        // First try to update existing readStatus entry
        query = { _id: messageID, "readStatus.userID": userID };
        updateOperation = { $set: { "readStatus.$.read": read } };

        let updatedMessage = await Announcement.findOneAndUpdate(query, updateOperation, { new: true });

        // If no existing entry found, push a new one
        if (!updatedMessage) {
          updateOperation = { $push: { readStatus: { userID, read } } };
          updatedMessage = await Announcement.findOneAndUpdate({ _id: messageID }, updateOperation, {
            new: true,
          });
        }

        if (!updatedMessage) {
          return new Response(JSON.stringify({ message: "Message not found" }), {
            status: 404,
          });
        }

        return new Response(JSON.stringify(updatedMessage), { status: 200 });

      case "remove_user":
        if (!userEmail) {
          return new Response(JSON.stringify({ error: "User email is required for removal" }), {
            status: 400,
          });
        }

        updateOperation = { $pull: { to: userEmail } };
        const result = await Announcement.findOneAndUpdate({ _id: messageID }, updateOperation, { new: true });

        if (!result) {
          return new Response(JSON.stringify({ message: "Message not found" }), {
            status: 404,
          });
        }

        return new Response(JSON.stringify(result), { status: 200 });

      default:
        return new Response(JSON.stringify({ error: "Invalid action specified" }), {
          status: 400,
        });
    }
  } catch (err) {
    console.error("Error in PATCH:", err);
    return new Response(
      JSON.stringify({
        error: "Server error",
        details: err instanceof Error ? err.message : String(err),
      }),
      {
        status: 500,
      },
    );
  }
}

// delete message from database
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ messageID: string }> }) {
  const { messageID } = await params;
  await connectDB();

  try {
    if (!messageID) {
      return new Response(JSON.stringify({ error: "Message ID is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const deletedMessage = await Announcement.findByIdAndDelete(messageID);

    if (!deletedMessage) {
      return new Response(JSON.stringify({ error: "Message not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Delete attachment from S3 if it exists
    if (deletedMessage.attachmentUrl) {
      try {
        const urlParts = deletedMessage.attachmentUrl.split("/");
        const key = urlParts.slice(-2).join("/"); // Get the key from the URL

        const deleteParams = {
          Bucket: process.env.AWS_S3_MESSAGES_ATTACHMENT_BUCKET_NAME!,
          Key: key,
        };

        await s3.deleteObject(deleteParams).promise();
      } catch (s3Error) {
        console.error("Failed to delete attachment from S3:", s3Error);
        // Don't fail the request if S3 deletion fails
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Message deleted successfully",
        deletedId: messageID,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  } catch (err) {
    console.error("DELETE Error:", err);
    return new Response(
      JSON.stringify({
        error: "Failed to delete message",
        details: err instanceof Error ? err.message : String(err),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }
}
