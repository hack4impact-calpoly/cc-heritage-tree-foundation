"use client";

import { SignInButton, SignUpButton, SignedIn, SignIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { ChakraProvider, Flex } from "@chakra-ui/react";

export default function ProfileCard() {
  const { user } = useUser();

  return (
    <Flex justify="flex-end" gap="4" bg="#F4F1E8">
      <div>
        <Box borderWidth="3px" padding={10} rounded="10" m="20px" bg="white">
          <SignedIn>
            <Flex align="center" gap={10}>
              <UserButton></UserButton>
              {/* <Image src={user?.imageUrl} alt="User Profile" boxSize="32px" borderRadius="50%" /> */}
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
