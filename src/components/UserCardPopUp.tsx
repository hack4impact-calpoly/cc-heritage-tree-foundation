"use client";
import React, { PropsWithChildren } from "react";
import { Popover, PopoverTrigger, PopoverContent, PopoverBody, Portal } from "@chakra-ui/react";
import UserCardContent from "./UserCardContent";

const UserCardPopover: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <div style={{ display: "inline-block" }}>{children}</div>
      </PopoverTrigger>
      <Portal>
        <PopoverContent w="180px" zIndex="999999">
          <PopoverBody>
            <UserCardContent />
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default UserCardPopover;
