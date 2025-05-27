"use client";
import { Grid, GridItem, Text, Button, Flex, Link, Box, Center, Input, FormControl } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { InputUser, TextUser } from "@/styles/UserStyle";
import { CenterStyle } from "@/styles/AllStyle";
import { useUser } from "@clerk/nextjs";
import { isMobile } from "react-device-detect";
import ChangePasswordMobile from "@/components/ChangePasswordMobile";

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

  if (isMobileDevice) {
    return <ChangePasswordMobile />;
  } else {
    return (
      <div style={{ backgroundColor: "#F4F1E8", height: "100%", width: "100%", overflowY: "auto" }}>
        <Box maxH="90vh">
          <Center>
            <Flex mt={25} direction="column">
              <Flex align="center" justify="space-between">
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
                        {toastStatus === "success" ? (
                          <Text size="med" fontWeight={"bold"}>
                            Saved
                          </Text>
                        ) : (
                          <Text size="med">Error</Text>
                        )}
                        <Text>{toastMsg}</Text>
                      </Flex>
                    </Flex>
                  </Box>
                )}
              </Flex>
              <Box
                borderRadius={"15px"}
                mt={30}
                alignItems="center"
                borderColor="black"
                bg="white"
                w="900px"
                h="475px"
                p={10}
                color="black"
              >
                <Grid templateRows="repeat(2, 0.5fr)" templateColumns="repeat(5, 1fr)" gap={7}>
                  <GridItem colSpan={3} mt={10}>
                    <FormControl>
                      <Center {...CenterStyle}>
                        <Text {...TextUser} mt={4} mr={30}>
                          Current Password
                        </Text>
                        <Input
                          {...InputUser}
                          mt={4}
                          placeholder="Current Password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          type="password"
                        />
                      </Center>
                      <Center {...CenterStyle}>
                        <Text {...TextUser} mr={34} mt={10}>
                          New Password
                        </Text>
                        <Input
                          {...InputUser}
                          mt={10}
                          placeholder="New Password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          type="password"
                        />
                      </Center>
                      <Center>
                        <Text mr={30} {...TextUser} mt={10}>
                          Confirm New Password
                        </Text>
                        <Input
                          {...InputUser}
                          mt={10}
                          placeholder="Confirm New Password"
                          value={confirmNewPasssord}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          type="password"
                        />
                      </Center>
                      <Center {...CenterStyle}>
                        <Link>
                          <Button onClick={changePassword} mt={10} borderRadius={20} backgroundColor="#596334">
                            <Text color="white">Save</Text>
                          </Button>
                        </Link>
                        <Link href="/userProfile">
                          <Button
                            mt={10}
                            ml={5}
                            borderRadius={20}
                            backgroundColor="white"
                            borderColor="#596334"
                            borderWidth={1}
                          >
                            <Text color="#596334">Cancel</Text>
                          </Button>
                        </Link>
                      </Center>
                    </FormControl>
                  </GridItem>
                </Grid>
              </Box>
            </Flex>
          </Center>
        </Box>
      </div>
    );
  }
}
