"use client";
import React, { useState } from "react";
import {
  Flex,
  Box,
  Image,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";

function Messages() {
  return (
    <Box>
      <div>Messages</div>
      <div>10 Unread Messages</div>
      <Tabs variant="soft-rounded" colorScheme="green">
        <TabList>
          <Tab>Inbox</Tab>
          <Tab>Sent</Tab>
        </TabList>
        {/* need to add a new message button */}
        <TabPanels>
          {/* This is panel is for Inbox Messages */}
          <TabPanel>
            {/* call table component  */}
            <p>one!</p>
          </TabPanel>
          {/* This panel is for Sent Messages */}
          <TabPanel>
            <p>two!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default Messages;
