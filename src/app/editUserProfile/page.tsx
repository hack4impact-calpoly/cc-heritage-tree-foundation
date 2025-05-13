"use client";
import { ChevronDown } from "lucide-react";
import { Grid, GridItem, Image, Text, Button, Flex, Link, Box, Center, Input, FormControl } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { InputUser, TextUser } from "@/styles/UserStyle";
import { CenterStyle } from "@/styles/AllStyle";
import { useUser } from "@clerk/nextjs";
import { EmailAddress } from "@clerk/nextjs/server";

function EditUserProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

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
      // update clerk
      const response = await fetch("/api/clerk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId, // The Clerk user ID
          newEmail: email,
          existingEmailId: existingEmailId,
        }),
      });

      const clerk_data = await response.json();
      if (!response.ok) {
        throw new Error(clerk_data.error || "Failed to update user.");
      }

      console.log("User updated on clerk:", clerk_data.user);

      // updating mongodb
      const res = await fetch(`/api/user/${mongoUserId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phoneNumber,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update user on mongodb.");
      }

      console.log("User updated on mongodb:", data.user);

      setName("");
      setEmail("");
      setPhoneNumber("");

      showToast("You have successfully made changes.", "success");
    } catch (error) {
      console.log("Error updating information on clerk: ", error);
      showToast("Unable to make changes.", "error");
    }
  };

  return (
    <div style={{ backgroundColor: "#F4F1E8", height: "100%", width: "100%", overflowY: "auto" }}>
      <Box maxH="90vh">
        <Flex direction="row" justify="right">
          <Box mt={5} mr={5} borderRadius={"15px"} borderColor="black" bg="white" w="250px" h="100px" p={5}>
            <Image
              mt={1}
              boxSize="50px"
              borderRadius="full"
              fit="cover"
              alt="Small Profile Picture Not Appearing"
              src="/pfp.png"
              ml={1}
            ></Image>
            <Flex direction="row">
              <Flex mt={-49} ml={20} direction="column">
                <Text>User Name</Text>
                <Text color="#868686">Volunteer</Text>
              </Flex>
              <Box ml={5} mt={-9}>
                <ChevronDown></ChevronDown>
              </Box>
            </Flex>
          </Box>
        </Flex>

        <Center>
          <Flex mt={25} direction="column">
            <Flex align="center" justify="space-between">
              <Text fontSize="3xl" fontWeight="bold" textStyle="4xl">
                Edit User Profile
              </Text>
              {toastMsg && (
                <Box
                  borderRadius="md"
                  px={4}
                  py={2}
                  bg="white"
                  // {toastStatus === "success" ? "green.400" : "red.400"}
                  color="black"
                  fontWeight="medium"
                  boxShadow="md"
                >
                  <Flex align="center" gap={4}>
                    {toastStatus === "success" ? (
                      // Success Icon (e.g., checkmark)
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

export default EditUserProfile;
