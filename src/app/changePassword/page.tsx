"use client";
import { Grid, Text, Button, Flex, Link, Box, Center, Input, FormControl } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { InputUser, TextUser } from "@/styles/UserStyle";
import { useUser } from "@clerk/nextjs";
import { isMobile } from "react-device-detect";
// import ChangePasswordMobile from "@/components/ChangePasswordMobile";

export default function ChangePassword() {
  const { user } = useUser();
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastStatus, setToastStatus] = useState<"success" | "error" | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPasssord, setConfirmNewPassword] = useState("");

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

  //   if (isMobileDevice) {
  //     return <ChangePasswordMobile />;
  //   } else {
  return (
    <Box style={{ backgroundColor: "#F4F1E8", height: "100%", width: "100%", overflowY: "auto" }}>
      <Box maxH="90vh" p={10}>
        <Center>
          <Flex mt={25} direction="column" w="900px" maxW="100%">
            <Flex align="center" justify="space-between" mb={6}>
              <Text fontSize="3xl" fontWeight="bold" textStyle="4xl">
                Change Password
              </Text>
              {toastMsg && (
                <Box borderRadius="lg" px={4} py={2} bg="white" color="black" fontWeight="medium">
                  <Flex align="center" gap={4}>
                    {toastStatus === "success" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
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
                    <Flex direction={"column"}>
                      <Text size="med" fontWeight={toastStatus === "success" ? "bold" : "normal"}>
                        {toastStatus === "success" ? "Saved" : "Error"}
                      </Text>
                      <Text>{toastMsg}</Text>
                    </Flex>
                  </Flex>
                </Box>
              )}
            </Flex>

            <Box borderRadius="15px" bg="white" p={10} w="100%" color="black">
              <FormControl>
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
                    <Link href="/userProfile">
                      <Button borderRadius={20} backgroundColor="white" borderColor="#596334" borderWidth={1}>
                        <Text color="#596334">Cancel</Text>
                      </Button>
                    </Link>
                  </Flex>
                </Grid>
              </FormControl>
            </Box>
          </Flex>
        </Center>
      </Box>
    </Box>
  );
}
// }
