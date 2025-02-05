"use client";
import { Center, VStack, Image, Text, Link, Box, Button, Input, FormControl, Circle } from "@chakra-ui/react";
import React, { useState } from "react";
import { ClerkProvider, SignInButton, SignUpButton, SignedIn, SignIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ClerkProvider, SignInButton, SignUpButton, SignedIn, SignIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Login() {
  // set original value of email to an empty string
  const [email, setEmail] = useState("");
  // set original value of password to an empty string
  const [password, setPassword] = useState("");

  return (
    <ClerkProvider>
      <SignedOut>
        <Center width={"100vw"} height={"100vh"}>
          <div style={{ backgroundColor: "#596334" }}>
            <SignIn />
          </div>
        </Center>
      </SignedOut>
    </ClerkProvider>
  );
}
