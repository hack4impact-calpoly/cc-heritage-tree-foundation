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
  Spinner,
} from "@chakra-ui/react";

import { IUser } from "@/database/userSchema";
import { SquarePen, SearchIcon, FileDown, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useEffect } from "react";
import { relative } from "path";

function Volunteers() {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [usersData, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const rowsPerPage = 7;

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const idxLastUser = currentPage * rowsPerPage;
  const idxFirstUser = idxLastUser - rowsPerPage;
  const paginatedUsers = filteredUsers.slice(idxFirstUser, idxLastUser);
  //Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/user");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  //Search Filter
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent) => {
    if (!searchTerm.trim()) {
      setFilteredUsers(usersData);
      setCurrentPage(1);
      return;
    }

    const results = usersData.filter((user: IUser) => {
      const searchValue = searchTerm.toLowerCase();
      return (
        user.name?.toLowerCase().includes(searchValue) ||
        user.email?.toLowerCase().includes(searchValue) ||
        user.role?.toLowerCase().includes(searchValue) ||
        user.phoneNumber?.toLowerCase().includes(searchValue)
      );
    });

    setFilteredUsers(results);
    setCurrentPage(1);
  };

  return (
    <Box height="100%" width="100%" display="flex" justifyContent="center" alignItems="center">
      <VStack maxWidth="1137px" width="90%" spacing={5} className="volunteer-container">
        {/*PageText*/}
        <Box width="100%" position="relative" minHeight="80px">
          <VStack alignItems="flex-start" spacing={1} position="relative">
            <Text fontSize={["24px", "30px", "38px"]} color="#333" fontWeight="600">
              Volunteer Database
            </Text>
            <Text fontSize="16px" color="#333" fontWeight="400">
              {filteredUsers.length} volunteers found
            </Text>
          </VStack>
        </Box>
        {/*Search/Export*/}
        <HStack
          width="100%"
          position="relative"
          minHeight="50px"
          flexWrap={["wrap", "nowrap"]}
          spacing={[2, 4]}
          justifyContent="space-between"
        >
          <InputGroup width={["100%", "225px"]} mb={[2, 0]}>
            <Input
              placeholder="Search"
              bg="white"
              border="none"
              borderRadius="24px"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
            />
            <InputRightElement width="3rem" cursor="pointer" onClick={handleSearch}>
              <SearchIcon size={18} color="gray" />
            </InputRightElement>
          </InputGroup>

          <HStack spacing={2} width={["100%", "auto"]} justifyContent={["flex-end", "flex-end"]}>
            <Button padding={4} position="absolute" bg="white" borderRadius="24px" variant="solid" right={0}>
              <HStack spacing={2}>
                <Text color="#596334" fontWeight="600">
                  Export to Sheets
                </Text>
                <FileDown color="#596334" />
              </HStack>
            </Button>
          </HStack>
        </HStack>
        {/*Table*/}
        <Box minHeight="510px" width="100%" height={"100%"}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <Spinner size="xl" thickness="4px" speed="0.65s" color="#596334" />
            </Box>
          ) : (
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
                    <HStack height="100%">
                      <ChevronLeft />
                      <Text>Previous</Text>
                    </HStack>
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
                        color="#333333"
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
                    <HStack height="100%">
                      <Text>Next</Text>
                      <ChevronRight />
                    </HStack>
                  </Button>
                </HStack>
              )}
            </Box>
          )}
        </Box>
      </VStack>
    </Box>
  );
}

export default Volunteers;
