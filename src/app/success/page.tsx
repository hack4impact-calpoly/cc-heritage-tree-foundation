"use client";
import { Box, Button, Link } from "@chakra-ui/react";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function Success() {
  const { user } = useUser();
  const [role, setRole] = useState("");

  useEffect(() => {
    if (!user) return; // Exit early if no user

    console.log("User available:", user);

    const fetchData = async () => {
      try {
        // Fetch user data
        const userRes = await fetch(`/api/user?email=${user.primaryEmailAddress?.emailAddress}`);
        if (!userRes.ok) throw new Error(`User fetch failed: ${userRes.status}`);
        const userData = await userRes.json();
        // Fetch trees based on role

        if (userData?.role === "Volunteer") {
          setRole("Volunteer");
        } else if (userData?.role === "Admin") {
          setRole("Admin");
        } else {
          throw new Error("Role not found");
        }
      } catch {
        throw new Error("Role not found");
      }
    };
    fetchData();
  }, [user]);

  return (
    <Box height="calc(100vh - 100px)" width="100%" display="flex" justifyContent="center" alignItems="center">
      <Box
        bg="white"
        padding="30px 100px"
        display="flex"
        flexDirection="column"
        borderRadius="25px"
        justifyContent="center"
        alignItems="center"
        gap="10px"
      >
        <Box fontSize="40px" fontFamily="Georgia">
          🎉 Tree Log Success 🎉
        </Box>
        <Box>Thank you for helping us!</Box>
        <Link href="/newTreeForm">
          <Button mt="30px" bg="#AE5700" color="white" padding="5px 30px" borderRadius="20px">
            + Log Another Tree
          </Button>
        </Link>
        <Link href={role === "Volunteer" ? "/volunteerDashboard" : "/adminDashboard"}>
          <Button border="2px solid gray" borderRadius="20px" bg="white" color="gray">
            Return to Dashboard
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
