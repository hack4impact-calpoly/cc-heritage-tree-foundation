"use client";

import { Table, Thead, Tbody, Tr, Th, Td, Text, TableContainer, Box, Button } from "@chakra-ui/react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import "./treetable.css";

export default function TreeTable() {
  const treesPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);

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
  const currentTrees = treeData.slice(indexOfFirstTree, indexOfLastTree);

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
                <Th>#</Th>
                <Th>Species</Th>
                <Th>Date Recorded</Th>
                <Th>Volunteer</Th>
                <Th>Condition</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentTrees.map((tree) => (
                <Tr key={tree.id}>
                  <Td>{tree.id}</Td>
                  <Td>
                    <Button className="species-button">{tree.species}</Button>
                  </Td>
                  <Td>{tree.dateRecorded}</Td>
                  <Td>{tree.volunteer}</Td>
                  <Td>
                    <Button className="condition-button">{tree.condition}</Button>
                  </Td>
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
