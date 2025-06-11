// pages/api/clerk/add-to-org.js or app/api/clerk/add-to-org/route.js

import { clerkClient } from "@clerk/nextjs/server";

export async function POST(request) {
  try {
    const { userId, organizationId, role = "org:member" } = await request.json();

    if (!userId || !organizationId) {
      return Response.json({ error: "userId and organizationId are required" }, { status: 400 });
    }

    // Add user directly to organization
    const membership = await clerkClient.organizations.createOrganizationMembership({
      organizationId,
      userId,
      role, // 'org:admin' or 'org:member'
    });

    return Response.json({
      success: true,
      membershipId: membership.id,
      userId: membership.publicUserData.userId,
      role: membership.role,
      message: "User added to organization successfully",
    });
  } catch (error) {
    console.error("Error adding user to organization:", error);
    return Response.json(
      {
        error: "Failed to add user to organization",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
