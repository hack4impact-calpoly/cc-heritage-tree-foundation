"use client";
import {
  Grid,
  GridItem,
  Image,
  Text,
  Button,
  Link,
  Box,
  Center,
  Input,
  FormControl,
  Checkbox,
  VStack,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { InputUser, TextUser } from "@/styles/UserStyle";
import { CenterStyle } from "@/styles/AllStyle";

function EditUserProfileMobile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const saveUserInfo = () => {
    console.log("Saving user info...");
    console.log(name, email, phoneNumber);
  };

  return (
    <Center mt={8}>
      <Box maxW="90vw" borderRadius={"15px"} alignItems="center" borderColor="black" bg="white" p={10} color="black">
        <Text fontSize="3xl" fontWeight="bold" textStyle="4xl">
          Edit User Profile
        </Text>
        <Center>
          <Image
            boxSize="150px"
            borderRadius="full"
            fit="cover"
            alt="Profile Picture Not Appearing"
            src="/pfp.png"
          ></Image>
        </Center>

        <FormControl>
          <Center {...CenterStyle}>
            <Text {...TextUser} mt={4} mr={30}>
              Name
            </Text>
            <Input
              {...InputUser}
              mt={4}
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
            ></Input>
          </Center>
          <Center {...CenterStyle}>
            <Text {...TextUser} mr={34} mt={10}>
              Email
            </Text>
            <Input
              {...InputUser}
              mt={10}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            ></Input>
          </Center>
          <Center>
            <Text mr={30} {...TextUser} mt={10}>
              Phone
            </Text>
            <Input
              {...InputUser}
              mt={10}
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              type="text"
            ></Input>
          </Center>
          <Grid templateRows="repeat(2, 1fr)" templateColumns="repeat(2, 1fr)" gap={5} mt={5}>
            <GridItem colSpan={1} rowSpan={1}>
              <Text {...TextUser}>Roles</Text>
            </GridItem>
            <GridItem colSpan={1} rowSpan={1}>
              <VStack spacing={3} align="flex-start">
                {" "}
                <Checkbox name="volunteer" size="lg">
                  Volunteer
                </Checkbox>
                <Checkbox name="admin" size="lg">
                  Admin
                </Checkbox>
              </VStack>
            </GridItem>
            <GridItem colSpan={1} rowSpan={1}>
              <Text {...TextUser}>Activity</Text>
            </GridItem>
            <GridItem colSpan={1} rowSpan={1}>
              <RadioGroup>
                <VStack spacing={3} align="flex-start">
                  <Radio value="Active" size="lg">
                    Active
                  </Radio>
                  <Radio value="Inactive" size="lg">
                    Inactive
                  </Radio>
                </VStack>
              </RadioGroup>
            </GridItem>
          </Grid>
          <Center {...CenterStyle} mt={5}>
            <Link>
              <Button onClick={saveUserInfo} borderRadius={20} backgroundColor="#596334">
                <Text color="white">Save</Text>
              </Button>
            </Link>
            <Link href="/userProfile">
              <Button ml={5} borderRadius={20} backgroundColor="white" borderColor="#596334" borderWidth={1}>
                <Text color="#596334">Cancel</Text>
              </Button>
            </Link>
          </Center>
        </FormControl>
      </Box>
    </Center>
  );
}

export default EditUserProfileMobile;
