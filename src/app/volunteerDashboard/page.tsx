"use client";
import React, { useState, useEffect } from "react";
import { Box, Grid, GridItem, Text, Button, HStack, VStack, Link, IconButton, Flex, Image } from "@chakra-ui/react";
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
} from "@/styles/VolunteerDashStyle";
import { BrowserView, MobileView, isMobile } from "react-device-detect";
import { trackSynchronousRequestDataAccessInDev } from "next/dist/server/app-render/dynamic-rendering";
export default function VolunteerDashboard() {
  const router = useRouter();
  const user = useUser();
  const [isClient, setIsClient] = useState(false);
  const [treeData, setTreeData] = useState<ITree[]>([]);

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

  console.log(user.user?.username);
  return (
    <div>
      {isClient ? (
        <div>
          <BrowserView>
            <Box
              position="absolute"
              transform="translateX(-15rem)"
              height="100%"
              width="100vw"
              maxWidth="100%"
              bg="#F4F1E8"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Box ml="15rem" width="100%" height="100%" p={{ base: "20px", md: "50px" }} overflow="scroll">
                <Grid
                  h="100%"
                  w="100%"
                  templateRows={{ base: "auto auto auto auto", md: "repeat(8, 1fr)" }}
                  templateColumns={{ base: "1fr", md: "repeat(7, 1fr)" }}
                  gap={4}
                >
                  {/* Hello Message */}
                  <GridItem rowSpan={1} colSpan={{ base: 1, md: 7 }}>
                    <Text fontSize="3xl" color="#596334" fontWeight="bold">
                      Hello {user.user?.firstName} 👋
                    </Text>
                    <Text fontSize="16px" color="#333" fontWeight={"400"}>
                      Thank you so much for your effort, let&#39;s do this!
                    </Text>
                  </GridItem>

                  {/* Tree Logs */}
                  <GridItem
                    rowSpan={{ base: 1, md: 3 }}
                    colSpan={{ base: 1, md: 3 }}
                    minWidth="300px"
                    overflow="scroll"
                  >
                    <Flex w="100%" h="100%" borderRadius="16px" bg="white" p="20px" flexDir="column" gap="15px">
                      <HStack position="relative">
                        <Button
                          bg="#596334"
                          px="14px"
                          py="3px"
                          borderRadius="12px"
                          onClick={() => router.push("/newTreeForm")}
                        >
                          <Box w="24px" h="24px" borderRadius="100px" bg="#F4F1E8" {...CenterStyle}>
                            <Plus color="#596334" />
                          </Box>
                          <Text ml="10px" color="#F4F1E8" fontSize="16px">
                            Add Tree
                          </Text>
                        </Button>
                        <Link href="/treeTable" position="absolute" top="0px" right="0px">
                          <ArrowUpRight color="#333333" />
                        </Link>
                      </HStack>
                      <Text fontSize="20px" fontWeight="600" color="#333333">
                        Trees Logged
                      </Text>
                      <Flex flexDir="row" gap="10px" flexGrow={1} minHeight="0">
                        <Box
                          bg="#DFED98"
                          borderRadius="12px"
                          padding="10px"
                          w="50%"
                          flexGrow={1}
                          display="flex"
                          flexDir="column"
                          minHeight="100px"
                        >
                          <Text w="100%" {...TextWeightStyle} fontSize={{ base: "20px", md: "1vw" }}>
                            You&#39;ve logged
                          </Text>
                          <Flex flexGrow={1} {...CenterStyle}>
                            <HStack>
                              <Text fontSize={{ base: "50px", md: "2.5vw" }} {...TextWeightStyle}>
                                {treeData.filter((tree) => tree.collectorName == user.user?.fullName).length}
                              </Text>
                              <Text fontSize={{ base: "20px", md: "1vw" }} {...TextWeightStyle}>
                                tree
                                {treeData.filter((tree) => tree.collectorName == user.user?.fullName).length > 1
                                  ? ""
                                  : "s"}
                              </Text>
                            </HStack>
                          </Flex>
                        </Box>
                        <Box
                          borderRadius="12px"
                          border="3px solid #647038"
                          padding="10px"
                          w="50%"
                          flexGrow={1}
                          display="flex"
                          flexDir="column"
                          minHeight="100px"
                        >
                          <Text w="100%" {...TextWeightStyle} fontSize={{ base: "20px", md: "1vw" }}>
                            Total logged
                          </Text>
                          <Flex flexGrow={1} alignItems="center" justifyContent="center">
                            <HStack>
                              <Text fontSize={{ base: "50px", md: "2.5vw" }} {...TextWeightStyle}>
                                {treeData ? treeData.length : "0"}
                              </Text>
                              <Text fontSize={{ base: "20px", md: "1vw" }} {...TextWeightStyle}>
                                trees
                              </Text>
                            </HStack>
                          </Flex>
                        </Box>
                      </Flex>
                    </Flex>
                  </GridItem>

                  {/* Map */}

                  <GridItem
                    rowSpan={{ base: 2, md: 7 }}
                    colSpan={{ base: 1, md: 4 }}
                    bg="white"
                    borderRadius="16px"
                    {...CenterStyle}
                    minHeight="300px"
                  >
                    <Map trees={treeData} />
                  </GridItem>

                  {/* Announcements */}
                  <GridItem
                    rowSpan={{ base: 1, md: 4 }}
                    colSpan={{ base: 1, md: 3 }}
                    borderRadius="16px"
                    bg="#596334"
                    p="24px"
                  >
                    <VStack spacing={15} maxHeight="100%" overflowY="scroll">
                      <HStack position={"relative"} w="100%">
                        <Text color="#F4F1E8" fontSize="24px" fontWeight="600">
                          Announcements
                        </Text>
                        <Link href="/messages" position="absolute" top="0px" right="0px">
                          <ArrowUpRight color="#F4F1E8" />
                        </Link>
                      </HStack>
                      <Box {...Box1AnnStyle}>
                        <HStack position={"relative"} w="100%">
                          <Box {...Box2AnnStyle}></Box>
                          <Text {...TextAnnStyle}>
                            Hello Volunteers! Please check your emails for updates from CCHTF
                          </Text>
                          <IconButton aria-label="More options" position={"absolute"} {...IconButtonStyle}>
                            <EllipsisVertical color="#333333" />
                          </IconButton>
                        </HStack>
                      </Box>
                      <Box {...Box1AnnStyle}>
                        <HStack position={"relative"}>
                          <Box {...Box2AnnStyle}></Box>
                          <Text {...TextAnnStyle}>
                            You&#39;ve logged 25 trees 🎉🎉 Thank you so much for your hard work!
                          </Text>
                          <IconButton aria-label="More options" position={"absolute"} {...IconButtonStyle}>
                            <EllipsisVertical color="#333333" />
                          </IconButton>
                        </HStack>
                      </Box>
                      <Box {...Box1AnnStyle}>
                        <HStack position={"relative"}>
                          <Box {...Box2AnnStyle}></Box>
                          <Text {...TextAnnStyle}>Message here!</Text>
                          <IconButton aria-label="More options" position={"absolute"} {...IconButtonStyle}>
                            <EllipsisVertical color="#333333" />
                          </IconButton>
                        </HStack>
                      </Box>
                      <Text color="#DFED98" fontSize="16px" fontWeight="400">
                        No other messages
                      </Text>
                    </VStack>
                  </GridItem>
                </Grid>
              </Box>
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
                    <Flex w="100%" h="100%" borderRadius="16px" bg="white" p="20px" flexDir="column" gap="15px">
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
                      <Flex flexDir="row" gap="10px" flexGrow={1} minHeight="0">
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
                          <Flex flexGrow={1} {...CenterStyle}>
                            <HStack>
                              <Text fontSize={{ base: "50px", md: "2.5vw" }} {...TextWeightStyle}>
                                25
                              </Text>
                              <Text fontSize={{ base: "20px", md: "1vw" }} {...TextWeightStyle}>
                                trees
                              </Text>
                            </HStack>
                          </Flex>
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
                          <Flex flexGrow={1} alignItems="center" justifyContent="center">
                            <HStack>
                              <Text fontSize={{ base: "50px", md: "2.5vw" }} {...TextWeightStyle}>
                                175
                              </Text>
                              <Text fontSize={{ base: "20px", md: "1vw" }} {...TextWeightStyle}>
                                trees
                              </Text>
                            </HStack>
                          </Flex>
                        </Box>
                      </Flex>
                    </Flex>
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
                      <Box {...Box1AnnStyle}>
                        <HStack position={"relative"} w="100%">
                          <Box {...Box2AnnStyle}></Box>
                          <Text {...TextAnnStyle}>
                            Hello Volunteers! Please check your emails for updates from CCHTF
                          </Text>
                          <IconButton aria-label="More options" position={"absolute"} {...IconButtonStyle}>
                            <EllipsisVertical color="#333333" />
                          </IconButton>
                        </HStack>
                      </Box>
                      <Box {...Box1AnnStyle}>
                        <HStack position={"relative"}>
                          <Box {...Box2AnnStyle}></Box>
                          <Text {...TextAnnStyle}>
                            You&#39;ve logged 25 trees 🎉🎉 Thank you so much for your hard work!
                          </Text>
                          <IconButton aria-label="More options" position={"absolute"} {...IconButtonStyle}>
                            <EllipsisVertical color="#333333" />
                          </IconButton>
                        </HStack>
                      </Box>
                      <Box {...Box1AnnStyle}>
                        <HStack position={"relative"}>
                          <Box {...Box2AnnStyle}></Box>
                          <Text {...TextAnnStyle}>Message here!</Text>
                          <IconButton aria-label="More options" position={"absolute"} {...IconButtonStyle}>
                            <EllipsisVertical color="#333333" />
                          </IconButton>
                        </HStack>
                      </Box>
                      <Text color="#DFED98" fontSize="16px" fontWeight="400">
                        No other messages
                      </Text>
                    </VStack>
                  </GridItem>
                </Grid>
              </VStack>
            </Box>
          </MobileView>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
