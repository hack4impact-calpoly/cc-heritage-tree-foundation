"use client";
import { ArrowUpRight, NotebookPen, SquarePen } from "lucide-react";
import {
  Grid,
  Image,
  GridItem,
  Text,
  Button,
  Link,
  Box,
  HStack,
  Table,
  Td,
  Tbody,
  Th,
  Thead,
  Flex,
  Tr,
} from "@chakra-ui/react";
import Map from "@/components/Map";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { IconStyle, BoxItem, VO, Condition, ConditionMobile } from "@/styles/AdminDashStyle";
import { AlignJustify } from "lucide-react";
import { BrowserView, MobileView } from "react-device-detect";
import { useState, useEffect } from "react";

function AdminDashboard() {
  const user = useUser();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      {isClient ? (
        <div>
          <BrowserView>
            <Box width="100%" height="100%" p={{ base: "20px", md: "0 50px 50px 50px" }} pt="0px">
              <Grid
                width="100%"
                height="100%"
                templateRows={{ base: "auto auto auto auto", md: "repeat(10, 1fr)" }}
                templateColumns={{ base: "1fr", md: "repeat(8, 1fr)" }}
                gap={4}
              >
                {/* Welcome Message */}
                <GridItem colSpan={{ base: 1, md: 8 }} rowSpan={1} display="flex" alignItems="center">
                  <Text fontSize="3xl" fontWeight="bold" color="#596334">
                    Welcome back, {user.user?.firstName}!
                  </Text>
                </GridItem>

                {/* Trees Logged This Year */}
                <GridItem rowSpan={{ base: 1, md: 3 }} colSpan={{ base: 1, md: 3 }}>
                  <Box {...BoxItem} height="100%" p={{ base: 5, md: 10 }}>
                    <HStack>
                      <Text color="#333333">Trees Logged This Year</Text>
                      <Link href="" ml="auto">
                        <ArrowUpRight />
                      </Link>
                    </HStack>
                    <Text mt={5} mb={5} fontWeight="bold" color="#596334" fontSize="7xl">
                      123
                    </Text>
                    <Text color="#333333">% incr from December</Text>
                  </Box>
                </GridItem>

                {/* Trees in Poor Condition */}
                <GridItem rowSpan={{ base: 2, md: 4 }} colSpan={{ base: 1, md: 5 }}>
                  <Box {...BoxItem} height="100%" p={{ base: 5, md: 10 }}>
                    <HStack>
                      <Text color="#333333">Trees in Poor Condition</Text>
                      <Link href="" ml="auto">
                        <ArrowUpRight />
                      </Link>
                    </HStack>
                    <Box borderRadius="20px" overflow="hidden" border="1px solid" borderColor="#596334" mt={10}>
                      <Table size="sm" variant="simple">
                        <Thead bg="#DFED98">
                          <Tr h="40px">
                            <Th width="20%">#</Th>
                            <Th width="20%">Species</Th>
                            <Th width="20%">Condition</Th>
                            <Th width="20%">Date Recorded</Th>
                            <Th width="20%">Volunteer</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {[1, 2, 3].map((item) => (
                            <Tr key={item}>
                              <Td>{item}</Td>
                              <Td>
                                <Box {...VO} {...IconStyle}>
                                  VO
                                </Box>
                              </Td>
                              <Td>
                                <Box {...Condition} {...IconStyle}>
                                  {item === 1 ? 10 : item === 2 ? 8 : 9}
                                </Box>
                              </Td>
                              <Td>{item === 1 ? "12/24/2024" : item === 2 ? "1/3/2025" : "2/6/2025"}</Td>
                              <Td>
                                <NotebookPen />
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Box>
                  </Box>
                </GridItem>

                {/* Create New Announcement Button */}
                <GridItem rowSpan={1} colSpan={{ base: 1, md: 3 }}>
                  <Box display="flex" justifyContent="center" {...BoxItem} height="100%">
                    <Button
                      width="100%"
                      maxWidth="300px"
                      height="50px"
                      color="white"
                      bg="#E57300"
                      borderRadius="50px"
                      fontWeight="bold"
                      fontSize="sm"
                      onClick={() => router.push("/createAnnouncement")}
                    >
                      Create new announcement&nbsp;
                      <SquarePen />
                    </Button>
                  </Box>
                </GridItem>

                {/* Map */}
                <GridItem rowSpan={{ base: 2, md: 5 }} colSpan={{ base: 1, md: 8 }} data-testid="map_id">
                  <Map />
                </GridItem>
              </Grid>
            </Box>
          </BrowserView>

          <MobileView>
            <div
              style={{
                position: "absolute",
                marginLeft: "20px",
                marginTop: "15px",
              }}
            >
              <AlignJustify></AlignJustify>
            </div>
            {/* add tree icon */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "50px",
              }}
            >
              <Image src="./logo1.png" alt="tree icon" height={"50px"}></Image>
            </div>
            <Box width="100%" height="100%" p={{ base: "20px", md: "0 50px 50px 50px" }} pt="0px">
              <Grid
                width="100%"
                height="100%"
                templateRows={{ base: "auto auto auto auto", md: "repeat(10, 1fr)" }}
                templateColumns={{ base: "1fr", md: "repeat(8, 1fr)" }}
                gap={4}
                mt={5}
              >
                {/* Create New Announcement Button */}
                <GridItem rowSpan={1} colSpan={{ base: 1, md: 3 }}>
                  <Box mt={5} display="flex" justifyContent="center" {...BoxItem} height={100}>
                    <Button
                      width="100%"
                      maxWidth="300px"
                      height="50px"
                      color="white"
                      bg="#E57300"
                      borderRadius="50px"
                      fontWeight="bold"
                      fontSize="sm"
                      onClick={() => router.push("/createAnnouncement")}
                    >
                      Create new announcement&nbsp;
                      <SquarePen />
                    </Button>
                  </Box>
                </GridItem>

                <Flex justifyContent={"space-between"} mt={5}>
                  {/* Trees Logged This Year */}
                  <GridItem width="50%" m={1} height={165}>
                    <Box {...BoxItem} height="100%" p={{ base: 2, md: 2 }}>
                      <Text ml={2} fontWeight="bold" color="#596334" fontSize="4xl">
                        123
                      </Text>
                      <Text ml={2} color="#333333">
                        Trees Logged This Year
                      </Text>
                      <Text mt={2} ml={2} color="#596334">
                        % incr from 2024
                      </Text>
                    </Box>
                  </GridItem>

                  {/* Trees in Poor Condition 165*/}
                  <GridItem width="50%" m={1} height={165}>
                    <Box {...BoxItem} height="100%" p={{ base: 2, md: 2 }}>
                      <Text ml={2} fontWeight="bold" color="#596334" fontSize="4xl">
                        5
                      </Text>
                      <Text ml={2} color="#333333">
                        Trees in Poor Condition
                      </Text>
                      <Flex mt={2} justifyContent={"space-evenly"}>
                        <Box {...ConditionMobile} bg={"#A41D00"}>
                          1
                        </Box>
                        <Box {...ConditionMobile} bg={"#BC4201"}>
                          2
                        </Box>
                        <Box {...ConditionMobile} bg={"#ED8426"}>
                          3
                        </Box>
                      </Flex>
                    </Box>
                  </GridItem>
                </Flex>

                {/* Map */}
                <GridItem height={250} data-testid="map_id">
                  <Text fontSize="2xl" mb={5} fontWeight={"bold"}>
                    Map
                  </Text>
                  <Map />
                </GridItem>
              </Grid>
            </Box>
          </MobileView>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default AdminDashboard;
