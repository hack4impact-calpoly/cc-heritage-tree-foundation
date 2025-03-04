"use client";
import {
  Box,
  VStack,
  InputGroup,
  Input,
  InputRightElement,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  HStack,
  Select,
  Button,
  Text,
} from "@chakra-ui/react";

import { IUser } from "@/database/userSchema";
import { SquarePen, SearchIcon, FileDown } from "lucide-react";
import React, { useState, useEffect } from "react";
import { relative } from "path";

function Volunteers() {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [usersData, setUsers] = useState([]);
  const rowsPerPage = 7;

  const totalPages = Math.ceil(usersData.length / rowsPerPage);
  const idxLastUser = currentPage * rowsPerPage;
  const idxFirstUser = idxLastUser - rowsPerPage;
  const paginatedUsers = usersData.slice(idxFirstUser, idxLastUser);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/user");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Box height="100%" width="100%" display="flex" justifyContent="center" alignItems="center">
      <VStack maxWidth="1137px" width="90%" spacing={5} className="volunteer-container">
        {/*PageText/Export*/}
        <Box width="100%" position="relative" minHeight="80px">
          <VStack alignItems="flex-start" spacing={1} position="relative">
            <Text fontSize={["24px", "30px", "38px"]} color="#333" fontWeight="600">
              Volunteer Database
            </Text>
            <Text fontSize="16px" color="#333" fontWeight="400">
              {usersData.length} volunteers found
            </Text>
            <Button position="absolute" bg="white" borderRadius="24px" variant="solid" bottom={0} right={0}>
              <HStack spacing={2}>
                <Text color="#596334" fontWeight="600">
                  Export to CSV
                </Text>
                <FileDown color="#596334" />
              </HStack>
            </Button>
          </VStack>
        </Box>
        {/*Search/Filter*/}
        <HStack
          width="100%"
          position="relative"
          minHeight="50px"
          flexWrap={["wrap", "nowrap"]}
          spacing={[2, 4]}
          justifyContent="space-between"
        >
          <InputGroup width={["100%", "225px"]} mb={[2, 0]}>
            <Input placeholder="Search" bg="white" border="none" borderRadius="24px" />
            <InputRightElement width="3rem">
              <SearchIcon size={18} color="gray" />
            </InputRightElement>
          </InputGroup>

          <HStack spacing={2} width={["100%", "auto"]} justifyContent={["flex-end", "flex-end"]}>
            <Select
              aria-label="Sortbyrole"
              placeholder="Sort by"
              width={["40%", "126px"]}
              bg="white"
              border="none"
              borderRadius="24px"
            >
              <option value="Admin">Admin</option>
              <option value="Volunteer">Volunteer</option>
            </Select>
            <Select
              aria-label="Filterbystatus"
              placeholder="Filter by"
              width={["40%", "126px"]}
              bg="white"
              border="none"
              borderRadius="24px"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Select>
          </HStack>
        </HStack>
        {/*Table*/}
        <Box minHeight="510px" width="100%">
          <Box
            width="100%"
            borderRadius="16px"
            bg="#FAF9F6"
            overflowX="auto"
            sx={{
              "& table": {
                tableLayout: "auto",
                width: "100%",
              },
              "& Thead, & td": {
                minWidth: "50px",
                wordBreak: "break-word",
                whiteSpace: "normal",
                padding: "8px",
              },
            }}
          >
            <Table variant="simple" width="100%" size={["sm", "md"]}>
              <Thead bg="#DFED98" minWidth="100px" wordBreak="break-word" whiteSpace="normal" padding="8px">
                <Tr>
                  <Th>#</Th>
                  <Th>User</Th>
                  <Th>Role</Th>
                  <Th>Email</Th>
                  <Th>Phone Number</Th>
                  <Th>Activity</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user: IUser) => (
                    <Tr key={user._id}>
                      <Td>
                        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                          {user._id}
                        </Box>
                      </Td>
                      <Td>{user.name}</Td>
                      <Td>
                        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                          {user.role}
                        </Box>
                      </Td>
                      <Td>{user.email}</Td>
                      <Td>
                        {user.phoneNumber?.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3") || "N/A"}
                      </Td>
                      <Td>
                        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                          <Box
                            width="8px"
                            height="8px"
                            borderRadius="full"
                            bg={"Active" === "Active" ? "#596334" : "gray.400"}
                          />
                        </Box>
                      </Td>
                      <Td position="relative">
                        <IconButton
                          aria-label="EditUser"
                          variant="ghost"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <SquarePen color="#333333" />
                        </IconButton>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={7} textAlign="center" fontSize="sm" color="gray.500">
                      No results
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
            {/*Table Pages*/}
            {totalPages > 1 && (
              <HStack spacing={2} justifyContent="center" my={2} py={2} flexWrap="wrap" bottom={0}>
                <Button
                  bg=""
                  _hover={{ bg: "gray.100" }}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                  Previous
                </Button>

                {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage === 1) {
                    pageNumber = i + 1;
                  } else if (currentPage === totalPages) {
                    pageNumber = totalPages - 2 + i;
                  } else {
                    pageNumber = currentPage - 1 + i;
                  }
                  return (
                    <Button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      bg={pageNumber === currentPage ? "#DFED98" : ""}
                      color="black"
                      _hover={{ bg: pageNumber === currentPage ? "#DFED98" : "gray.100" }}
                      borderRadius="23px"
                      mx={1}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}

                <Button
                  bg=""
                  _hover={{ bg: "gray.100" }}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                >
                  Next
                </Button>
              </HStack>
            )}
          </Box>
        </Box>
      </VStack>
    </Box>
  );
}

export default Volunteers;
