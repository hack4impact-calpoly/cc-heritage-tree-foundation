"use client";
import { ArrowUpRight } from "lucide-react";
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
} from "@chakra-ui/react";
import React from "react";
import { LeftUser, TextUser } from "@/styles/UserStyle";
import { CenterStyle } from "@/styles/AllStyle";
import { BoxItem, IconStyle, VO } from "@/styles/AdminDashStyle";

function UserProfile() {
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
                        alt="Profile Picture Not Appearing"
                        src="/pfp.png"
                      ></Image>
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
                          Jane Doe
                        </Text>
                      </Center>
                      <Center {...LeftUser}>
                        <Text textStyle="xs" {...TextUser} mt={5}>
                          Email
                        </Text>
                      </Center>
                      <Center {...LeftUser}>
                        <Text fontSize="xs" {...LeftUser} color="black" mt={2} mr={30}>
                          janedoe123@gmail.com
                        </Text>
                      </Center>
                      <Center {...LeftUser}>
                        <Text mr={30} {...TextUser} mt={5}>
                          Phone
                        </Text>
                      </Center>
                      <Center fontSize="xs" {...LeftUser}>
                        <Text color="black" mt={2}>
                          000-000-0000
                        </Text>
                      </Center>
                      <Center {...LeftUser}>
                        <Text {...TextUser} mr={30} mt={5}>
                          Roles
                        </Text>
                      </Center>
                      <Center {...LeftUser}>
                        <Text fontSize="xs" color="black" mt={2}>
                          Admin, Volunteer
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
                    <ArrowUpRight></ArrowUpRight>
                  </Link>
                </HStack>
                <Box borderRadius="20px" overflow="hidden" border="1px solid" borderColor={"#596334"} mt={10}>
                  <Table size="sm" variant="simple" bg="#FAF9F6">
                    <Thead bg="#DFED98">
                      <Tr>
                        <Th width={"20%"}>#</Th>
                        <Th width={"20%"}>Species</Th>
                        <Th width={"20%"}>Date Recorded</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>1</Td>
                        <Td>
                          <Box {...VO} {...IconStyle}>
                            VO
                          </Box>
                        </Td>
                        <Td>00/00/0000</Td>
                      </Tr>
                      <Tr>
                        <Td>1</Td>
                        <Td>
                          <Box {...VO} {...IconStyle}>
                            VO
                          </Box>
                        </Td>
                        <Td>00/00/0000</Td>
                      </Tr>
                      <Tr>
                        <Td>1</Td>
                        <Td>
                          <Box {...VO} {...IconStyle}>
                            VO
                          </Box>
                        </Td>
                        <Td>00/00/0000</Td>
                      </Tr>
                      <Tr>
                        <Td>1</Td>
                        <Td>
                          <Box {...VO} {...IconStyle}>
                            VO
                          </Box>
                        </Td>
                        <Td>00/00/0000</Td>
                      </Tr>
                      <Tr>
                        <Td>1</Td>
                        <Td>
                          <Box {...VO} {...IconStyle}>
                            VO
                          </Box>
                        </Td>
                        <Td>00/00/0000</Td>
                      </Tr>
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
