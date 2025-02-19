import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Button } from "@chakra-ui/react";
import Navbar from "@/components/Navbar";
import "./treetable.css";

export default function TreeTable() {
  const treeData = [
    {
      id: 1,
      species: "VO",
      dateRecorded: "00/00/00",
      volunteer: "#",
      condition: 10,
    },
    {
      id: 1,
      species: "VO",
      dateRecorded: "00/00/00",
      volunteer: "#",
      condition: 10,
    },
    {
      id: 1,
      species: "VO",
      dateRecorded: "00/00/00",
      volunteer: "#",
      condition: 10,
    },
    {
      id: 1,
      species: "VO",
      dateRecorded: "00/00/00",
      volunteer: "#",
      condition: 10,
    },
    {
      id: 1,
      species: "VO",
      dateRecorded: "00/00/00",
      volunteer: "#",
      condition: 10,
    },
    {
      id: 1,
      species: "VO",
      dateRecorded: "00/00/00",
      volunteer: "#",
      condition: 10,
    },
    {
      id: 1,
      species: "VO",
      dateRecorded: "00/00/00",
      volunteer: "#",
      condition: 10,
    },
    {
      id: 1,
      species: "VO",
      dateRecorded: "00/00/00",
      volunteer: "#",
      condition: 10,
    },
  ];

  return (
    <Box className="tree-table-container">
      <TableContainer>
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
            {treeData.map((tree) => (
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
        <Button className="previous-button">Previous</Button>
        <Button className="active-page">1</Button>
        <Button className="page-button">2</Button>
        <Button className="page-button">3</Button>
        <Button className="page-button">Next</Button>
      </Box>
    </Box>
  );
}
