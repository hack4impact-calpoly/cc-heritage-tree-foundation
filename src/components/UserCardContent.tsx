"use client";
import React from "react";
import { Stack, Button, RadioGroup, Radio } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { MdArrowOutward, MdOutlinePeopleAlt } from "react-icons/md";
import { useState, useEffect } from "react";

export default function UserCardContent() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [globalRole, setGlobalRole] = useState<string>("Admin");

  let role = null;
  if (isLoaded && user) {
    role = user.organizationMemberships?.[0]?.role;
  }
  const isAdmin = role === "org:admin";

  // Initialize role from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedRole = localStorage.getItem("globalUserRole") || "Admin";
      setGlobalRole(savedRole);
    }
  }, []);

  const roleChange = (newRole: string) => {
    setGlobalRole(newRole);
    if (typeof window !== "undefined") {
      localStorage.setItem("globalUserRole", newRole);
    }

    if (newRole === "Volunteer") {
      router.push("/volunteerDashboard");
    } else if (newRole === "Admin") {
      router.push("/adminDashboard");
    }
  };

  return (
    <Stack spacing={3}>
      {isAdmin && (
        <RadioGroup value={globalRole} onChange={roleChange}>
          <div style={{ fontWeight: "bold", marginBottom: "10px" }}>Switch role</div>
          <Stack direction="column">
            <Radio value="Admin">Admin</Radio>
            <Radio value="Volunteer">Volunteer</Radio>
          </Stack>
        </RadioGroup>
      )}
      <Button
        variant="ghost"
        width="100%"
        justifyContent="flex-start"
        fontWeight="normal"
        leftIcon={<MdOutlinePeopleAlt />}
        onClick={() => router.push("/userProfile")}
      >
        My Profile
      </Button>
      <Button
        variant="ghost"
        width="100%"
        justifyContent="flex-start"
        fontWeight="normal"
        leftIcon={<MdArrowOutward />}
        onClick={() => signOut()}
      >
        Log Out
      </Button>
    </Stack>
  );
}
