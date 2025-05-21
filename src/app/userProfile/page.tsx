"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Grid,
  HStack,
  GridItem,
  Image,
  Text,
  Button,
  Flex,
  Link,
  Box,
  Center,
  Table,
  Td,
  Tbody,
  Th,
  Thead,
  Tr,
  FormControl,
  Spinner,
} from "@chakra-ui/react";
import { ArrowUpRight } from "lucide-react";
import { LeftUser, TextUser } from "@/styles/UserStyle";
import { CenterStyle } from "@/styles/AllStyle";
import { BoxItem, IconStyle } from "@/styles/AdminDashStyle";
import { ITree } from "@/database/treeSchema";
import { isMobile } from "react-device-detect";
import UserProfileMobile from "@/components/UserProfileMobile";

interface UserData {
  name: string;
  email: string;
  phoneNumber?: string;
  role: string;
}

function UserProfile() {
  const { user, isLoaded } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userTrees, setUserTrees] = useState<ITree[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

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
          <Flex direction="row">
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
                w="550px"
                h="475px"
                color="black"
              >
                <Grid templateRows="repeat(1, 0.5fr)" templateColumns="repeat(5, 1fr)" gap={7}>
                  <GridItem rowSpan={2} colSpan={3}>
                    <Center>
                      <Image
                        ml={7}
                        mt={100}
                        boxSize="250px"
                        borderRadius="full"
                        fit="cover"
                        alt="Profile Picture"
                        src="/pfp.png"
                      />
                    </Center>
                  </GridItem>
                  <GridItem colSpan={2} mt={10}>
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
                        <Link href="/editUserProfile">
                          <Button borderColor="#596334" borderWidth={1} borderRadius={20} backgroundColor="white">
                            <Text fontSize="xs" color="#596334">
                              Edit Profile
                            </Text>
                          </Button>
                        </Link>
                      </Center>
                      <Center {...LeftUser}>
                        <Link href="/">
                          <Button
                            mt={2}
                            borderRadius={20}
                            backgroundColor="white"
                            borderColor="#596334"
                            borderWidth={1}
                          >
                            <Text fontSize="xs" color="#596334">
                              Change Password
                            </Text>
                          </Button>
                        </Link>
                      </Center>
                    </FormControl>
                  </GridItem>
                </Grid>
              </Box>
            </Flex>

            <Flex ml={10} mt={20}>
              <Box mt={5} mr="auto" {...BoxItem} w="400px" h="475px" p={10}>
                <HStack>
                  <Text color="#333333">Trees Logged</Text>
                  <Link href="" ml="auto">
                    <ArrowUpRight />
                  </Link>
                </HStack>
                <Box
                  borderRadius="20px"
                  overflow="hidden"
                  border="1px solid"
                  borderColor={"#596334"}
                  mt={10}
                  maxH="330px"
                  overflowY="auto"
                >
                  <Table size="sm" variant="simple" bg="#FAF9F6">
                    <Thead bg="#DFED98">
                      <Tr>
                        <Th width={"20%"}>#</Th>
                        <Th width={"20%"}>Species</Th>
                        <Th width={"20%"}>Date Recorded</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {userTrees.map((tree: ITree, index) => (
                        <Tr key={tree._id}>
                          <Td>{index + 1}</Td>
                          <Td>
                            <Box
                              {...IconStyle}
                              style={{
                                backgroundColor: tree.species?.startsWith("C")
                                  ? "#78C1DE"
                                  : tree.species?.startsWith("V")
                                    ? "#CFEFF9"
                                    : tree.species?.startsWith("B")
                                      ? "#426B87"
                                      : "#579FD4",
                                color: tree.species?.startsWith("C")
                                  ? "#333333"
                                  : tree.species?.startsWith("V")
                                    ? "#426B87"
                                    : tree.species?.startsWith("B")
                                      ? "white"
                                      : "white",
                              }}
                              fontSize="sm"
                              fontWeight="normal"
                            >
                              {tree.species
                                ?.split(" ")
                                .filter((word) => word.length > 0)
                                .map((word, idx, arr) => (idx === 0 || idx === arr.length - 1 ? word[0] : ""))
                                .join("")
                                .toUpperCase()}
                            </Box>
                          </Td>
                          <Td>{new Date(tree.dateCollected).toLocaleDateString()}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </Box>
            </Flex>
          </Flex>
        </Center>
      </Box>
    </div>
  );
}

export default UserProfile;
