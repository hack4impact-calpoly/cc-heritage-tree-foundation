"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Grid, GridItem, Image, Text, Button, Flex, Box, Center, FormControl, Spinner } from "@chakra-ui/react";
import { LeftUser, TextUser } from "@/styles/UserStyle";
import { CenterStyle } from "@/styles/AllStyle";
import { ITree } from "@/database/treeSchema";
import { isMobile } from "react-device-detect";
import UserProfileMobile from "@/components/UserProfileMobile";
import { useRouter } from "next/navigation";

interface UserData {
  name: string;
  email: string;
  phoneNumber?: string;
  role: string;
  profileURL?: string;
}

function UserProfile() {
  const { user, isLoaded } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userTrees, setUserTrees] = useState<ITree[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    setIsMobileDevice(isMobile);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoaded || !user?.primaryEmailAddress?.emailAddress) return;

      try {
        const email = user.primaryEmailAddress.emailAddress;
        const res = await fetch(`/api/user/${email}`);
        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isLoaded, user]);

  useEffect(() => {
    const fetchUserTrees = async () => {
      if (!userData?.name) return;

      try {
        const encodedName = encodeURIComponent(userData.name);
        const res = await fetch(`/api/tree?collectorName=${encodedName}`);
        const treeData = await res.json();
        setUserTrees(treeData);
      } catch (error) {
        console.error("Failed to fetch user trees:", error);
      }
    };

    fetchUserTrees();
  }, [userData]);

  if (!isClient) {
    return null;
  }

  if (loading || !userData) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (isMobileDevice) {
    return <UserProfileMobile />;
  }

  return (
    <div style={{ backgroundColor: "#F4F1E8", height: "100%", width: "100%", overflowY: "auto" }}>
      <Box maxH="90vh">
        <Center>
          <Flex ml={10} mt={25} direction="column">
            <Text fontSize="3xl" fontWeight="bold" textStyle="4xl">
              User Profile
            </Text>
            <Box
              borderRadius={"15px"}
              mt={30}
              alignItems="center"
              borderColor="black"
              bg="white"
              w="1000px"
              h="475px"
              color="black"
            >
              <Grid templateRows="repeat(2, 1fr)" templateColumns="repeat(5, 1fr)" gap={7}>
                <GridItem rowSpan={2} colSpan={3}>
                  <Center>
                    <Image
                      ml={7}
                      mt={70}
                      boxSize="350px"
                      borderRadius="full"
                      fit="cover"
                      alt="Profile Picture"
                      src={userData.profileURL ? userData.profileURL : "/pfp.png"}
                    />
                  </Center>
                </GridItem>
                <GridItem colSpan={2} mt={20}>
                  <FormControl>
                    <Center {...LeftUser}>
                      <Text {...CenterStyle} {...TextUser} mr={30}>
                        Name
                      </Text>
                    </Center>
                    <Center {...LeftUser}>
                      <Text fontSize="xs" color="black" align="left" mt={2} mr={30}>
                        {userData.name}
                      </Text>
                    </Center>
                    <Center {...LeftUser}>
                      <Text textStyle="xs" {...TextUser} mt={5}>
                        Email
                      </Text>
                    </Center>
                    <Center {...LeftUser}>
                      <Text fontSize="xs" {...LeftUser} color="black" mt={2} mr={30}>
                        {userData.email}
                      </Text>
                    </Center>
                    <Center {...LeftUser}>
                      <Text mr={30} {...TextUser} mt={5}>
                        Phone
                      </Text>
                    </Center>
                    <Center fontSize="xs" {...LeftUser}>
                      <Text color="black" mt={2}>
                        {userData.phoneNumber || "N/A"}
                      </Text>
                    </Center>
                    <Center {...LeftUser}>
                      <Text {...TextUser} mr={30} mt={5}>
                        Roles
                      </Text>
                    </Center>
                    <Center {...LeftUser}>
                      <Text fontSize="xs" color="black" mt={2}>
                        {userData.role}
                      </Text>
                    </Center>
                    <Center mt={5} {...LeftUser}>
                      <Flex direction="row" gap={4}>
                        <Box onClick={() => router.push("/editUserProfile")}>
                          <Button borderColor="#596334" borderWidth={1} borderRadius={20} backgroundColor="white">
                            <Text fontSize="xs" color="#596334">
                              Edit Profile
                            </Text>
                          </Button>
                        </Box>
                        <Box onClick={() => router.push("/changePassword")}>
                          <Button borderColor="#596334" borderWidth={1} borderRadius={20} backgroundColor="white">
                            <Text fontSize="xs" color="#596334">
                              Change Password
                            </Text>
                          </Button>
                        </Box>
                      </Flex>
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

export default UserProfile;
