"use client";
import { ChevronDown } from "lucide-react";
import { Grid, GridItem, Image, Text, Button, Flex, Link, Box, Center, Input, FormControl } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { InputUser, TextUser } from "@/styles/UserStyle";
import { CenterStyle } from "@/styles/AllStyle";
import { useUser } from "@clerk/nextjs";
import { EmailAddress } from "@clerk/nextjs/server";
import { BrowserView, MobileView, isBrowser, isMobile } from "react-device-detect";
import EditUserProfileMobile from "@/components/EditUserProfileMobile";

export default function EditUserProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // to compare changes
  const [originalUserData, setOriginalUserData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [existingEmailId, setExistingEmailId] = useState<string | null>(null);
  const [mongoUserId, setMongoUserId] = useState<object | null>(null);

  // for toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastStatus, setToastStatus] = useState<"success" | "error" | null>(null);

  const showToast = (message: string, status: "success" | "error") => {
    setToastMsg(message);
    setToastStatus(status);

    setTimeout(() => {
      setToastMsg(null);
      setToastStatus(null);
    }, 3000);
  };
  const [isClient, setIsClient] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setIsMobileDevice(isMobile);
  }, []);

  /* This is put in for testing only, please delete this code  */

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoaded || !user?.primaryEmailAddress?.emailAddress) return;

      try {
        const email = user.primaryEmailAddress.emailAddress.toLowerCase();
        setUserId(user.id); // clerk id
        setExistingEmailId(user.primaryEmailAddressId);
        const res = await fetch(`/api/user/${email}`);
        const data = await res.json();
        setMongoUserId(data._id);

        setName(data.name || "");
        setEmail(data.email || "");
        setPhoneNumber(data.phoneNumber || "");
        setOriginalUserData({
          name: data.name || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isLoaded, user]);

  const saveUserInfo = async () => {
    try {
      let clerkUpdated = false;
      let mongoUpdated = false;

      const updatedFields: any = {};

      if (name !== originalUserData.name) updatedFields.name = name;
      if (email !== originalUserData.email) updatedFields.email = email;
      if (phoneNumber !== originalUserData.phoneNumber) updatedFields.phoneNumber = phoneNumber;

      // === Clerk update (only if email changed) ===
      if (updatedFields.email) {
        const response = await fetch("/api/clerk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            newEmail: updatedFields.email.toLowerCase(),
            existingEmailId,
          }),
        });

        const clerk_data = await response.json();
        if (!response.ok) throw new Error(clerk_data.error || "Failed to update Clerk.");
        console.log("User updated on Clerk:", clerk_data.user);
        clerkUpdated = true;
      }

      // === MongoDB update ===
      if (Object.keys(updatedFields).length > 0) {
        const res = await fetch(`/api/user/${mongoUserId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedFields),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update MongoDB.");
        console.log("User updated on MongoDB:", data.user);
        mongoUpdated = true;
      }

      if (!clerkUpdated && !mongoUpdated) {
        showToast("No changes made.", "error");
        return;
      }

      showToast("You have successfully made changes.", "success");

      // update local original state
      setOriginalUserData({ name, email, phoneNumber });
    } catch (error) {
      console.error("Error updating information:", error);
      showToast("Unable to make changes. Email potentially already in use.", "error");
    }
  };

  /* Remove from comment to here */

  if (!isClient) {
    return null;
  }

  if (isMobileDevice) {
    return <EditUserProfileMobile />;
  } else {
    return (
      <div style={{ backgroundColor: "#F4F1E8", height: "100%", width: "100%", overflowY: "auto" }}>
        <Box maxH="90vh">
          <Center>
            <Flex mt={25} direction="column">
              <Flex align="center" justify="space-between">
                <Text fontSize="3xl" fontWeight="bold" textStyle="4xl">
                  Edit User Profile
                </Text>
                {toastMsg && (
                  <Box borderRadius="lg" px={4} py={2} bg="white" color="black" fontWeight="medium">
                    <Flex align="center" gap={4}>
                      {toastStatus === "success" ? (
                        // Success Icon
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
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="lucide lucide-circle-x-icon lucide-circle-x"
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
                  <GridItem rowSpan={2} colSpan={2}>
                    <Center>
                      <Image
                        ml={10}
                        mt={10}
                        boxSize="300px"
                        borderRadius="full"
                        fit="cover"
                        alt="Profile Picture Not Appearing"
                        src="/pfp.png"
                      ></Image>
                    </Center>
                  </GridItem>
                  <GridItem colSpan={3} mt={10}>
                    <FormControl>
                      <Center {...CenterStyle}>
                        <Text {...TextUser} mt={4} mr={30}>
                          Name
                        </Text>
                        <Input
                          {...InputUser}
                          mt={4}
                          placeholder="Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          type="text"
                        ></Input>
                      </Center>
                      <Center {...CenterStyle}>
                        <Text {...TextUser} mr={34} mt={10}>
                          Email
                        </Text>
                        <Input
                          {...InputUser}
                          mt={10}
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value.toLowerCase())}
                          type="email"
                        ></Input>
                      </Center>
                      <Center>
                        <Text mr={30} {...TextUser} mt={10}>
                          Phone
                        </Text>
                        <Input
                          {...InputUser}
                          mt={10}
                          placeholder="Phone Number"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          type="text"
                        ></Input>
                      </Center>
                      <Center {...CenterStyle}>
                        <Link>
                          <Button onClick={saveUserInfo} mt={10} borderRadius={20} backgroundColor="#596334">
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
