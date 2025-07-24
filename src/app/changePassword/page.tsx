"use client";
import { Grid, Text, Button, Flex, Link, Box, Center, Input, FormControl, VStack, HStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { InputUser, TextUser } from "@/styles/UserStyle";
import { useUser } from "@clerk/nextjs";
import { isMobile } from "react-device-detect";
import { Router } from "express";
import { useRouter } from "next/navigation";

export default function ChangePassword() {
  const { user } = useUser();
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastStatus, setToastStatus] = useState<"success" | "error" | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPasssord, setConfirmNewPassword] = useState("");
  const router = useRouter();

  const showToast = (message: string, status: "success" | "error") => {
    setToastMsg(message);
    setToastStatus(status);

    setTimeout(() => {
      setToastMsg(null);
      setToastStatus(null);
    }, 3000);
  };

  useEffect(() => {
    setIsClient(true);
    setIsMobileDevice(isMobile);
  }, []);

  const changePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPasssord) {
      showToast("Please fill in all fields.", "error");
      return;
    }
    if (newPassword !== confirmNewPasssord) {
      showToast("New passwords do not match.", "error");
      return;
    }
    if (newPassword.length < 8) {
      showToast("Password must be at least 8 characters.", "error");
      return;
    }

    try {
      await user?.updatePassword({
        currentPassword,
        newPassword,
      });
      showToast("Password updated successfully!", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error: any) {
      showToast("Failed to update password. Please check your current password.", "error");
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <Box
      style={{
        backgroundColor: "#F4F1E8",
        minHeight: "100vh",
        width: "100%",
        overflowY: "auto",
      }}
    >
      <Box maxH={{ base: "100vh", md: "90vh" }} p={{ base: 4, md: 10 }} pt={{ base: 6, md: 10 }}>
        <Center>
          <Flex
            mt={{ base: 4, md: 25 }}
            direction="column"
            w={{ base: "100%", md: "900px" }}
            maxW="100%"
            px={{ base: 2, md: 0 }}
          >
            {/* Header Section */}
            <Flex
              align={{ base: "flex-start", md: "center" }}
              justify="space-between"
              mb={6}
              direction={{ base: "column", md: "row" }}
              gap={{ base: 4, md: 0 }}
            >
              <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" textStyle="4xl">
                Change Password
              </Text>

              {/* Toast Message */}
              {toastMsg && (
                <Box
                  borderRadius="lg"
                  px={{ base: 3, md: 4 }}
                  py={2}
                  bg="white"
                  color="black"
                  fontWeight="medium"
                  w={{ base: "100%", md: "auto" }}
                  boxShadow="md"
                >
                  <Flex align="center" gap={{ base: 2, md: 4 }}>
                    {toastStatus === "success" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#596334"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="red"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="m15 9-6 6" />
                        <path d="m9 9 6 6" />
                      </svg>
                    )}
                    <VStack align="flex-start" spacing={0}>
                      <Text
                        fontSize={{ base: "sm", md: "md" }}
                        fontWeight={toastStatus === "success" ? "bold" : "normal"}
                      >
                        {toastStatus === "success" ? "Saved" : "Error"}
                      </Text>
                      <Text fontSize={{ base: "xs", md: "sm" }}>{toastMsg}</Text>
                    </VStack>
                  </Flex>
                </Box>
              )}
            </Flex>

            {/* Form Section */}
            <Box borderRadius="15px" bg="white" p={{ base: 6, md: 10 }} w="100%" color="black" boxShadow="lg">
              <FormControl>
                {/* Desktop Grid Layout */}
                <Box display={{ base: "none", md: "block" }}>
                  <Grid templateColumns="220px 1fr" columnGap={20} rowGap={7} alignItems="center">
                    <Text {...TextUser}>Current Password</Text>
                    <Input
                      {...InputUser}
                      placeholder="Current Password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      type="password"
                      w="100%"
                      mt={0}
                    />

                    <Text {...TextUser}>New Password</Text>
                    <Input
                      {...InputUser}
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      type="password"
                      w="100%"
                      mt={0}
                    />

                    <Text {...TextUser}>Confirm New Password</Text>
                    <Input
                      {...InputUser}
                      placeholder="Confirm New Password"
                      value={confirmNewPasssord}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      type="password"
                      w="100%"
                      mt={0}
                    />

                    <Flex gridColumn="1 / span 2" justifyContent="flex-start" mt={6} gap={4}>
                      <Button onClick={changePassword} borderRadius={20} backgroundColor="#596334">
                        <Text color="white">Save</Text>
                      </Button>
                      <Box onClick={() => router.push("/userProfile")}>
                        <Button borderRadius={20} backgroundColor="white" borderColor="#596334" borderWidth={1}>
                          <Text color="#596334">Cancel</Text>
                        </Button>
                      </Box>
                    </Flex>
                  </Grid>
                </Box>

                {/* Mobile VStack Layout */}
                <Box display={{ base: "block", md: "none" }}>
                  <VStack spacing={6} align="stretch">
                    <VStack spacing={2} align="stretch">
                      <Text {...TextUser} fontSize="md" fontWeight="medium">
                        Current Password
                      </Text>
                      <Input
                        {...InputUser}
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        type="password"
                        w="100%"
                        mt={0}
                        size="lg"
                      />
                    </VStack>

                    <VStack spacing={2} align="stretch">
                      <Text {...TextUser} fontSize="md" fontWeight="medium">
                        New Password
                      </Text>
                      <Input
                        {...InputUser}
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        type="password"
                        w="100%"
                        mt={0}
                        size="lg"
                      />
                    </VStack>

                    <VStack spacing={2} align="stretch">
                      <Text {...TextUser} fontSize="md" fontWeight="medium">
                        Confirm New Password
                      </Text>
                      <Input
                        {...InputUser}
                        placeholder="Confirm new password"
                        value={confirmNewPasssord}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        type="password"
                        w="100%"
                        mt={0}
                        size="lg"
                      />
                    </VStack>

                    {/* Mobile Button Layout */}
                    <VStack spacing={3} pt={4} w="100%">
                      <Button
                        onClick={changePassword}
                        borderRadius={20}
                        backgroundColor="#596334"
                        w="100%"
                        size="lg"
                        py={6}
                      >
                        <Text color="white" fontSize="md" fontWeight="medium">
                          Save Changes
                        </Text>
                      </Button>
                      <Button
                        onClick={() => router.push("/userProfile")}
                        borderRadius={20}
                        backgroundColor="white"
                        borderColor="#596334"
                        borderWidth={1}
                        w="100%"
                        size="lg"
                        py={6}
                      >
                        <Text color="#596334" fontSize="md" fontWeight="medium">
                          Cancel
                        </Text>
                      </Button>
                    </VStack>
                  </VStack>
                </Box>
              </FormControl>
            </Box>
          </Flex>
        </Center>
      </Box>
    </Box>
  );
}
