import connectDB from "@/database/db";
import User from "@/database/userSchema";
import { NextRequest, NextResponse } from "next/server";

// Get a user by name
export async function GET(req: NextRequest, context: { params: any }) {
  try {
    await connectDB();
    const params = await context.params;
    const { name } = params;

    if (!name) {
      return NextResponse.json({ error: "Missing user name" }, { status: 400 });
    }

    // Decode the URL-encoded name
    const decodedName = decodeURIComponent(name);

    const user = await User.findOne({ name: decodedName });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user by name:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
