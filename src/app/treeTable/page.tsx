"use client";
import { Table, Thead, Tbody, Tr, Th, Td, Text, TableContainer, Box, Button, Image } from "@chakra-ui/react";
import Navbar from "@/components/Navbar";
import "./treetable.css";
import { useState, useEffect } from "react";
import { ITree } from "@/database/treeSchema";
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
  return (
    <Box width="100%" height="100%" p={{ base: "20px", md: "50px" }} display="flex" justifyContent="center">
      <Box w="90%" maxWidth="1137px">
        <Text fontSize={["24px", "30px", "38px"]} color="#333" fontWeight="600" mb="30px">
          Tree Inventory
        </Text>
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
