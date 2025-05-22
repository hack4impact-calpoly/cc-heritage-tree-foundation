"use client";
import { Center } from "@chakra-ui/react";
import React from "react";
import { SignIn, SignedOut } from "@clerk/nextjs";

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
