"use client";
import React, { PropsWithChildren } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Stack,
  Button,
  Portal,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { MdArrowOutward, MdOutlinePeopleAlt } from "react-icons/md";
import { useState, useEffect } from "react";

const UserCardPopover: React.FC<PropsWithChildren> = ({ children }) => {
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

  // Redirect non-admin users
  useEffect(() => {
    if (isLoaded && !isAdmin) {
      router.push("/volunteerDashboard");
    }
  }, [isLoaded, isAdmin, router]);

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
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <div style={{ display: "inline-block" }}>{children}</div>
      </PopoverTrigger>
      <Portal>
        <PopoverContent w="180px" zIndex="999999">
          <PopoverBody>
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
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default UserCardPopover;
