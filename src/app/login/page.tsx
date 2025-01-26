"use client";
import { Center, VStack, Image, Text, Link, Box, Button, Input, FormControl, Circle } from "@chakra-ui/react";
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
    <div style={{ backgroundColor: "#596334" }}>
      {/* put login form into a box */}
      <Center width={"100vw"} height={"100vh"}>
        {/* logo */}
        <Circle mb={325} position="absolute" size="150px" backgroundColor="#F4F1E8"></Circle>
        <Image
          mb={325}
          position="absolute"
          boxSize="120px"
          borderRadius="full"
          fit="contain"
          alt="Logo not Appearing"
          src="/logo.png"
        ></Image>
        <Box
          mt={20}
          alignItems="center"
          borderRadius="xl"
          borderColor="black"
          bg="white"
          w="400px"
          p={10}
          color="black"
        >
          <Text color="#596334" align="center" mt={35}>
            Sign in to continue to your
          </Text>
          <Text color="#596334" align="center">
            CCHTF dashboard{" "}
          </Text>
          <FormControl>
            {/* update value of email and password every time user types */}
            <Input
              backgroundColor="#F4F1E8"
              mt={4}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            ></Input>
            <Input
              backgroundColor="#F4F1E8"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="text"
              mt={4}
            ></Input>
            <Button color="white" bg="#596334" w="100%" onClick={signIn} mt={4} type="submit">
              Sign in
            </Button>
            <Center>
              <Text color="#596334" mt={4}>
                Don&#39;t have an account?<Link href="/"> Sign up</Link>
              </Text>
            </Center>
          </FormControl>
        </Box>
      </Center>
    </div>
  );
}
