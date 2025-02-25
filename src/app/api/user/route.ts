import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/database/db";
import User from "@/database/userSchema";

// get all users
export async function GET(request: Request) {
  await connectDB();

  try {
    const users = await User.find().lean();
    return NextResponse.json(users, { status: 200 });
  } catch (err) {
    return NextResponse.json("Failed to fetch users: " + err, { status: 400 });
  }
}

// create a new user
export async function POST(req: Request) {
  await connectDB();

  try {
    const userData = await req.json();
    const newUser = new User(userData);
    await newUser.save();

    return NextResponse.json({ message: "User created successfully", user: newUser }, { status: 201 });
  } catch (err) {
    return NextResponse.json("Failed to create new user: " + err, { status: 400 });
  }
}
