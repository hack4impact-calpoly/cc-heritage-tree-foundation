import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId, newEmail, existingEmailId } = await req.json();

    const client = clerkClient();

    // add the new email address for the user
    const createdEmail = await client.emailAddresses.createEmailAddress({
      userId: userId,
      emailAddress: newEmail, // the new email you want to add
      primary: true,
      verified: true,
    });

    const newEmailId = createdEmail.id;

    console.log("New email ID:", newEmailId);

    // make new email address the primary email
    await client.emailAddresses.updateEmailAddress(newEmailId, {
      primary: true, // set this as the primary email
    });

    // delete the old email to clean up
    await client.emailAddresses.deleteEmailAddress(existingEmailId);

    return NextResponse.json({ success: true, newEmailId });
  } catch (error: any) {
    console.error("Error updating email:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
