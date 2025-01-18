"use client";
import { Center, Text, Box, Button, Input, FormControl, FormLabel } from "@chakra-ui/react";
import React, { useState } from "react";

export default function Login() {
  // set original value of email to an empty string
  const [email, setEmail] = useState("");
  // set original value of password to an empty string
  const [password, setPassword] = useState("");

  // handle signing in
  function signIn() {
    console.log(email);
    console.log(password);
  }

  return (
    <div>
      {/* put login form into a box */}
      <Center width={"100vw"} height={"100vh"}>
        <Box
          alignItems="center"
          borderRadius="md"
          borderColor="black"
          borderWidth={1}
          bg="white"
          w="500px"
          p={10}
          color="black"
        >
          <Text mb={4} align="center" fontSize="30px">
            Sign In
          </Text>
          <Text color="gray" align="center" mb={4}>
            Sign in to continue to your CCHTF dashboard
          </Text>
          <FormControl>
            <FormLabel>Email</FormLabel>
            {/* update value of email and password every time user types */}
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email"></Input>
            <FormLabel>Password</FormLabel>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} type="text"></Input>
            <Button color="white" bg="gray" w="100%" onClick={signIn} mt={4} type="submit">
              Sign in
            </Button>
          </FormControl>
        </Box>
      </Center>
    </div>
  );
}
