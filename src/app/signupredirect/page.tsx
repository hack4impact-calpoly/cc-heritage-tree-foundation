"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs"; // Import Clerk's hook
import { useRouter } from "next/navigation";

export default function SignupRedirect() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (user) {
      const submitUserInfo = async () => {
        try {
          const response = await fetch("/api/user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: user.fullName,
              email: user.primaryEmailAddress?.emailAddress,
              role: "Volunteer",
              active: true,
            }),
          });

          if (!response.ok) throw new Error("Failed to add user");

          router.push("/editUserProfile");
        } catch (err: any) {
          setError(err.message);
        }
      };

      submitUserInfo();
    }
  }, [user, isLoaded, router]);
}
