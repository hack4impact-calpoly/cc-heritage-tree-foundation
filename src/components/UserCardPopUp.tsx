"use client";
import React, { PropsWithChildren } from "react";
import { Popover, PopoverTrigger, PopoverContent, PopoverBody, Stack, Button, Portal } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { MdArrowOutward, MdOutlinePeopleAlt } from "react-icons/md";

const UserCardPopover: React.FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const { signOut } = useClerk();

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        {/* using children as trigger */}
        <div style={{ display: "inline-block" }}>{children}</div>
      </PopoverTrigger>
      <Portal>
        <PopoverContent w="180px" zIndex={100000}>
          <PopoverBody>
            <Stack spacing={3}>
              <Button
                variant="ghost"
                width="100%"
                justifyContent="flex-start"
                fontWeight="normal"
                leftIcon={<MdOutlinePeopleAlt />}
                onClick={() => router.push("/userProfile")}
              >
                My Profile
              </Button>
              <Button
                variant="ghost"
                width="100%"
                justifyContent="flex-start"
                fontWeight="normal"
                leftIcon={<MdArrowOutward />}
                onClick={() => signOut()}
              >
                Log Out
              </Button>
            </Stack>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default UserCardPopover;
