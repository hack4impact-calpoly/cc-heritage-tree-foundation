"use client";
<<<<<<< HEAD
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
=======
import { Table, Thead, Tbody, Tr, Th, Td, Text, TableContainer, Box, Button, Image } from "@chakra-ui/react";
>>>>>>> b5f28c7 (feat: connect backend tree table)
import Navbar from "@/components/Navbar";
import "./treetable.css";
import { useState, useEffect } from "react";
import { ITree } from "@/database/treeSchema";
<<<<<<< HEAD
import { FileDown } from "lucide-react";
=======
>>>>>>> b5f28c7 (feat: connect backend tree table)
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

<<<<<<< HEAD
  const totalPages = Math.ceil(trees.length / treesPerPage);
=======
  // testing with 20 entries to see if 3 pages work
  const treeData = [
    {
      id: 1,
      species: "VO",
      dateRecorded: "00/00/00",
      volunteer: "#",
      condition: 10,
    },
    {
      id: 2,
      species: "VO",
      dateRecorded: "00/00/00",
      volunteer: "#",
      condition: 10,
    },
    {
      id: 3,
      species: "VO",
      dateRecorded: "00/00/00",
      volunteer: "#",
      condition: 10,
    },
    {
      id: 4,
      species: "VO",
      dateRecorded: "00/00/00",
      volunteer: "#",
      condition: 10,
    },
    {
      id: 5,
      species: "VO",
      dateRecorded: "00/00/00",
      volunteer: "#",
      condition: 10,
    },
    {
      id: 6,
      species: "VO",
      dateRecorded: "00/00/00",
      volunteer: "#",
      condition: 10,
    },
    {
      id: 7,
      species: "VO",
      dateRecorded: "00/00/00",
      volunteer: "#",
      condition: 10,
    },
    {
      id: 8,
      species: "VO",
      dateRecorded: "00/00/00",
      volunteer: "#",
      condition: 10,
    },
    {
      id: 9,
      species: "VO",
      dateRecorded: "00/00/00",
      volunteer: "#",
      condition: 10,
    },
    {
      id: 10,
      species: "VO",
      dateRecorded: "00/00/00",
      volunteer: "#",
      condition: 10,
    },
    {
      id: 11,
      species: "VO",
      dateRecorded: "00/00/00",
      volunteer: "#",
      condition: 10,
    },
    {
      id: 12,
      species: "VO",
      dateRecorded: "00/00/00",
      volunteer: "#",
      condition: 10,
    },
    {
      id: 13,
      species: "VO",
      dateRecorded: "00/00/00",
      volunteer: "#",
      condition: 10,
    },
    {
      id: 14,
      species: "VO",
      dateRecorded: "00/00/00",
      volunteer: "#",
      condition: 10,
    },
    {
      id: 15,
      species: "VO",
      dateRecorded: "00/00/00",
      volunteer: "#",
      condition: 10,
    },
    {
      id: 16,
      species: "VO",
      dateRecorded: "00/00/00",
      volunteer: "#",
      condition: 10,
    },
    {
      id: 17,
      species: "VO",
      dateRecorded: "00/00/00",
      volunteer: "#",
      condition: 10,
    },
    {
      id: 18,
      species: "VO",
      dateRecorded: "00/00/00",
      volunteer: "#",
      condition: 10,
    },
    {
      id: 19,
      species: "VO",
      dateRecorded: "00/00/00",
      volunteer: "#",
      condition: 10,
    },
    {
      id: 20,
      species: "VO",
      dateRecorded: "00/00/00",
      volunteer: "#",
      condition: 10,
    },
  ];

  const totalPages = Math.ceil(treeData.length / treesPerPage);

  const indexOfLastTree = currentPage * treesPerPage;
  const indexOfFirstTree = indexOfLastTree - treesPerPage;
  const currentTrees = trees.slice(indexOfFirstTree, indexOfLastTree);
>>>>>>> b5f28c7 (feat: connect backend tree table)

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
<<<<<<< HEAD
              {trees.slice((currentPage - 1) * treesPerPage, currentPage * treesPerPage).map((tree, index) => (
=======
              {trees.map((tree, index) => (
>>>>>>> b5f28c7 (feat: connect backend tree table)
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
