"use client";
import { ChevronDown } from "lucide-react";
import { Grid, GridItem, Image, Text, Button, Flex, Link, Box, Center, Input, FormControl } from "@chakra-ui/react";
import React, { useState } from "react";

function EditUserProfile() {
  const [name, setName] = useState("Jane Doe");
  const [email, setEmail] = useState("janedoe123@gmail.com");
  const [phoneNumber, setPhoneNumber] = useState("000-000-0000");

  const saveUserInfo = () => {
    console.log("Saving user info...");
    console.log(name, email, phoneNumber);
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
              alt="Profile Picture Not Appearing"
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
            <Text fontSize="3xl" fontWeight="bold" textStyle="4xl">
              Edit User Profile
            </Text>
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
                    <Center display="flex" justifyContent="center" alignItems="center">
                      <Text fontWeight="medium" color="black" align="center" mt={4} mr={30}>
                        Name
                      </Text>
                      <Input
                        borderRadius={"10px"}
                        width={300}
                        backgroundColor="#F4F1E8"
                        mt={4}
                        placeholder="Email"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="email"
                      ></Input>
                    </Center>
                    <Center display="flex" justifyContent="center" alignItems="center">
                      <Text fontWeight="medium" mr={34} color="black" align="center" mt={10}>
                        Email
                      </Text>
                      <Input
                        borderRadius={"10px"}
                        width={300}
                        backgroundColor="#F4F1E8"
                        mt={10}
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                      ></Input>
                    </Center>
                    <Center display="flex" justifyContent="center" alignItems="center">
                      <Text fontWeight="medium" mr={30} color="black" align="center" mt={10}>
                        Phone
                      </Text>
                      <Input
                        borderRadius={"10px"}
                        width={300}
                        backgroundColor="#F4F1E8"
                        mt={10}
                        placeholder="Email"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        type="email"
                      ></Input>
                    </Center>
                    <Center display="flex" justifyContent="center" alignItems="center">
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
