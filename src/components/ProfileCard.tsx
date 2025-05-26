"use client";

import React from "react";
import { SignedIn, useUser } from "@clerk/nextjs";
import { Flex, Box, Image } from "@chakra-ui/react";
import UserCardPopover from "./UserCardPopUp";

export default function ProfileCard() {
  const { user } = useUser();

  return (
    <SignedIn>
      <Flex justify="flex-end" gap="4" h="100px" w="100vw" transform={"translate(-15rem)"}>
        <UserCardPopover>
          <Box
            as="div"
            rounded="10"
            padding="20px"
            mt="20px"
            mr="20px"
            bg="white"
            cursor="pointer"
            display="flex"
            alignItems="center"
            gap="5"
          >
            <Image src={user?.imageUrl} alt="User Profile" boxSize="32px" borderRadius="50%" />
            <Flex direction="column">
              <div>
                {user?.firstName} {user?.lastName}
              </div>
              <div style={{ color: "gray" }}>Role</div>
            </Flex>
            <Flex gap="4">
              <Image src="/downArrow.svg" alt="Down Arrow" boxSize="24px" />
            </Flex>
          </Box>
        </UserCardPopover>
      </Flex>
    </SignedIn>
  );
}
