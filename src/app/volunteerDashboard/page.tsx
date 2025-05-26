"use client";
import React, { useState, useEffect } from "react";
import { Box, Grid, GridItem, Text, Button, HStack, VStack, Link, IconButton, Image } from "@chakra-ui/react";
import { Plus, ArrowUpRight, EllipsisVertical, Menu } from "lucide-react";
import { ITree } from "@/database/treeSchema";
import Map from "@/components/Map";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { CenterStyle } from "@/styles/AllStyle";
import {
  Box1AnnStyle,
  Box2AnnStyle,
  IconButtonStyle,
  TextAnnStyle,
  TextWeightStyle,
  BoxItem,
} from "@/styles/VolunteerDashStyle";
import { BrowserView, MobileView, isMobile } from "react-device-detect";
import { IAnnouncement } from "@/database/announcementSchema";

export default function VolunteerDashboard() {
  const router = useRouter();
  const { user } = useUser();
  const [isClient, setIsClient] = useState(false);
  const [treeData, setTreeData] = useState<ITree[]>([]);
  const [announcements, setAnnouncements] = useState<IAnnouncement[]>([]);
  const [filteredAnnouncements, setFitleredAnnouncements] = useState<IAnnouncement[]>([]);

  const checkIfRecipient = (message: { to: Array<string> }) => {
    for (const recipient of message.to) {
      if (user?.primaryEmailAddress?.emailAddress == recipient) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    setFitleredAnnouncements(announcements.filter((announcement) => checkIfRecipient(announcement)));
  }, [announcements]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setIsClient(true);

    const fetchTrees = async () => {
      try {
        const response = await fetch("/api/tree");
        if (!response.ok) throw new Error("Failed to fetch trees for dashboard");
        const data: ITree[] = await response.json();
        setTreeData(data);
      } catch (error) {
        console.error("Error fetching tree data:", error);
      }
    };

    fetchTrees();
  }, []);

  useEffect(() => {
    setIsClient(true);

    const fetchAnnouncements = async () => {
      try {
        const response = await fetch("/api/messages");
        if (!response.ok) throw new Error("Faild to fetch announcements for dashboard");
        const data: IAnnouncement[] = await response.json();
        setAnnouncements(
          data
            .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
            .reverse()
            .slice(0, 10),
        );
      } catch (error) {
        console.error("Error fetching announcement data:", error);
      }
    };

    fetchAnnouncements();
  }, []);

  console.log(announcements);
  return (
    <Box>
      {isClient ? (
        <Box>
          <BrowserView>
            <Box bg="#F4F1E8" display="flex" justifyContent="center">
              <Grid
                maxH="85vh"
                templateRows={{ base: "auto auto auto auto", md: "repeat(9, 1fr)" }}
                templateColumns={{ base: "1fr", md: "repeat(8, 1fr)" }}
                gap={4}
                maxW="90%"
                w="90%"
              >
                {/* Hello Message */}
                <GridItem rowSpan={1} colSpan={{ base: 1, md: 8 }}>
                  <VStack display="flex" alignItems="flex-start">
                    <Text fontSize="3xl" color="#596334" fontWeight="bold">
                      Hello {user?.firstName} 👋
                    </Text>
                    <Text fontSize="16px" color="#333" fontWeight={"400"}>
                      Thank you so much for your effort, let&#39;s do this!
                    </Text>
                  </VStack>
                </GridItem>

                {/* Tree Logs */}
                <GridItem rowSpan={{ base: 1, md: 3 }} colSpan={{ base: 1, md: 4 }}>
                  <VStack {...BoxItem} p="5" h="100%" w="100%" overflow="auto">
                    <HStack justifyContent="space-between" h="10%" w="100%">
                      <Button
                        bg="#596334"
                        px="14px"
                        py="3px"
                        borderRadius="12px"
                        onClick={() => router.push("/newTreeForm")}
                        h="2.3rem"
                      >
                        <Box w="24px" h="24px" borderRadius="100px" bg="#F4F1E8" {...CenterStyle}>
                          <Plus color="#596334" />
                        </Box>
                        <Text ml="10px" color="#F4F1E8" fontSize="16px">
                          Add Tree
                        </Text>
                      </Button>
                      <Link href="/treeTable">
                        <ArrowUpRight color="#333333" />
                      </Link>
                    </HStack>
                    <Text
                      fontSize="3xl"
                      fontWeight="semibold"
                      color="#333333"
                      alignSelf="flex-start"
                      m="0.25em"
                      marginLeft="0"
                    >
                      Trees Logged
                    </Text>
                    <HStack gap="6" w="100%" h="50%">
                      <Box
                        bg="#DFED98"
                        borderRadius="12px"
                        border="3px solid #DFED98"
                        padding="0.6em"
                        w="50%"
                        display="flex"
                        flexDir="column"
                        alignItems="center"
                        h="100%"
                      >
                        <Text w="100%" {...TextWeightStyle} fontSize={{ base: "20px", md: "1vw" }}>
                          You&#39;ve logged
                        </Text>
                        <HStack gap={2}>
                          <Text fontSize={{ base: "50px", md: "2.5vw" }} {...TextWeightStyle}>
                            {treeData.filter((tree) => tree.collectorName == user?.fullName).length}
                          </Text>
                          <Text fontSize={{ base: "20px", md: "1vw" }} {...TextWeightStyle}>
                            tree
                            {treeData.filter((tree) => tree.collectorName == user?.fullName).length == 1 ? "" : "s"}
                          </Text>
                        </HStack>
                      </Box>
                      <Box
                        borderRadius="12px"
                        border="3px solid #647038"
                        padding="0.6em"
                        w="50%"
                        display="flex"
                        flexDir="column"
                        alignItems="center"
                        h="100%"
                      >
                        <Text w="100%" {...TextWeightStyle} fontSize={{ base: "20px", md: "1vw" }}>
                          Total logged
                        </Text>
                        <HStack gap={2}>
                          <Text fontSize={{ base: "50px", md: "2.5vw" }} {...TextWeightStyle}>
                            {treeData ? treeData.length : "0"}
                          </Text>
                          <Text fontSize={{ base: "20px", md: "1vw" }} {...TextWeightStyle}>
                            tree
                            {treeData?.length == 1 ? "" : "s"}
                          </Text>
                        </HStack>
                      </Box>
                    </HStack>
                  </VStack>
                </GridItem>

                {/* Map */}
                <GridItem
                  rowSpan={{ base: 2, md: 8 }}
                  colSpan={{ base: 1, md: 4 }}
                  minHeight="500px"
                  data-testid="map_id"
                >
                  <Map trees={treeData} />
                </GridItem>

                {/* Announcements */}
                <GridItem rowSpan={{ base: 1, md: 5 }} colSpan={{ base: 1, md: 4 }}>
                  <Box
                    {...BoxItem}
                    bg="#596334"
                    h="100%"
                    p={{ base: 5, md: 10 }}
                    overflow="auto"
                    sx={{
                      "&::-webkit-scrollbar": {
                        backgroundColor: "rgba(0, 0, 0, 0)",
                      },
                    }}
                  >
                    <VStack h="100%">
                      <HStack w="100%" justifyContent="space-between" position="sticky">
                        <Text color="#F4F1E8" fontSize="3xl" fontWeight="600">
                          Announcements
                        </Text>
                        <Link href="/messages">
                          <ArrowUpRight color="#F4F1E8" />
                        </Link>
                      </HStack>
                      <VStack
                        overflowY="scroll"
                        sx={{
                          "&::-webkit-scrollbar": {
                            width: "4px",
                          },
                          "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "rgba(0, 0, 0, 0.2)",
                          },
                        }}
                        width="100%"
                      >
                        {filteredAnnouncements.map((announcement) => (
                          <Box {...Box1AnnStyle} key={announcement._id} marginBottom="1rem" width="100%">
                            <HStack position={"relative"} w="100%">
                              <Box {...Box2AnnStyle}></Box>
                              <Text {...TextAnnStyle}> {announcement.message} </Text>
                              <IconButton aria-label="More options" position={"absolute"} {...IconButtonStyle}>
                                <EllipsisVertical color="#333333" />
                              </IconButton>
                            </HStack>
                          </Box>
                        ))}
                      </VStack>
                    </VStack>
                  </Box>
                </GridItem>
              </Grid>
            </Box>
          </BrowserView>

          <MobileView>
            <Box mt={"58px"}>
              <VStack spacing={"32px"}>
                <HStack
                  width="100%"
                  position={"relative"}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <IconButton position={"absolute"} left="25px" aria-label="Navbar" key={"ghost"} variant={"ghost"}>
                    <Menu width="48px" color="#596334" />
                  </IconButton>
                  <Box
                    width="48px"
                    height="48px"
                    border={"solid"}
                    borderWidth={"1px"}
                    borderRadius="100%"
                    display="flex"
                    justifyContent={"center"}
                    borderColor={"#596334"}
                    padding={"3px"}
                  >
                    <Image src="~/../logo1.png" alt="logo" htmlWidth="36px" htmlHeight="36px" />
                  </Box>
                </HStack>
                <Grid
                  h="100%"
                  w="85%"
                  templateRows={{ base: "auto auto auto auto", md: "repeat(8, 1fr)" }}
                  templateColumns={{ base: "1fr", md: "repeat(7, 1fr)" }}
                  gap={25}
                >
                  <GridItem rowSpan={{ base: 1, md: 3 }} colSpan={{ base: 1, md: 3 }} minHeight="265px">
                    <VStack w="100%" h="100%" borderRadius="16px" bg="white" p="20px" flexDir="column" gap="15px">
                      <HStack position="relative">
                        <Button
                          bg="#AE5700"
                          px="14px"
                          py="3px"
                          height={"48px"}
                          width={"146px"}
                          borderRadius="25px"
                          onClick={() => router.push("/newTreeForm")}
                        >
                          <Box w="24px" h="24px" borderRadius="100px" bg="#AE5700" {...CenterStyle}>
                            <Plus color="white" />
                          </Box>
                          <Text ml="10px" color="white" fontSize="16px">
                            Add Tree
                          </Text>
                        </Button>
                      </HStack>
                      <HStack gap="10px" minHeight="0">
                        <Box
                          bg="#DFED98"
                          borderRadius="12px"
                          padding="10px"
                          w="50%"
                          flexGrow={1}
                          display="flex"
                          flexDir="column"
                        >
                          <Text w="100%" {...TextWeightStyle} fontSize={{ base: "20px", md: "1vw" }}>
                            You&#39;ve logged
                          </Text>
                          <HStack flexGrow={1} {...CenterStyle}>
                            <Text fontSize={{ base: "50px", md: "2.5vw" }} {...TextWeightStyle}>
                              25
                            </Text>
                            <Text fontSize={{ base: "20px", md: "1vw" }} {...TextWeightStyle}>
                              trees
                            </Text>
                          </HStack>
                        </Box>
                        <Box
                          borderRadius="12px"
                          border="1px solid #647038"
                          padding="10px"
                          w="50%"
                          flexGrow={1}
                          display="flex"
                          flexDir="column"
                        >
                          <Text w="100%" {...TextWeightStyle} fontSize={{ base: "20px", md: "1vw" }}>
                            Total logged
                          </Text>
                          <HStack flexGrow={1} alignItems="center" justifyContent="center">
                            <Text fontSize={{ base: "50px", md: "2.5vw" }} {...TextWeightStyle}>
                              175
                            </Text>
                            <Text fontSize={{ base: "20px", md: "1vw" }} {...TextWeightStyle}>
                              trees
                            </Text>
                          </HStack>
                        </Box>
                      </HStack>
                    </VStack>
                  </GridItem>
                  <GridItem
                    rowSpan={{ base: 1, md: 4 }}
                    colSpan={{ base: 1, md: 3 }}
                    borderRadius="16px"
                    bg="#596334"
                    p="24px"
                    minHeight="400px"
                  >
                    <VStack spacing={15} maxHeight="100%" overflowY="scroll">
                      <HStack position={"relative"} w="100%">
                        <Text color="#F4F1E8" fontSize="24px" fontWeight="600">
                          Announcements
                        </Text>
                      </HStack>
                      <Box scrollBehavior="smooth" width="100%">
                        {announcements.map((announcement) => (
                          <Box {...Box1AnnStyle} key={announcement._id}>
                            <HStack position={"relative"} w="100%">
                              <Box {...Box2AnnStyle}></Box>
                              <Text {...TextAnnStyle}> {announcement.subject} </Text>
                              <IconButton aria-label="More options" position={"absolute"} {...IconButtonStyle}>
                                <EllipsisVertical color="#333333" />
                              </IconButton>
                            </HStack>
                          </Box>
                        ))}
                      </Box>
                    </VStack>
                  </GridItem>
                </Grid>
              </VStack>
            </Box>
          </MobileView>
        </Box>
      ) : (
        <Box></Box>
      )}
    </Box>
  );
}
