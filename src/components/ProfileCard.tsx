"use client";

import { SignInButton, SignUpButton, SignedIn, SignIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { ChakraProvider, Flex } from "@chakra-ui/react";

export default function ProfileCard() {
  const { user } = useUser();

  return (
    <Flex justify="flex-end">
      <SignedIn>
        <UserButton />
        <div>{user?.firstName}</div>
      </SignedIn>
    </Flex>
  );
}
