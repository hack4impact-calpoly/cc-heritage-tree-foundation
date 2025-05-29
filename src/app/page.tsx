"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs"; // Import Clerk's hook
import { useRouter } from "next/navigation";

export default function SignupRedirect() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [error, setError] = useState(null);

  useEffect(() => {
    let role = null;
    if (isLoaded && user) {
      role = user.organizationMemberships?.[0]?.role;
    }

    const isAdmin = role === "org:admin";
    if (!isAdmin) {
      router.push("/volunteerDashboard");
    }
    router.push("/adminDashboard");
  }, [user, isLoaded, router]);

  return;
}
