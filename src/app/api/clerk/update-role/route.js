// app/api/clerk/update-role/route.js
import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(request) {
  try {
    // Verify the user is authenticated and has admin privileges
    const { userId: currentUserId } = auth();
    if (!currentUserId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get request body first
    const body = await request.json();
    const { userId: targetUserId, organizationId, role } = body;

    if (!targetUserId || !organizationId || !role) {
      return Response.json(
        {
          error: "Missing required fields: userId, organizationId, role",
        },
        { status: 400 },
      );
    }

    // Validate role
    if (!["org:admin", "org:member"].includes(role)) {
      return Response.json(
        {
          error: "Invalid role. Must be org:admin or org:member",
        },
        { status: 400 },
      );
    }

    // Check if current user is an admin in the specific organization
    const currentUserOrgMemberships = await clerkClient.users.getOrganizationMembershipList({
      userId: currentUserId,
    });

    const memberships = currentUserOrgMemberships.data || currentUserOrgMemberships;
    const currentUserMembershipInOrg = Array.isArray(memberships)
      ? memberships.find((membership) => membership.organization.id === organizationId)
      : null;

    if (!currentUserMembershipInOrg || currentUserMembershipInOrg.role !== "org:admin") {
      return Response.json(
        {
          error: "Insufficient permissions. You must be an admin of this organization",
        },
        { status: 403 },
      );
    }

    // Get the target user's current organization membership
    const targetUserMemberships = await clerkClient.users.getOrganizationMembershipList({
      userId: targetUserId,
    });

    const targetMemberships = targetUserMemberships.data || targetUserMemberships;
    const existingMembership = Array.isArray(targetMemberships)
      ? targetMemberships.find((membership) => membership.organization.id === organizationId)
      : null;

    if (!existingMembership) {
      return Response.json(
        {
          error: "User is not a member of the specified organization",
        },
        { status: 404 },
      );
    }

    // Update the organization membership role
    await clerkClient.organizations.updateOrganizationMembership({
      organizationId: organizationId,
      userId: targetUserId,
      role: role,
    });

    return Response.json({
      success: true,
      message: `User role updated to ${role}`,
      membershipId: existingMembership.id,
    });
  } catch (error) {
    console.error("Error updating Clerk role:", error);

    // Handle specific Clerk API errors
    if (error.status) {
      return Response.json(
        {
          error: "Clerk API error",
          details: error.message,
        },
        { status: error.status },
      );
    }

    return Response.json(
      {
        error: "Failed to update user role",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
