"use client";
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Image } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { ITree } from "@/database/treeSchema";
export default function TreeTable() {
  const [trees, setTrees] = useState<ITree[]>([]);
  useEffect(() => {
    fetch("/api/tree")
      .then((response) => response.json())
      .then((data) => setTrees(data))
      .catch((err) => console.error("Error fetching trees:", err));
  }, []);

  // tree table structure
  return (
    <div>
      <Box p={5}>
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>Collector Name</Th>
                <Th>Date Collected</Th>
                <Th>GPS Coordinates</Th>
                <Th>Photo</Th>
                <Th>DBH (inches)</Th>
                <Th>Tree Canopy Breadth</Th>
                <Th>Species</Th>
                <Th>Tree Condition</Th>
                <Th>Additional Notes</Th>
              </Tr>
            </Thead>
            <Tbody>
              {trees.map((tree) => (
                <Tr key={tree._id}>
                  <Td>{tree.collectorName}</Td>
                  <Td>{new Date(tree.dateCollected).toLocaleDateString()}</Td>
                  <Td>{Array.isArray(tree.gpsCoordinates) ? tree.gpsCoordinates.join(", ") : tree.gpsCoordinates}</Td>
                  <Td>{tree.photo && <Image src={tree.photo} alt="Tree" width="50" height="50" />}</Td>
                  <Td>{tree.dbh.toString()}</Td>
                  <Td>{tree.canopyBreadth.toString()}</Td>
                  <Td>{tree.species}</Td>
                  <Td>{Array.isArray(tree.treeCondition) ? tree.treeCondition.join(", ") : tree.treeCondition}</Td>
                  <Td>{tree.additionalNotes || "N/A"}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
}
