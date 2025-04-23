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
} from "@chakra-ui/react";
import * as XLSX from "xlsx";
import Navbar from "@/components/Navbar";
import { CenterStyle } from "@/styles/AllStyle";
import "./treetable.css";
import { useState, useEffect } from "react";
import { ITree } from "@/database/treeSchema";
import { FileDown, Menu, SearchIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { BrowserView, MobileView, isMobile } from "react-device-detect";

export default function TreeTable() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTrees, setFilteredTrees] = useState<ITree[]>([]);
  const [trees, setTrees] = useState<ITree[]>([]);

  // tree table structure
  const treesPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredTrees.length / treesPerPage);

  const idxLastTree = currentPage * treesPerPage;
  const idxFirstTree = idxLastTree - treesPerPage;
  const paginatedTrees = filteredTrees.slice(idxFirstTree, idxLastTree);

  // fetch trees
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    fetch("/api/tree")
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log("datata");
        console.log(data);
        if (Array.isArray(data)) {
          setTrees(data);
          setFilteredTrees(data); // set filteredTrees to data
        } else {
          console.error("Unexpected data format:", data);
          setTrees([]);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setTrees([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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
        Species: tree.species,
        "Tree Quality": String(tree.treeQuality),
        "Tree Condition": Array.isArray(tree.treeCondition) ? tree.treeCondition.join(", ") : tree.treeCondition,
        "Additional Notes": tree.additionalNotes || "N/A",
      })),
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, dataSheet, "Trees Table");
    XLSX.writeFile(wb, "treesTable.xlsx");
  };
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
                    <Text fontSize={["24px", "30px", "38px"]} color="#333" fontWeight="600">
                      Tree Inventory
                    </Text>
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
                {/*Table*/}
                {loading ? (
                  <Box {...CenterStyle} height="100%">
                    <Spinner size="xl" thickness="4px" speed="0.65s" color="#596334" />
                  </Box>
                ) : (
                  <Box width="100%" borderRadius="16px" bg="white" overflowX="auto">
                    <TableContainer bg="white" borderRadius="10px">
                      <Table className="tree-table">
                        <Thead>
                          <Tr>
                            <Th>Tree ID</Th>
                            <Th>Collector Name</Th>
                            <Th>Date Collected</Th>
                            <Th>GPS Coordinates</Th>
                            <Th>Photo</Th>
                            <Th>DBH (inches)</Th>
                            <Th>Tree Canopy Breadth</Th>
                            <Th>Species</Th>
                            <Th>Tree Quality</Th>
                            <Th>Tree Condition</Th>
                            <Th>Additional Notes</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {paginatedTrees.length > 0 ? (
                            paginatedTrees.map((tree: ITree, index) => (
                              <Tr key={tree._id}>
                                <Td>{tree._id}</Td>
                                <Td>{tree.collectorName}</Td>
                                <Td>{new Date(tree.dateCollected).toLocaleDateString()}</Td>
                                <Td>
                                  {Array.isArray(tree.gpsCoordinates)
                                    ? tree.gpsCoordinates.join(", ")
                                    : tree.gpsCoordinates}
                                </Td>
                                <Td>{tree.photo && <Image src={tree.photo} alt="Tree" width="50" height="50" />}</Td>
                                <Td>{tree.dbh.toString()}</Td>
                                <Td>{tree.canopyBreadth.toString()}</Td>
                                <Td>
                                  <Button className="species-button">{tree.species}</Button>
                                </Td>
                                <Td>
                                  <Button className="condition-button">{String(tree.treeQuality)}</Button>
                                </Td>
                                <Td>
                                  {Array.isArray(tree.treeCondition)
                                    ? tree.treeCondition.join(", ")
                                    : tree.treeCondition}
                                </Td>
                                <Td>{tree.additionalNotes || "N/A"}</Td>
                                <Td className="clickable-arrow">&gt;</Td>
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
                  </Box>
                )}
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
