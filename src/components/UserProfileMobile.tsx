import React from "react";

import { Grid, GridItem, Text, Button, Flex, Link, Box, Center, FormControl, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LeftUser, TextUser } from "@/styles/UserStyle";
import { CenterStyle } from "@/styles/AllStyle";
import { useUser } from "@clerk/nextjs";

interface UserData {
  name: string;
  email: string;
  phoneNumber?: string;
  role: string;
  profileURL: string;
}

export default function UserProfileMobile() {
  const { user, isLoaded } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div style={{ backgroundColor: "#F4F1E8", height: "100%", width: "100%", overflowY: "auto" }}>
      <Center>
        <Box maxH="90vh" maxW="90vw">
          <Box
            borderRadius={"15px"}
            mt={30}
            alignItems="center"
            borderColor="black"
            bg="white"
            w="80vw"
            h="80vh"
            p={2}
            //maxW="550px"
            color="black"
          >
            <Text fontSize="3xl" fontWeight="bold" textStyle="4xl">
              User Profile
            </Text>
            <Center>
              <Image
                boxSize="150px"
                borderRadius="full"
                fit="cover"
                alt="Profile Picture Not Appearing"
                src={userData?.profileURL ? userData?.profileURL : "/pfp.png"}
              ></Image>
            </Center>

            <FormControl>
              <Center {...LeftUser}>
                <Text {...CenterStyle} {...TextUser} mr={30}>
                  Name
                </Text>
              </Center>
              <Center {...LeftUser}>
                <Text fontSize="xs" color="black" align="left" mt={2} mr={30}>
                  {userData?.name}
                </Text>
              </Center>
              <Center {...LeftUser}>
                <Text textStyle="xs" {...TextUser} mt={5}>
                  Email
                </Text>
              </Center>
              <Center {...LeftUser}>
                <Text fontSize="xs" {...LeftUser} color="black" mt={2} mr={30}>
                  {userData?.email}
                </Text>
              </Center>
              <Center {...LeftUser}>
                <Text mr={30} {...TextUser} mt={5}>
                  Phone
                </Text>
              </Center>
              <Center fontSize="xs" {...LeftUser}>
                <Text color="black" mt={2}>
                  {userData?.phoneNumber}
                </Text>
              </Center>
              <Center {...LeftUser}>
                <Text {...TextUser} mr={30} mt={5}>
                  Roles
                </Text>
              </Center>
              <Center {...LeftUser}>
                <Text fontSize="xs" color="black" mt={2}>
                  {userData?.role}
                </Text>
              </Center>
            </FormControl>

            <Grid templateColumns="repeat(2, 1fr)">
              <GridItem colSpan={1}>
                <Center mt={5} {...LeftUser}>
                  <Link href="/editUserProfile">
                    <Button borderColor="#596334" borderWidth={1} borderRadius={20} backgroundColor="white">
                      <Text fontSize="xs" color="#596334">
                        Edit Profile
                      </Text>
                    </Button>
                  </Link>
                </Center>
              </GridItem>
              <GridItem colSpan={1}>
                <Flex justifyContent="flex-end">
                  <Link href="/">
                    <Button mt={5} borderRadius={20} backgroundColor="white" borderColor="#596334" borderWidth={1}>
                      <Text fontSize="xs" color="#596334">
                        Change Password
                      </Text>
                    </Button>
                  </Link>
                </Flex>
              </GridItem>
            </Grid>
          </Box>
        </Box>
      </Center>
    </div>
  );
}
