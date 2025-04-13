"use client";
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> dbfdba3 (can download all tree data)
import {
  Table,
  Flex,
  Thead,
  Tbody,
  HStack,
  Tr,
  Th,
  Td,
  Text,
  TableContainer,
  Box,
  Button,
  Image,
} from "@chakra-ui/react";
import * as XLSX from "xlsx";
<<<<<<< HEAD
=======
import { Table, Thead, Tbody, Tr, Th, Td, Text, TableContainer, Box, Button, Image } from "@chakra-ui/react";
>>>>>>> b5f28c7 (feat: connect backend tree table)
=======
>>>>>>> dbfdba3 (can download all tree data)
import Navbar from "@/components/Navbar";
import "./treetable.css";
import { useState, useEffect } from "react";
import { ITree } from "@/database/treeSchema";
<<<<<<< HEAD
<<<<<<< HEAD
import { FileDown } from "lucide-react";
=======
>>>>>>> b5f28c7 (feat: connect backend tree table)
=======
import { FileDown } from "lucide-react";
>>>>>>> dbfdba3 (can download all tree data)
export default function TreeTable() {
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
        <Flex justifyContent={"space-between"}>
          <Text fontSize={["24px", "30px", "38px"]} color="#333" fontWeight="600" mb="30px">
            Tree Inventory
          </Text>
          <Button padding={4} bg="white" borderRadius="24px" variant="solid" right={0} onClick={downloadData}>
            <HStack spacing={2}>
              <Text color="#596334" fontWeight="600">
                Export to Sheets
              </Text>
              <FileDown color="#596334" />
            </HStack>
          </Button>
        </Flex>
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
