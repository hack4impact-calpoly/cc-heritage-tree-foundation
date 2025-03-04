"use client";
import { Center, VStack, Image, Text, Link, Box, Button, Input, FormControl, Circle } from "@chakra-ui/react";
import React, { useState } from "react";
import { ClerkProvider, SignInButton, SignUpButton, SignedIn, SignIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Login() {
  return (
    <SignedOut>
      <div style={{ backgroundColor: "#596334" }}>
        <Center width={"100vw"} height={"100vh"}>
          <SignIn routing="hash" signUpUrl="/signup" />
        </Center>
      </div>
    </SignedOut>
  );
}
