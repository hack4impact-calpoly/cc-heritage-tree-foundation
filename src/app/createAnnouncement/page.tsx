"use client";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect, useRef } from "react";
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
  Checkbox,
  Image,
} from "@chakra-ui/react";
import { AlignJustify } from "lucide-react";
import { BrowserView, MobileView } from "react-device-detect";
import { AttachmentIcon, CloseIcon } from "@chakra-ui/icons";
import { InputStyleAnnouncement } from "@/styles/CreateAnnouncementStyle";
import styles from "./announcement.module.css";
import { useRouter } from "next/navigation";

const CreateAnnouncement = () => {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [isClient, setIsClient] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setIsClient(true);
  }, []);

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

  const [allUsers, setAllUsers] = useState<{ name: string; email: string; role: string }[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [activeGroup, setActiveGroup] = useState<"all" | "admin" | null>(null);

  let role = null;
  if (isLoaded && user) {
    role = user.organizationMemberships?.[0]?.role;
  }

  const isAdmin = role === "org:admin";
  if (!isAdmin) {
    router.push("/volunteerDashboard");
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user");

        if (!res.ok) {
          const errorText = await res.text(); // get error message if available
          throw new Error(`Failed to fetch users. Status: ${res.status}, Message: ${errorText}`);
        }

        const users = await res.json();
        setAllUsers(users);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      recipients: selectedRecipients.join(","),
    }));
  }, [selectedRecipients]);

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
  const handleRemoveAttachment = () => {
    setFormData((prev) => ({ ...prev, attachment: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (selectedRecipients.length === 0) {
      console.error("Please select at least one recipient.");
      return;
    }

    try {
      const from = user?.fullName || "Unknown Sender";
      const to = selectedRecipients;

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
      router.push("/messageSuccess");
    } catch (err) {
      console.error("Error submitting:", err);
    }
  };

  return (
    <div>
      {isClient ? (
        <>
          <BrowserView>
            <Box
              position="absolute"
              width="100%"
              minHeight="100%"
              bg="#F4F1E8"
              transform="translateX(-15rem)"
              pl="15rem"
            >
              <VStack spacing={7} align="start" p="50px" py="50px" width="100%" maxW="900px" mx="auto">
                <Box fontSize="3xl" fontWeight="bold">
                  New Message
                </Box>
                <FormControl as="fieldset" className={styles.recipientSection}>
                  <FormLabel as="legend" fontWeight="bold">
                    Send to
                  </FormLabel>

                  <div className={styles.buttonRow}>
                    <Button
                      bg={activeGroup === "all" ? "#e0efc4" : "white"}
                      color="#596435"
                      border={activeGroup === "all" ? "2px solid #596435" : "1px solid #ccc"}
                      _hover={{ bg: "#e0efc4" }}
                      onClick={() => {
                        setSelectedRecipients(allUsers.map((u) => u.email));
                        setActiveGroup("all");
                      }}
                    >
                      Send to All
                    </Button>

                    <Button
                      bg={activeGroup === "admin" ? "#e0efc4" : "white"}
                      color="#596435"
                      border={activeGroup === "admin" ? "2px solid #596435" : "1px solid #ccc"}
                      _hover={{ bg: "#e0efc4" }}
                      onClick={() => {
                        const admins = allUsers.filter((u) => u.role?.toLowerCase().trim() === "admin");
                        console.log("Found admins:", admins);
                        setSelectedRecipients(admins.map((u) => u.email));
                        setActiveGroup("admin");
                      }}
                    >
                      Send to Admin
                    </Button>
                  </div>

                  {allUsers.length > 0 && (
                    <div className={styles.checkboxContainer}>
                      {allUsers.map((user) => (
                        <Checkbox
                          key={user.email}
                          isChecked={selectedRecipients.includes(user.email)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setSelectedRecipients((prev) =>
                              checked ? [...prev, user.email] : prev.filter((email) => email !== user.email),
                            );
                          }}
                        >
                          {user.name} ({user.email})
                        </Checkbox>
                      ))}
                    </div>
                  )}
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
                    pr="40px"
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
                  <Input
                    type="file"
                    id="file-upload"
                    display="none"
                    onChange={handleFileChange}
                    data-testid="file-upload"
                  />
                </FormControl>
                <HStack spacing={5}>
                  <Button
                    px="30px"
                    fontWeight="normal"
                    rounded="full"
                    bg="#596435"
                    color="white"
                    onClick={handleSubmit}
                  >
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
          </BrowserView>
          <MobileView>
            <Box>
              <div
                style={{
                  position: "absolute",
                  marginLeft: "20px",
                  marginTop: "15px",
                }}
              >
                <AlignJustify></AlignJustify>
              </div>
              {/* add tree icon */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "50px",
                }}
              >
                <Image src="./logo1.png" alt="tree icon" height={"50px"}></Image>
              </div>
              <VStack spacing={7} align="start" p="50px" py="50px" width="100%" maxW="900px" mx="auto">
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
                  <Box position="absolute" bottom="15px" left="10px" display="flex" alignItems="center">
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
                  <Button
                    px="30px"
                    fontWeight="normal"
                    rounded="full"
                    bg="#596435"
                    color="white"
                    onClick={handleSubmit}
                  >
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
          </MobileView>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CreateAnnouncement;
