"use client";
import { Box, Grid, GridItem, Text, Button, HStack, VStack, Link, IconButton, Flex } from "@chakra-ui/react";
import { Plus, ArrowUpRight, EllipsisVertical } from "lucide-react";
import Map from "@/components/Map";
import { useRouter } from "next/navigation";

export default function VolunteerDashboard() {
  const router = useRouter();

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
      <Box ml="15rem" width="100%" height="100vh" p={{ base: "20px", md: "50px" }} overflow="scroll">
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
              Hello Jane 👋
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
                  <Box
                    w="24px"
                    h="24px"
                    borderRadius="100px"
                    bg="#F4F1E8"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Plus color="#596334" />
                  </Box>
                  <Text ml="10px" color="#F4F1E8" fontSize="16px">
                    Add Tree
                  </Text>
                </Button>
                <Link href="" position="absolute" top="0px" right="0px">
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
                  <Text w="100%" color="#596334" fontSize={{ base: "20px", md: "1vw" }} fontWeight="600">
                    You&#39;ve logged
                  </Text>
                  <Flex flexGrow={1} alignItems="center" justifyContent="center">
                    <HStack>
                      <Text color="#596334" fontSize={{ base: "50px", md: "2.5vw" }} fontWeight="600">
                        25
                      </Text>
                      <Text color="#596334" fontSize={{ base: "20px", md: "1vw" }} fontWeight="600">
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
                  <Text w="100%" color="#596334" fontSize={{ base: "20px", md: "1vw" }} fontWeight="600">
                    Total logged
                  </Text>
                  <Flex flexGrow={1} alignItems="center" justifyContent="center">
                    <HStack>
                      <Text color="#596334" fontSize={{ base: "50px", md: "2.5vw" }} fontWeight="600">
                        175
                      </Text>
                      <Text color="#596334" fontSize={{ base: "20px", md: "1vw" }} fontWeight="600">
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
            rowSpan={{ base: 2, md: 7 }} // Adjusted rowSpan for small screens
            colSpan={{ base: 1, md: 4 }}
            bg="white"
            borderRadius="16px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="300px" // Ensure the map has a minimum height
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
                <Link href="" position="absolute" top="0px" right="0px">
                  <ArrowUpRight color="#F4F1E8" />
                </Link>
              </HStack>
              <Box w="100%" bg="#F8F8F8" borderRadius="12px" py="10px" px="8px">
                <HStack position={"relative"} w="100%">
                  <Box bg="#D9D9D9" w="42px" h="42px" borderRadius="full" flexShrink={0}></Box>
                  <Text color="#000000" fontSize="16px" fontWeight="400" marginRight={10}>
                    Hello Volunteers! Please check your emails for updates from CCHTF
                  </Text>
                  <IconButton aria-label="More options" variant={"ghost"} position={"absolute"} right="0px">
                    <EllipsisVertical color="#333333" />
                  </IconButton>
                </HStack>
              </Box>
              <Box w="100%" bg="#F8F8F8" borderRadius="12px" py="10px" px="8px">
                <HStack position={"relative"}>
                  <Box bg="#D9D9D9" w="42px" h="42px" borderRadius="full" flexShrink={0}></Box>
                  <Text color="#000000" fontSize="16px" fontWeight="400" marginRight={10}>
                    You&#39;ve logged 25 trees 🎉🎉 Thank you so much for your hard work!
                  </Text>
                  <IconButton aria-label="More options" variant={"ghost"} position={"absolute"} right="0px">
                    <EllipsisVertical color="#333333" />
                  </IconButton>
                </HStack>
              </Box>
              <Box w="100%" bg="#F8F8F8" borderRadius="12px" py="10px" px="8px">
                <HStack position={"relative"}>
                  <Box bg="#D9D9D9" w="42px" h="42px" borderRadius="full" flexShrink={0}></Box>
                  <Text color="#000000" fontSize="16px" fontWeight="400" marginRight={10}>
                    Message here!
                  </Text>
                  <IconButton aria-label="More options" variant={"ghost"} position={"absolute"} right="0px">
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
