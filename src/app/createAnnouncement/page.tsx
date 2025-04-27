"use client";
import { useUser } from "@clerk/nextjs";

import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  IconButton,
  HStack,
  Text,
} from "@chakra-ui/react";
import { AttachmentIcon } from "@chakra-ui/icons";
import { InputStyleAnnouncement } from "@/styles/CreateAnnouncementStyle";

const CreateAnnouncement = () => {
  const { user } = useUser();
  type AnnouncementData = {
    recipients: string;
    subject: string;
    message: string;
    attachment: File | null;
  };

  const [formData, setFormData] = useState<AnnouncementData>({
    recipients: "",
    subject: "",
    message: "",
    attachment: null, // Make sure this is 'attachment'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        attachment: e.target.files![0],
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const from = user?.fullName || "Unknown Sender";
      const to = formData.recipients.split(",").map((r) => r.trim());

      const payload = {
        from,
        to,
        subject: formData.subject,
        message: formData.message,
      };

      console.log("Submitted Data: ", formData);

      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to send announcement");

      const data = await res.json();
      console.log("Announcement sent:", data);
    } catch (err) {
      console.error("Error submitting:", err);
    }
  };

  return (
    <Box
      position="absolute"
      width="100vw"
      minHeight="100vh"
      bg="#F4F1E8"
      transform="translateX(-15rem)"
      pl="15rem"
      display="flex"
      alignItems="center"
    >
      <VStack spacing={7} align="start" p="50px" py="50px" width="100%" maxW="900px" mx="auto">
        <Box fontSize="3xl" fontWeight="bold">
          New Message
        </Box>
        <FormControl>
          <FormLabel fontWeight="bold">Send to</FormLabel>
          <Input
            name="recipients"
            placeholder="Find recipients"
            _placeholder={{ color: "#596435" }}
            value={formData.recipients}
            onChange={handleChange}
            {...InputStyleAnnouncement}
          />
        </FormControl>
        <FormControl>
          <FormLabel fontWeight="bold">Subject</FormLabel>
          <Input
            name="subject"
            placeholder="Subject line here"
            _placeholder={{ color: "#596435" }}
            value={formData.subject}
            onChange={handleChange}
            {...InputStyleAnnouncement}
          />
        </FormControl>
        <FormControl position="relative">
          <FormLabel fontWeight="bold">Message</FormLabel>
          <Textarea
            name="message"
            placeholder="Type your message here..."
            _placeholder={{ color: "#596435" }}
            value={formData.message}
            onChange={handleChange}
            {...InputStyleAnnouncement}
            h="250px"
            pr="40px" // Space for icon
          />
          <Box position="absolute" top="35px" right="15px" display="flex" alignItems="center">
            <label htmlFor="file-upload" style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <IconButton
                icon={<AttachmentIcon />}
                bg="transparent"
                color="black"
                aria-label="Upload file"
                _hover={{ color: "black" }}
                as="label"
                htmlFor="file-upload"
                mr="-6px"
              />
              <Text fontSize="sm" color="black">
                {formData.attachment ? formData.attachment.name : "Add attachment"}
              </Text>
            </label>
          </Box>
          <Input type="file" id="file-upload" display="none" onChange={handleFileChange} />
        </FormControl>
        <HStack spacing={5}>
          <Button px="30px" fontWeight="normal" rounded="full" bg="#596435" color="white" onClick={handleSubmit}>
            Send
          </Button>
          <Button
            borderWidth="1.5px"
            fontWeight="normal"
            rounded="full"
            variant="outline"
            bg="white"
            borderColor="#596435"
            color="#596435"
          >
            Cancel
          </Button>
        </HStack>
      </VStack>
    </Box>
    // </Box>
  );
};

export default CreateAnnouncement;
