"use client";

import React from "react";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { Flex, Box, Image } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./profileCard.module.css";

export default function ProfileCard() {
  const { user } = useUser();
  const router = useRouter();

  return (
    <SignedIn>
      <Flex justify="flex-end" gap="4" h="100px" w="100vw" transform={"translate(-15rem)"}>
        {/* <div className={styles.profileCardBox} onClick={() => router.push("/userProfile")}> */}
        <Box rounded="10" padding="20px" mt="20px" mr="20px" bg="white" onClick={() => router.push("/userProfile")}>
          <Flex align="center" gap={5}>
            {/* TODO: Once funcionality is working for profile card drop down then remove user button 
              and uncomment the image below */}
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
          </Flex>
        </Box>
        {/* </div> */}
      </Flex>
    </SignedIn>
  );
}
