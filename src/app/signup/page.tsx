"use client";
import { Center } from "@chakra-ui/react";
import React, { useState } from "react";
import { SignUp, SignedOut } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <SignedOut>
      <div style={{ backgroundColor: "#596334" }}>
        <Center width={"100vw"} height={"100vh"}>
          <SignUp routing="hash" signInUrl="/login" />
        </Center>
      </div>
    </SignedOut>
  );
}
