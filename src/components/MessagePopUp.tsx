"use client";
import { Box, Text, Flex } from "@chakra-ui/react";

export default function MessagePopUp(props: any) {
  return (
    <>
      <Box width={350} ml={5} height={600} bg={"white"} borderRadius={10}>
        <Box width="100%" height="1/3" bg="#596334" borderTopLeftRadius={10} borderTopRightRadius={10}>
          <Flex direction="column" justifyContent={"flex-end"} alignItems={"flex-start"}>
            <Text m={5} fontSize="2xl" color={"white"}>
              {props.messageTitle}
            </Text>
            <Text ml={5} mb={5} color="#DFED98">
              {props.adminName}
            </Text>
          </Flex>
        </Box>
        <Flex justifyContent={"flex-end"}>
          <Text m={5}>{props.date}</Text>
        </Flex>
        <Text m={3}>
          {props.messageContent} Message ID: {props.id}
        </Text>
      </Box>
    </>
  );
}
