"use client";
import {
  Grid,
  GridItem,
  Image,
  Text,
  Button,
  IconButton,
  Flex,
  Box,
  Center,
  Input,
  FormControl,
  Spinner,
  VStack,
  HStack,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import React, { useRef, useEffect, useState } from "react";
import { InputUser, TextUser } from "@/styles/UserStyle";
import { CenterStyle } from "@/styles/AllStyle";
import { useUser, useClerk } from "@clerk/nextjs";
import { isMobile } from "react-device-detect";
import { FileDown } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function EditUserProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileURL, setProfileURL] = useState("/pfp.png");
  const [role, setRole] = useState("Volunteer");
  const [activity, setActivity] = useState("Active");

  const router = useRouter();
  const params = useParams();
  const targetUserId = params?.volunteerID;

  // Store target user's Clerk ID for organization role updates
  const [targetClerkUserId, setTargetClerkUserId] = useState<string | null>(null);

  // to compare changes
  const [originalUserData, setOriginalUserData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    profileURL: "/pfp.png",
    role: "Volunteer",
    activity: "Active",
  });

  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [targetMongoUserId, setTargetMongoUserId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // create file input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // for toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastStatus, setToastStatus] = useState<"success" | "error" | null>(null);

  const showToast = (message: string, status: "success" | "error") => {
    setToastMsg(message);
    setToastStatus(status);

    setTimeout(() => {
      setToastMsg(null);
      setToastStatus(null);
    }, 3000);
  };

  const [isClient, setIsClient] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setIsMobileDevice(isMobile);
  }, []);

  // Function to update Clerk organization role
  const updateClerkRole = async (clerkUserId: string, newRole: string) => {
    try {
      if (!user?.organizationMemberships?.[0]?.organization?.id) {
        throw new Error("No organization found");
      }

      const organizationId = user.organizationMemberships[0].organization.id;
      const clerkRole = newRole === "Admin" ? "org:admin" : "org:member";

      // Update the organization membership role
      const response = await fetch("/api/clerk/update-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: clerkUserId,
          organizationId: organizationId,
          role: clerkRole,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update Clerk role");
      }

      return true;
    } catch (error) {
      console.error("Error updating Clerk role:", error);
      throw error;
    }
  };

  const addUserToOrganization = async (clerkUserId: string, newRole: string) => {
    try {
      if (!user?.organizationMemberships?.[0]?.organization?.id) {
        throw new Error("No organization found");
      }

      const organizationId = user.organizationMemberships[0].organization.id;
      const clerkRole = newRole === "Admin" ? "org:admin" : "org:member";

      // Try to add user directly to organization
      const response = await fetch("/api/clerk/add-to-org", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: clerkUserId,
          organizationId: organizationId,
          role: clerkRole,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add user to organization");
      }

      return true;
    } catch (error) {
      console.error("Error adding user to organization:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchTargetUserData = async () => {
      if (!targetUserId) {
        showToast("No user ID provided in URL", "error");
        setLoading(false);
        return;
      }

      try {
        // Fetch user by MongoDB _id
        const res = await fetch(`/api/user/${targetUserId}`);

        if (!res.ok) {
          throw new Error("User not found");
        }

        const data = await res.json();

        // Fetch Clerk user ID by email
        const clerkUserId = await fetchClerkUserByEmail(data.email);
        console.log(clerkUserId);
        if (clerkUserId) {
          setTargetClerkUserId(clerkUserId);
        } else {
          console.warn("Could not find Clerk user for email:", data.email);
        }

        setTargetMongoUserId(data._id);
        setName(data.name || "");
        setEmail(data.email || "");
        setPhoneNumber(data.phoneNumber || "");
        setProfileURL(data.profileURL || "/pfp.png");
        setRole(data.role || "Volunteer");
        setActivity(data.active ? "Active" : "Inactive");

        // Store original data for comparison
        setOriginalUserData({
          name: data.name || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          profileURL: data.profileURL || "/pfp.png",
          role: data.role || "Volunteer",
          activity: !data.active ? "Inactive" : "Active",
        });
      } catch (error) {
        console.error("Failed to fetch target user data:", error);
        showToast("Failed to load user data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchTargetUserData();
  }, [targetUserId]);

  const uploadFile = async (file: any) => {
    if (!file) return;

    setUploading(true);

    try {
      // create a formData
      const form = new FormData();
      form.append("file", file);

      const response = await fetch("/api/profile/", {
        method: "POST",
        body: form,
      });

      if (response.ok) {
        showToast("Upload successful!", "success");

        // update profileURL
        const data = await response.json();
        setProfileURL(data.url);
      } else {
        showToast("Upload failed!", "error");
      }
    } finally {
      setUploading(false);
    }
  };

  const fetchClerkUserByEmail = async (email: String) => {
    try {
      const response = await fetch("/api/clerk/user-by-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("User not found");
      }

      const userData = await response.json();
      return userData.userId;
    } catch (error) {
      console.error("Error fetching Clerk user:", error);
      return null;
    }
  };

  const saveUserInfo = async () => {
    if (!targetMongoUserId) {
      showToast("No user ID found", "error");
      return;
    }

    try {
      const updatedFields: any = {};

      // Check for changes
      if (name !== originalUserData.name) updatedFields.name = name;
      if (email !== originalUserData.email) updatedFields.email = email;
      if (phoneNumber !== originalUserData.phoneNumber) updatedFields.phoneNumber = phoneNumber;
      if (profileURL !== originalUserData.profileURL) updatedFields.profileURL = profileURL;
      if (activity !== originalUserData.activity) updatedFields.active = activity === "Active" ? true : false;
      if (role !== originalUserData.role) updatedFields.role = role;

      if (Object.keys(updatedFields).length === 0) {
        showToast("No changes made.", "error");
        return;
      }

      // Handle Clerk organization membership
      if (role !== originalUserData.role) {
        console.log(targetClerkUserId);
        if (targetClerkUserId) {
          try {
            // Try to update existing membership
            await updateClerkRole(targetClerkUserId, role);
            console.log("Clerk role updated successfully");
          } catch (clerkError) {
            console.log("User not in organization, attempting to add them...");
            try {
              // Try to add user directly to organization
              await addUserToOrganization(targetClerkUserId, role);
              console.log("User added to organization successfully");
            } catch (addError) {
              console.log("Direct add failed, sending invitation...");
              // If direct add fails, send invitation
              showToast("Failure to add to organization", "success");
            }
          }
        } else {
          // No Clerk user found, send invitation
          console.log("No Clerk user found");
          showToast("No Clerk user found", "success");
        }
      }

      // Update MongoDB
      const res = await fetch(`/api/user/${targetMongoUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update user.");

      console.log("User updated:", data.user);
      showToast("User successfully updated.", "success");

      // Update original data state
      setOriginalUserData({
        name,
        email,
        phoneNumber,
        profileURL,
        role,
        activity,
      });

      // Optional: redirect back to user list or profile
      setTimeout(() => {
        router.push("/volunteers");
      }, 1500);
    } catch (error) {
      console.error("Error updating user:", error);
      showToast("Unable to update user.", "error");
    }
  };

  if (!isClient) {
    return null;
  }

  if (loading) {
    return (
      <div
        style={{
          backgroundColor: "#F4F1E8",
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spinner size="xl" color="#596334" />
        <Text ml={4}>Loading user data...</Text>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#F4F1E8", minHeight: "100vh", width: "100%", overflowY: "auto" }}>
      <Box maxH="100vh" px={{ base: 4, md: 8 }} py={{ base: 4, md: 6 }}>
        <Center>
          <Flex mt={{ base: 4, md: 25 }} direction="column" w="100%" maxW="900px">
            {/* Header with Toast */}
            <Flex
              align="center"
              justify="space-between"
              direction={{ base: "column", md: "row" }}
              gap={{ base: 4, md: 0 }}
              mb={{ base: 4, md: 0 }}
            >
              <Text
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="bold"
                textStyle="4xl"
                textAlign={{ base: "center", md: "left" }}
              >
                Edit User Profile
              </Text>
              {toastMsg && (
                <Box
                  borderRadius="lg"
                  px={4}
                  py={2}
                  bg="white"
                  color="black"
                  fontWeight="medium"
                  w={{ base: "100%", md: "auto" }}
                >
                  <Flex align="center" gap={4}>
                    {toastStatus === "success" ? (
                      // Success Icon
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#596334"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="red"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-circle-x-icon lucide-circle-x"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="m15 9-6 6" />
                        <path d="m9 9 6 6" />
                      </svg>
                    )}
                    <Flex direction={"column"}>
                      {toastStatus === "success" ? (
                        <Text size="med" fontWeight={"bold"}>
                          Saved
                        </Text>
                      ) : (
                        <Text size="med">Error</Text>
                      )}
                      <Text>{toastMsg}</Text>
                    </Flex>
                  </Flex>
                </Box>
              )}
            </Flex>

            {/* Main Content Box */}
            <Box
              borderRadius={"15px"}
              mt={{ base: 6, md: 30 }}
              alignItems="center"
              borderColor="black"
              bg="white"
              w="100%"
              minH={{ base: "auto", md: "475px" }}
              p={{ base: 4, md: 10 }}
              color="black"
            >
              {/* Mobile Layout */}
              {isMobileDevice ? (
                <VStack spacing={6} align="stretch">
                  {/* Profile Picture Section */}
                  <Center>
                    <Box position="relative" w="200px" h="200px">
                      {uploading ? (
                        <Center w="100%" h="100%">
                          <Spinner size="xl" color="#596334" />
                        </Center>
                      ) : (
                        <Image
                          boxSize="200px"
                          borderRadius="full"
                          fit="cover"
                          alt="Profile Picture Not Appearing"
                          src={profileURL}
                        />
                      )}
                      {/* Upload overlay */}
                      <Box
                        position="absolute"
                        top={0}
                        left={0}
                        w="100%"
                        h="100%"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="full"
                        boxSize="200px"
                        bg="blackAlpha.600"
                        opacity={0}
                        _hover={{ opacity: 1 }}
                        transition="opacity 0.3s ease"
                      >
                        <IconButton
                          w="100%"
                          h="100%"
                          aria-label="Upload"
                          icon={<FileDown size="60px" />}
                          onClick={() => fileInputRef.current?.click()}
                          colorScheme="whiteAlpha"
                          borderRadius="full"
                          fontSize="4xl"
                        />
                      </Box>
                      {/* Hidden file input */}
                      <Input
                        type="file"
                        accept="image/*"
                        display="none"
                        ref={fileInputRef}
                        onChange={(e) => uploadFile(e.target.files?.[0])}
                      />
                    </Box>
                  </Center>

                  {/* Form Section */}
                  <FormControl>
                    <VStack spacing={4} align="stretch">
                      <Box>
                        <Text {...TextUser} mb={2}>
                          Name
                        </Text>
                        <Input
                          {...InputUser}
                          placeholder="Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          type="text"
                        />
                      </Box>
                      <Box>
                        <Text {...TextUser} mb={2}>
                          Email
                        </Text>
                        <Input
                          {...InputUser}
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value.toLowerCase())}
                          type="email"
                        />
                      </Box>
                      <Box>
                        <Text {...TextUser} mb={2}>
                          Phone
                        </Text>
                        <Input
                          {...InputUser}
                          placeholder="Phone Number"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          type="text"
                        />
                      </Box>

                      <Box>
                        <Text {...TextUser} mb={2}>
                          Roles
                        </Text>
                        <RadioGroup value={role} onChange={setRole}>
                          <VStack spacing={3} align="flex-start">
                            <Radio value="Volunteer" size="lg">
                              Volunteer
                            </Radio>
                            <Radio value="Admin" size="lg">
                              Admin
                            </Radio>
                          </VStack>
                        </RadioGroup>
                      </Box>

                      <Box>
                        <Text {...TextUser} mb={2}>
                          Activity
                        </Text>
                        <RadioGroup value={activity} onChange={setActivity}>
                          <VStack spacing={3} align="flex-start">
                            <Radio value="Active" size="lg">
                              Active
                            </Radio>
                            <Radio value="Inactive" size="lg">
                              Inactive
                            </Radio>
                          </VStack>
                        </RadioGroup>
                      </Box>

                      {/* Buttons */}
                      <VStack spacing={3} pt={4}>
                        <Button onClick={saveUserInfo} borderRadius={20} backgroundColor="#596334" w="100%" size="lg">
                          <Text color="white">Save</Text>
                        </Button>
                        <Button
                          onClick={() => router.back()}
                          borderRadius={20}
                          backgroundColor="white"
                          borderColor="#596334"
                          borderWidth={1}
                          w="100%"
                          size="lg"
                        >
                          <Text color="#596334">Cancel</Text>
                        </Button>
                      </VStack>
                    </VStack>
                  </FormControl>
                </VStack>
              ) : (
                /* Desktop Layout */
                <Grid templateRows="repeat(2, 0.5fr)" templateColumns="repeat(5, 1fr)" gap={7}>
                  <GridItem rowSpan={2} colSpan={2}>
                    <Center>
                      <Box position="relative" w="300px" h="300px">
                        {/* profile pic */}
                        {uploading ? (
                          <Center w="100%" h="100%">
                            <Spinner size="xl" color="#596334" />
                          </Center>
                        ) : (
                          <Image
                            ml={10}
                            mt={10}
                            boxSize="300px"
                            borderRadius="full"
                            fit="cover"
                            alt="Profile Picture Not Appearing"
                            src={profileURL}
                          />
                        )}
                        {/* icon when hovered */}
                        <Box
                          position="absolute"
                          top={0}
                          left={0}
                          w="100%"
                          h="100%"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          borderRadius="full"
                          ml={10}
                          mt={10}
                          boxSize="300px"
                          bg="blackAlpha.600"
                          opacity={0}
                          _hover={{ opacity: 1 }}
                          transition="opacity 0.3s ease"
                        >
                          <IconButton
                            w="100%"
                            h="100%"
                            aria-label="Upload"
                            icon={<FileDown size="120px" />}
                            onClick={() => fileInputRef.current?.click()}
                            colorScheme="whiteAlpha"
                            borderRadius="full"
                            fontSize="6xl"
                          />
                        </Box>

                        {/* hidden */}
                        <Input
                          type="file"
                          accept="image/*"
                          display="none"
                          ref={fileInputRef}
                          onChange={(e) => uploadFile(e.target.files?.[0])}
                        />
                      </Box>
                    </Center>
                  </GridItem>
                  <GridItem colSpan={3} mt={10}>
                    <FormControl>
                      <Center {...CenterStyle}>
                        <Text {...TextUser} mt={4} mr={30}>
                          Name
                        </Text>
                        <Input
                          {...InputUser}
                          mt={4}
                          placeholder="Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          type="text"
                        />
                      </Center>
                      <Center {...CenterStyle}>
                        <Text {...TextUser} mr={34} mt={10}>
                          Email
                        </Text>
                        <Input
                          {...InputUser}
                          mt={10}
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value.toLowerCase())}
                          type="email"
                        />
                      </Center>
                      <Center>
                        <Text mr={30} {...TextUser} mt={10}>
                          Phone
                        </Text>
                        <Input
                          {...InputUser}
                          mt={10}
                          placeholder="Phone Number"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          type="text"
                        />
                      </Center>
                      <Center {...CenterStyle}>
                        <Text mr={30} {...TextUser} mt={10}>
                          Roles
                        </Text>
                        <RadioGroup value={role} onChange={setRole}>
                          <VStack spacing={3} align="flex-start" mt={10} width="300px">
                            <Radio value="Volunteer" size="lg">
                              Volunteer
                            </Radio>
                            <Radio value="Admin" size="lg">
                              Admin
                            </Radio>
                          </VStack>
                        </RadioGroup>
                      </Center>
                      <Center {...CenterStyle}>
                        <Text mr={30} {...TextUser} mt={10}>
                          Activity
                        </Text>
                        <RadioGroup value={activity} onChange={setActivity}>
                          <VStack spacing={3} align="flex-start" width="300px" mt={10}>
                            <Radio value="Active" size="lg">
                              Active
                            </Radio>
                            <Radio value="Inactive" size="lg">
                              Inactive
                            </Radio>
                          </VStack>
                        </RadioGroup>
                      </Center>

                      <Center {...CenterStyle}>
                        <Box>
                          <Button onClick={saveUserInfo} mt={10} borderRadius={20} backgroundColor="#596334">
                            <Text color="white">Save</Text>
                          </Button>
                        </Box>
                        <Box onClick={() => router.back()}>
                          <Button
                            mt={10}
                            ml={5}
                            borderRadius={20}
                            backgroundColor="white"
                            borderColor="#596334"
                            borderWidth={1}
                          >
                            <Text color="#596334">Cancel</Text>
                          </Button>
                        </Box>
                      </Center>
                    </FormControl>
                  </GridItem>
                </Grid>
              )}
            </Box>
          </Flex>
        </Center>
      </Box>
    </div>
  );
}
