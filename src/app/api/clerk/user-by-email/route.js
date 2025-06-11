import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email } = await req.json();
    const client = await clerkClient();
    let users;

    console.log(email);

    try {
      // First try with emailAddress filter
      users = await client.users.getUserList({
        emailAddress: [email],
      });
      console.log(users);
    } catch (error) {
      console.log("Email filter search failed, trying query search");
    }

    // If no results or error, try with query parameter
    if (!users || users.data.length === 0) {
      users = await client.users.getUserList({
        query: email,
      });
    }

    // If still no results, try getting all users and filtering (for small user bases)
    if (!users || users.data.length === 0) {
      const allUsers = await client.users.getUserList({ limit: 500 });
      const matchingUsers = allUsers.data.filter((user) =>
        user.emailAddresses.some((userEmail) => userEmail.emailAddress === email),
      );
      users = { data: matchingUsers };
    }

    if (!users || users.data.length === 0) {
      return NextResponse.json({ error: "User not found with the provided email" }, { status: 404 });
    }

    const user = users.data[0];
    const userId = user.id;
    console.log(userId);
    return NextResponse.json({
      success: true,
      userId,
    });
  } catch (error) {
    console.error("Error getting user ID:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
