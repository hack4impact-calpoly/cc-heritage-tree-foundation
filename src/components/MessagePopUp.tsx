"use client";
import { Box, Text, Flex, Link, Icon, HStack } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import { Download, FileText, Image, File } from "lucide-react";

export default function MessagePopUp(props: any) {
  const getFileIcon = (url: string) => {
    const extension = url.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")) {
      return Image;
    }
    if (["pdf", "doc", "docx", "txt"].includes(extension || "")) {
      return FileText;
    }
    return File;
  };

  const getFileName = (url: string) => {
    const parts = url.split("/");
    const fullFileName = parts[parts.length - 1];

    // Extract original filename from the pattern: timestamp-randomSuffix-originalName.extension
    const match = fullFileName.match(/\d+-\w+-(.+)$/);
    if (match) {
      // Decode URL encoding (e.g., %20 becomes space)
      return decodeURIComponent(match[1]); // Return just the original filename
    }

    // Fallback to full filename if pattern doesn't match
    return decodeURIComponent(fullFileName);
  };

  return (
    <>
      <Box
        width={isMobile ? "100%" : 500}
        ml={isMobile ? 0 : 5}
        height={isMobile ? "100%" : 600}
        bg={"white"}
        borderRadius={10}
        overflow="auto"
      >
        <Box width="100%" height="1/3" bg="#596334" borderTopLeftRadius={10} borderTopRightRadius={10}>
          <Flex direction="column" justifyContent={"flex-end"} alignItems={"flex-start"}>
            <Text ml={5} mr={5} fontSize="2xl" color={"white"} mt={10}>
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
        <Text m={3} mb={props.attachmentUrl ? 3 : 3}>
          {props.messageContent}
        </Text>

        {props.attachmentUrl && (
          <Box m={3} p={3} border="1px solid #e2e8f0" borderRadius="md" bg="gray.50">
            <Text fontWeight="bold" mb={2} color="#596334">
              Attachment:
            </Text>
            <Link href={props.attachmentUrl} isExternal>
              <HStack spacing={2} p={2} bg="white" borderRadius="md" _hover={{ bg: "gray.100" }}>
                <Icon as={getFileIcon(props.attachmentUrl)} color="#596334" />
                <Text fontSize="sm" color="#596334">
                  {getFileName(props.attachmentUrl)}
                </Text>
                <Icon as={Download} color="#596334" size="sm" />
              </HStack>
            </Link>
          </Box>
        )}
      </Box>
    </>
  );
}
