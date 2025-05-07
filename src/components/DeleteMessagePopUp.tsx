"use client";
import { Box, Flex, Text, Button } from "@chakra-ui/react";
import { Trash2, X } from "lucide-react";

export default function DeleteMessagePopUp({ closePopup, deleteMessage }) {
  return (
    <>
      <Box shadow="lg" width={"300px"} height={"350px"} bg={"white"} borderRadius={20}>
        <Flex justifyContent={"flex-end"}>
          <Button variant="unstyled" position={"absolute"} onClick={closePopup}>
            <X />
          </Button>
        </Flex>
        <Flex pl={5} pr={5} direction="column" justifyContent="center" alignItems="center" textAlign={"center"} mt={7}>
          <Trash2 color={"#556b2f"} size={100} />
          <Text fontWeight={"bold"} mt={5}>
            Are you sure?
          </Text>
          <Text>Do you really want to delete this message? This process can not be undone.</Text>
          <Flex gap={5} mt={5}>
            <Button
              onClick={closePopup}
              borderRadius={20}
              bg="white"
              color="#556b2f"
              borderColor={"#556b2f"}
              borderWidth={2}
            >
              Cancel
            </Button>
            <Button
              onClick={deleteMessage}
              borderRadius={20}
              color="white"
              bg="#556b2f"
              borderColor={"#556b2f"}
              borderWidth={2}
            >
              Delete
            </Button>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
