"use client";
import Navbar from "@/components/Navbar";
import { Box, Progress, Tabs, TabList, TabPanels, Tab, TabPanel, Flex } from "@chakra-ui/react";
import { GoRows } from "react-icons/go";
import { PiRows } from "react-icons/pi";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { user } = useUser();
  return (
    <Flex direction="row">
      {user?.primaryEmailAddress?.emailAddress}
      <br />
      {user?.id}
      <Box>
        <Box width="200px" bg="lavender" textAlign="center">
          Here are some ChakraUI examples: <br />
          <br />
          This is a box with Chakra! Basically just a div
        </Box>
        A progress bar...
        <Progress value={50} width="200px" />A tab list...
        <Tabs width="200px">
          <TabList>
            <Tab>One</Tab>
            <Tab>Two</Tab>
            <Tab>Three</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <p>one!</p>
            </TabPanel>
            <TabPanel>
              <p>two!</p>
            </TabPanel>
            <TabPanel>
              <p>three!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
        The main thing to know is just to use in-line styling, and for most traditional css elements there is a Chakra
        UI equivalent!
      </Box>
    </Flex>
  );
}
