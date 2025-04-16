"use client";
import {
  Table,
  VStack,
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
} from "@chakra-ui/react";
import * as XLSX from "xlsx";
import Navbar from "@/components/Navbar";
import { CenterStyle } from "@/styles/AllStyle";
import "./treetable.css";
import { useState, useEffect } from "react";
import { ITree } from "@/database/treeSchema";
import { FileDown, SearchIcon } from "lucide-react";
import { IUser } from "@/database/userSchema";

export default function TreeTable() {
  const [loading, setLoading] = useState(true);
  const [usersData, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [trees, setTrees] = useState<ITree[]>([]);
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
        } else {
          console.error("Unexpected data format:", data);
          setTrees([]);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setTrees([]);
      });
  }, []);

  // tree table structure
  const treesPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(trees.length / treesPerPage);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

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
    <Box width="100%" height="100%" p={{ base: "20px", md: "50px" }} display="flex" justifyContent="center">
      <Box w="90%" maxWidth="1137px">
        {/*PageText*/}
        <Box width="100%" position="relative" minHeight="80px">
          <VStack alignItems="flex-start" spacing={1} position="relative">
            <Text fontSize={["24px", "30px", "38px"]} color="#333" fontWeight="600">
              Tree Inventory
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
                {trees.slice((currentPage - 1) * treesPerPage, currentPage * treesPerPage).map((tree, index) => (
                  <Tr key={tree._id}>
                    <Td>{tree._id}</Td>
                    <Td>{tree.collectorName}</Td>
                    <Td>{new Date(tree.dateCollected).toLocaleDateString()}</Td>
                    <Td>{Array.isArray(tree.gpsCoordinates) ? tree.gpsCoordinates.join(", ") : tree.gpsCoordinates}</Td>
                    <Td>{tree.photo && <Image src={tree.photo} alt="Tree" width="50" height="50" />}</Td>
                    <Td>{tree.dbh.toString()}</Td>
                    <Td>{tree.canopyBreadth.toString()}</Td>
                    <Td>
                      <Button className="species-button">{tree.species}</Button>
                    </Td>
                    <Td>
                      <Button className="condition-button">{String(tree.treeQuality)}</Button>
                    </Td>
                    <Td>{Array.isArray(tree.treeCondition) ? tree.treeCondition.join(", ") : tree.treeCondition}</Td>
                    <Td>{tree.additionalNotes || "N/A"}</Td>
                    <Td className="clickable-arrow">&gt;</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
        <Box className="page-controls">
          <Button
            className="previous-button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index + 1}
              className={currentPage === index + 1 ? "active-page" : "page-button"}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Button>
          ))}

          <Button
            className="page-button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
