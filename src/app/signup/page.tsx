"use client";
import { Center, VStack, Image, Text, Link, Box, Button, Input, FormControl, Circle } from "@chakra-ui/react";
import React, { useState } from "react";
import { ClerkProvider, SignUp, SignUpButton, SignedIn, SignIn, SignedOut, UserButton } from "@clerk/nextjs";

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
    <ClerkProvider>
      <SignedOut>
        <div style={{ backgroundColor: "#596334" }}>
          <Center width={"100vw"} height={"100vh"}>
            <SignUp routing="hash" signInUrl="/login" />
          </Center>
        </div>
      </SignedOut>
    </ClerkProvider>
  );
}
