"use client";

import { Clerk, SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { Flex, Box, Image } from "@chakra-ui/react";
import { useRef, useState } from "react";

//Profile card component holds account management and displays user information
export default function ProfileCard() {
  const { user } = useUser();

  return (
    <Flex justify="flex-end" gap="4" bg="#F4F1E8">
      <div>
        <Box borderWidth="3px" padding={10} rounded="10" m="20px" bg="white">
          <SignedIn>
            <Flex align="center" gap={10}>
              <UserButton />
              <Flex direction="column">
                <div>
                  {user?.firstName} {user?.lastName}
                </div>
                <div style={{ color: "gray" }}>Role</div>
              </Flex>
              <Flex gap="4">
                <Image src="/downArrow.svg" alt="Down Arrow" boxSize="24px" />
              </Flex>
            </Flex>
          </SignedIn>
        </Box>
      </div>
    </Flex>
  );
}
