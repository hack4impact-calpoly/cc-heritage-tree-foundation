"use client";
import { Box, Grid, GridItem, Text, Button, HStack, VStack, Link, IconButton, Flex } from "@chakra-ui/react";
import { Plus, ArrowUpRight, EllipsisVertical } from "lucide-react";
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

export default function VolunteerDashboard() {
  const router = useRouter();
  const user = useUser();

  return (
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
          <GridItem rowSpan={{ base: 1, md: 3 }} colSpan={{ base: 1, md: 3 }} minWidth="300px">
            <Flex w="100%" h="100%" borderRadius="16px" bg="white" p="20px" flexDir="column" gap="15px">
              <HStack position="relative">
                <Button bg="#596334" px="14px" py="3px" borderRadius="12px" onClick={() => router.push("/newTreeForm")}>
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
                  border="3px solid #647038"
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

          {/* Map */}
          <GridItem
            rowSpan={{ base: 2, md: 7 }}
            colSpan={{ base: 1, md: 4 }}
            bg="white"
            borderRadius="16px"
            {...CenterStyle}
            minHeight="300px"
          >
            <Map />
          </GridItem>

          {/* Announcements */}
          <GridItem rowSpan={{ base: 1, md: 4 }} colSpan={{ base: 1, md: 3 }} borderRadius="16px" bg="#596334" p="24px">
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
                  <Text {...TextAnnStyle}>Hello Volunteers! Please check your emails for updates from CCHTF</Text>
                  <IconButton aria-label="More options" position={"absolute"} {...IconButtonStyle}>
                    <EllipsisVertical color="#333333" />
                  </IconButton>
                </HStack>
              </Box>
              <Box {...Box1AnnStyle}>
                <HStack position={"relative"}>
                  <Box {...Box2AnnStyle}></Box>
                  <Text {...TextAnnStyle}>You&#39;ve logged 25 trees 🎉🎉 Thank you so much for your hard work!</Text>
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
  );
}
