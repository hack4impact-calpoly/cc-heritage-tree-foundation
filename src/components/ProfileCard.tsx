"use client";

import { SignInButton, SignUpButton, SignedIn, SignIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { Flex, Box } from "@chakra-ui/react";

//Profile card component holds account management and displays user information
export default function ProfileCard() {
  const { user } = useUser();

  return (
    <Flex justify="flex-end" gap="4">
      <Box borderWidth="3px" padding={10} rounded="10" m="20px">
        <SignedIn>
          <Flex align="center" gap={10}>
            <UserButton />
            <Flex direction="column">
              <div>
                {user?.firstName} {user?.lastName}
              </div>
              <div>Role</div>
            </Flex>
          </Flex>
        </SignedIn>
      </Box>
    </Flex>
  );
}
