"use client";

import {
  Table,
  Thead,
  Tbody,
  HStack,
  Tr,
  Th,
  Td,
  Text,
  TableContainer,
  InputGroup,
  InputRightElement,
  Input,
  Box,
  Button,
  Image,
  Spinner,
  VStack,
  IconButton,
  Flex,
  Grid,
  Tag,
  Select,
} from "@chakra-ui/react";
import * as XLSX from "xlsx";
import { CenterStyle } from "@/styles/AllStyle";
import "./treetable.css";
import { useState, useEffect } from "react";
import { ITree } from "@/database/treeSchema";
import { FileDown, Menu, SearchIcon, ChevronLeft, ChevronRight, TreePine, Edit } from "lucide-react";
import { BrowserView, MobileView, isMobile } from "react-device-detect";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function TreeTable() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTrees, setFilteredTrees] = useState<ITree[]>([]);
  const [trees, setTrees] = useState<ITree[]>([]);
  const { user } = useUser();

  // tree table structure
  const treesPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredTrees.length / treesPerPage);

  const idxLastTree = currentPage * treesPerPage;
  const idxFirstTree = idxLastTree - treesPerPage;
  const paginatedTrees = filteredTrees.slice(idxFirstTree, idxLastTree);

  // fetch trees
  const [isClient, setIsClient] = useState(false);

  const getRedOrangeColor = (value: string | number): string => {
    const num = typeof value === "string" ? Number(value) : value;
    if (isNaN(num)) return "#B6E1EF"; // fallback
    const clamped = Math.max(0, Math.min(10, num));
    const hue = 0 + (clamped / 10) * 40; // 0° (red) to 40° (orange)
    return `hsl(${hue}, 85%, 50%)`;
  };

  useEffect(() => {
    if (!user) return; // Exit early if no user

    console.log("User available:", user);

    const fetchData = async () => {
      try {
        // Fetch user data
        const userRes = await fetch(`/api/user?email=${user.primaryEmailAddress?.emailAddress}`);
        if (!userRes.ok) throw new Error(`User fetch failed: ${userRes.status}`);
        const userData = await userRes.json();

        // Fetch trees based on role
        let apiString: string;

        if (userData?.role === "Volunteer") {
          apiString = `/api/tree?collectorName=${user.fullName}`;
        } else if (userData?.role === "Admin") {
          apiString = "/api/tree";
        } else {
          throw new Error("Role not found");
        }

        const treesRes = await fetch(apiString);
        if (!treesRes.ok) throw new Error(`Trees fetch failed: ${treesRes.status}`);
        const treesData = await treesRes.json();

        if (Array.isArray(treesData)) {
          setTrees(treesData);
          setFilteredTrees(treesData);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setTrees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Search Filter
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent) => {
    if (!searchTerm.trim()) {
      setFilteredTrees(trees);
      setCurrentPage(1);
      return;
    }

    const results = trees.filter((tree: ITree) => {
      const searchValue = searchTerm.toLowerCase();
      return (
        tree._id?.toLowerCase().includes(searchValue) ||
        tree.collectorName?.toLowerCase().includes(searchValue) ||
        new Date(tree.dateCollected)?.toLocaleDateString().includes(searchValue) ||
        tree.dbh?.toString().includes(searchValue) ||
        tree.canopyBreadth?.toString().includes(searchValue) ||
        tree.treeHeight?.toString().includes(searchValue) ||
        tree.species?.toLowerCase().includes(searchValue) ||
        tree.additionalNotes?.toLowerCase().includes(searchValue) ||
        (Array.isArray(tree.treeCondition)
          ? tree.treeCondition.join(", ").toLowerCase().includes(searchValue)
          : false) ||
        tree.treeQuality?.toString().toLowerCase().includes(searchValue) ||
        (Array.isArray(tree.gpsCoordinates) ? tree.gpsCoordinates.join(", ").includes(searchValue) : false)
      );
    });
    console.log("Tree Filtering:", results);
    setFilteredTrees(results);
    setCurrentPage(1);
  };
  useEffect(() => {
    setIsClient(true);
  }, []);

  const downloadData = () => {
    // retreive ALL volunteers data
    const dataSheet = XLSX.utils.json_to_sheet(
      trees.map((tree: ITree, index) => ({
        Index: index,
        "Tree Id": tree._id,
        "Collector Name": tree.collectorName,
        "Date Collected": new Date(tree.dateCollected).toLocaleDateString(),
        "GPS Coordinates": Array.isArray(tree.gpsCoordinates) ? tree.gpsCoordinates.join(", ") : tree.gpsCoordinates,
        "DBH (inches)": tree.dbh.toString(),
        "Tree Canopy Breadth": tree.canopyBreadth.toString(),
        "Tree Height": tree.treeHeight.toString(),
        Species: tree.species,
        "Tree Quality": tree.treeQuality.toString(),
        "Tree Condition": Array.isArray(tree.treeCondition) ? tree.treeCondition.join(", ") : tree.treeCondition,
        "Additional Notes": tree.additionalNotes || "N/A",
      })),
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, dataSheet, "Trees Table");
    XLSX.writeFile(wb, "treesTable.xlsx");
  };

  const [selectedTree, setSelectedTree] = useState<ITree | null>(null);

  const handleArrowClick = (treeData: ITree) => {
    setSelectedTree(treeData);
    console.log(treeData);
  };

  const [sortOrder, setSortOrder] = useState<"" | "asc" | "desc">("");

  useEffect(() => {
    let filtered = [...trees];

    // Search
    if (searchTerm.trim()) {
      const searchValue = searchTerm.toLowerCase();
      filtered = filtered.filter((tree: ITree) => {
        return (
          tree._id?.toLowerCase().includes(searchValue) ||
          tree.collectorName?.toLowerCase().includes(searchValue) ||
          new Date(tree.dateCollected)?.toLocaleDateString().includes(searchValue) ||
          tree.dbh?.toString().includes(searchValue) ||
          tree.canopyBreadth?.toString().includes(searchValue) ||
          tree.treeHeight?.toString().includes(searchValue) ||
          tree.species?.toLowerCase().includes(searchValue) ||
          tree.additionalNotes?.toLowerCase().includes(searchValue) ||
          (Array.isArray(tree.treeCondition)
            ? tree.treeCondition.join(", ").toLowerCase().includes(searchValue)
            : false) ||
          tree.treeQuality?.toString().toLowerCase().includes(searchValue) ||
          (Array.isArray(tree.gpsCoordinates) ? tree.gpsCoordinates.join(", ").includes(searchValue) : false)
        );
      });
    }

    // Sort
    if (sortOrder) {
      filtered = filtered
        .filter((tree: ITree) => {
          const first = tree.treeQuality.toString();
          return first !== undefined && !isNaN(Number(first));
        })
        .sort((a, b) => {
          const aVal = Number(a.treeQuality.toString());
          const bVal = Number(b.treeQuality.toString());
          return sortOrder === "asc" ? bVal - aVal : aVal - bVal;
        });
    }

    setFilteredTrees(filtered);
    setCurrentPage(1);
  }, [sortOrder, searchTerm, trees]);

  return (
    <div>
      {isClient ? (
        <div>
          <BrowserView>
            <Box width="100%" height="100%" p={{ base: "20px", md: "50px" }} display="flex" justifyContent="center">
              <Box w="90%" maxWidth="1137px">
                {/*PageText*/}
                <Box width="100%" position="relative" minHeight="80px">
                  <VStack alignItems="flex-start" spacing={1} position="relative">
                    <HStack>
                      <Text fontSize={["24px", "30px", "38px"]} color="#333" fontWeight="600">
                        Tree Inventory
                      </Text>
                      {/* Export */}
                      <HStack spacing={2} width={["100%", "auto"]} justifyContent={["flex-end", "flex-end"]}>
                        <Button
                          padding={4}
                          position="absolute"
                          bg="white"
                          borderRadius="24px"
                          variant="solid"
                          right={0}
                          onClick={downloadData}
                        >
                          <HStack spacing={2}>
                            <Text color="#596334" fontWeight="600">
                              Export to Sheets
                            </Text>
                            <FileDown color="#596334" />
                          </HStack>
                        </Button>
                      </HStack>
                    </HStack>
                    <Text fontSize="16px" color="#333" fontWeight="400">
                      {filteredTrees.length} trees found
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
                  mb={4}
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

                  <Select
                    width={["100%", "225px"]}
                    borderRadius="24px"
                    placeholder="Sort"
                    onChange={(e) => setSortOrder(e.target.value as "" | "asc" | "desc")}
                    bg="white"
                  >
                    {/* <option value="">None</option> */}
                    <option value="asc">Condition best to worst</option>
                    <option value="desc">Condition worst to best</option>
                  </Select>
                </HStack>

                {/* Main content area with table and detail panel */}
                <Flex width="100%" gap={4} height="auto">
                  {/* Table Container - takes up less width when tree is selected */}
                  <Box
                    width={selectedTree ? "70%" : "100%"}
                    // height={selectedTree ? "50vh" : "100%"}
                    borderRadius="16px"
                    bg="white"
                    overflowX="auto"
                    transition="width 0.3s ease-in-out"
                    height={selectedTree ? "auto" : "100%"}
                    alignSelf="start"
                  >
                    {loading ? (
                      <Box {...CenterStyle} height="100%">
                        <Spinner size="xl" thickness="4px" speed="0.65s" color="#596334" />
                      </Box>
                    ) : (
                      <>
                        <TableContainer bg="white" borderRadius="10px">
                          <Table className="tree-table">
                            <Thead>
                              <Tr>
                                <Th>#</Th>
                                <Th>Species</Th>
                                <Th>Date</Th>
                                <Th>User</Th>
                                <Th>Condition</Th>
                                <Th> </Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {paginatedTrees.length > 0 ? (
                                paginatedTrees.map((tree: ITree, index) => (
                                  <Tr key={tree._id}>
                                    <Td>{index + 1}</Td>
                                    <Td>
                                      <Button
                                        style={{
                                          backgroundColor: tree.species?.startsWith("C")
                                            ? "#78C1DE" // blue for VO
                                            : tree.species?.startsWith("V")
                                              ? "#CFEFF9" // different blue for WO
                                              : tree.species?.startsWith("B")
                                                ? "#426B87" // different blue for WO
                                                : "#579FD4", // default grey for other species
                                          color: tree.species?.startsWith("C")
                                            ? "#333333" // blue for VO
                                            : tree.species?.startsWith("V")
                                              ? "#426B87" // different blue for WO
                                              : tree.species?.startsWith("B")
                                                ? "white" // different blue for WO
                                                : "white", // default grey for other species
                                        }}
                                        fontSize="sm"
                                        fontWeight="normal"
                                      >
                                        {tree.species
                                          ?.split(" ")
                                          .filter((word) => word.length > 0)
                                          .map((word, idx, arr) => (idx === 0 || idx === arr.length - 1 ? word[0] : ""))
                                          .join("")
                                          .toUpperCase()}
                                      </Button>
                                    </Td>
                                    <Td>{new Date(tree.dateCollected).toLocaleDateString()}</Td>
                                    <Td>
                                      <HStack align="center">
                                        <Box borderRadius="full" bg="#596334" boxSize={8}></Box>
                                        <Text>{tree.collectorName}</Text>
                                      </HStack>
                                    </Td>

                                    <Td>
                                      <Tag
                                        size="md"
                                        // bg="#B6E1EF"
                                        color="gray.700"
                                        borderRadius={5}
                                        px={2}
                                        py={1}
                                        bg={getRedOrangeColor(tree.treeQuality.toString())}
                                      >
                                        {tree.treeQuality.toString()}
                                      </Tag>
                                    </Td>
                                    <Td>
                                      <Button bg="" _hover={{ bg: "gray.100" }} onClick={() => handleArrowClick(tree)}>
                                        <ChevronRight />
                                      </Button>
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
                        </TableContainer>

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
                              let pageNumber = 0;
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
                      </>
                    )}
                  </Box>

                  {/* Right side panel showing selected tree details */}
                  {selectedTree && (
                    <Box
                      width="30%"
                      bg="white"
                      borderRadius={20}
                      display={selectedTree ? "block" : "none"}
                      transition="all 0.3s ease-in-out"
                      overflowX={"auto"}
                      height="100%"
                    >
                      <Box bg="#596334" color="white" p={5} borderTopLeftRadius={20} borderTopRightRadius={20}>
                        <VStack gap={3} align="stretch">
                          {/* Top row */}
                          <Flex justifyContent="flex-end">
                            {/* Notes icon on the right */}
                            <Link href={`/editTreeForm/${selectedTree._id}`}>
                              <Edit size={20} cursor="pointer" />
                            </Link>
                          </Flex>
                          <Flex justifyContent="space-between" alignItems="center">
                            <Flex alignItems="center" gap={3}>
                              <TreePine size={25} color="white" />
                              <Text fontWeight="medium" maxW="200px" whiteSpace="normal" wordBreak="break-word">
                                Tree #{selectedTree._id}
                              </Text>
                            </Flex>

                            <Tag
                              size="md"
                              bg="#B6E1EF"
                              color="gray.700"
                              borderRadius={5}
                              px={2}
                              py={1}
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              minWidth="36px"
                              flexShrink={0}
                              ml={2}
                              // alignItems="center"
                              style={{
                                backgroundColor: selectedTree.species?.startsWith("C")
                                  ? "#78C1DE" // blue for VO
                                  : selectedTree.species?.startsWith("V")
                                    ? "#CFEFF9" // different blue for WO
                                    : selectedTree.species?.startsWith("B")
                                      ? "#426B87" // different blue for WO
                                      : "#579FD4", // default grey for other species
                                color: selectedTree.species?.startsWith("C")
                                  ? "#333333" // blue for VO
                                  : selectedTree.species?.startsWith("V")
                                    ? "#426B87" // different blue for WO
                                    : selectedTree.species?.startsWith("B")
                                      ? "white" // different blue for WO
                                      : "white", // default grey for other species
                              }}
                            >
                              {selectedTree.species
                                ?.split(" ")
                                .filter((word) => word.length > 0)
                                .map((word, idx, arr) => (idx === 0 || idx === arr.length - 1 ? word[0] : ""))
                                .join("")
                                .toUpperCase()}
                            </Tag>
                          </Flex>

                          {/* Bottom row */}
                          <Flex justifyContent="space-between" alignItems="center">
                            <Text color={"#C8D96F"}>
                              {Array.isArray(selectedTree.gpsCoordinates)
                                ? selectedTree.gpsCoordinates.join(", ")
                                : selectedTree.gpsCoordinates}
                            </Text>
                          </Flex>
                        </VStack>
                      </Box>

                      <Box p={4}>
                        <VStack spacing={4} align="stretch">
                          {/* User and Date */}
                          <Flex justifyContent="space-between" align={"center"}>
                            <Box bgColor="#F4F1E8" alignItems="center" borderRadius={"full"} p={2}>
                              <HStack align="center">
                                {/* user */}
                                <Box borderRadius="full" bg="#596334" boxSize={5}></Box>
                                <Text maxW="180px" whiteSpace="normal" wordBreak="break-word">
                                  {selectedTree.collectorName}
                                </Text>
                              </HStack>
                            </Box>
                            <Box textAlign="right">
                              <Text>{new Date(selectedTree.dateCollected).toLocaleDateString() || "02/21/2024"}</Text>
                            </Box>
                          </Flex>

                          <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                            <Box
                              bg="#F4F1E8"
                              height="100px"
                              borderRadius="lg"
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              borderLeft="13px solid #596334"
                              borderRight="13px solid transparent"
                            >
                              <VStack spacing={1} justify="center" align="center" h="100%" overflow="hidden">
                                <Text>Condition</Text>
                                <Tag size="med" bg="#596334" color="white" borderRadius="md" px={2} py={1}>
                                  {selectedTree.treeQuality.toString()}
                                </Tag>
                                <Text>
                                  {parseInt(selectedTree.treeQuality.toString()) >= 7 ? "Healthy" : "Unhealty"}
                                </Text>
                              </VStack>
                            </Box>
                            <Box bg="transparent" height="100px" borderRadius="md" p={2}>
                              <VStack align="stretch" h="100%">
                                <Flex gap={"4px"}>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    color="#596334"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    className="lucide lucide-notebook-pen-icon lucide-notebook-pen"
                                  >
                                    <path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4" />
                                    <path d="M2 6h4" />
                                    <path d="M2 10h4" />
                                    <path d="M2 14h4" />
                                    <path d="M2 18h4" />
                                    <path d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
                                  </svg>
                                  <Text color="#596334" fontWeight="lg">
                                    Notes
                                  </Text>
                                </Flex>
                                <Text fontSize="sm" flex="1" overflowY="auto" overflowX="hidden" wordBreak="break-word">
                                  {selectedTree.additionalNotes || "N/A"}
                                </Text>
                              </VStack>
                            </Box>
                          </Grid>

                          {/* Tree conditions as tags */}
                          <Box>
                            <Flex flexWrap="wrap" gap={2}>
                              {selectedTree.treeCondition
                                .filter((cond) => isNaN(Number(cond))) // keep only non-number strings
                                .map((condition, idx) => (
                                  <Tag
                                    key={idx}
                                    size="sm"
                                    bg="#DFED98"
                                    borderRadius="lg"
                                    p={1.5}
                                    fontWeight="light"
                                    fontSize="sm"
                                  >
                                    {condition}
                                  </Tag>
                                ))}
                            </Flex>
                          </Box>

                          {/* Tree measurements */}
                          <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                            <Box>
                              <Text fontSize="med" color="#596334">
                                Trunk
                              </Text>
                              <Text fontSize="med" color="#596334">
                                DBH
                              </Text>
                              <Text fontWeight="bold">{selectedTree.dbh?.toString()}&quot;</Text>
                            </Box>
                            <Box>
                              <Text fontSize="med" color="#596334">
                                Tree
                              </Text>
                              <Text fontSize="med" color="#596334">
                                Height
                              </Text>
                              <Text fontWeight="bold">{selectedTree.treeHeight?.toString()}&apos;</Text>
                            </Box>
                            <Box>
                              <Text fontSize="med" color="#596334">
                                Canopy
                              </Text>
                              <Text fontSize="med" color="#596334">
                                Spread
                              </Text>
                              <Text fontWeight="bold">{selectedTree.canopyBreadth?.toString()}&apos;</Text>
                            </Box>
                          </Grid>

                          {/* Photos */}
                          <Box>
                            <Text fontSize="med" color="#596334" mb={2}>
                              Photo
                            </Text>
                            <Image src={selectedTree.photo} borderRadius="10px" alt="tree"></Image>
                          </Box>
                        </VStack>
                      </Box>
                    </Box>
                  )}
                </Flex>
              </Box>
            </Box>
          </BrowserView>

          <MobileView>
            <Box mt={"58px"}>
              <VStack spacing={"32px"}>
                {/*Dummy Mobile Navbar*/}
                <HStack
                  width="100%"
                  position={"relative"}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <IconButton position={"absolute"} left="25px" aria-label="Navbar" key={"ghost"} variant={"ghost"}>
                    <Menu width="48px" color="#596334" />
                  </IconButton>
                  <Box
                    width="48px"
                    height="48px"
                    border={"solid"}
                    borderWidth={"1px"}
                    borderRadius="100%"
                    display="flex"
                    justifyContent={"center"}
                    borderColor={"#596334"}
                    padding={"3px"}
                  >
                    <Image src="~/../logo1.png" alt="logo" htmlWidth="36px" htmlHeight="36px" />
                  </Box>
                </HStack>
                {/*Switch to desktop*/}
                <Box h="80vh" width="90%" bg="#FFFFFF" borderRadius={"25px"}>
                  <VStack mt="5rem" gap={"2"}>
                    <Image src="~/../SwitchDevice.svg" alt="SwitchDevice" boxSize={""} />
                    <Text color="black" fontSize="20px" fontWeight={"600"}>
                      Please use a laptop or desktop!
                    </Text>
                    <Text color="black" fontSize="14px">
                      This page is optimized for larger screens.
                    </Text>
                  </VStack>
                </Box>
              </VStack>
            </Box>
          </MobileView>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
