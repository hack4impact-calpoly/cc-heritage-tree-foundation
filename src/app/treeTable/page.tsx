import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Image } from "@chakra-ui/react";

export default function TreeTable() {
  // dummy tree data
  const treeData = [
    {
      collectorName: "Sydney Jones",
      dateCollected: "2025-01-22",
      contactInfo: "sjones@email.com",
      gpsCoordinates: "34.0522, -118.2437",
      photo: "tree1.jpg",
      dbh: "15.3",
      height: "25 ft",
      canopyBreath: "20 ft",
      species: "Valley Oak",
      mistletoe: false,
      epicormicGrowth: true,
      deadWood: true,
      oakPitScale: "no",
      hangingItems: false,
      additionalNotes: "Tree appears healthy overall.",
    },
    {
      collectorName: "Ryan Smith",
      dateCollected: "2025-01-20",
      contactInfo: "rsmith@example.com",
      gpsCoordinates: "37.7749, -122.4194",
      photo: "tree2.jpg",
      dbh: "20.1",
      height: "30 ft",
      canopyBreath: "25 ft",
      species: "Blue Oak",
      mistletoe: true,
      epicormicGrowth: false,
      deadWood: false,
      oakPitScale: true,
      hangingItems: false,
      additionalNotes: "Signs of stress due to drought.",
    },
  ];

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
                <Th>Height</Th>
                <Th>Tree Canopy Breadth</Th>
                <Th>Species</Th>
                <Th>Mistletoe</Th>
                <Th>Epicormic Growth</Th>
                <Th>Dead Wood</Th>
                <Th>Oak Pit Scale</Th>
                <Th>Hanging Items</Th>
                <Th>Additional Notes</Th>
              </Tr>
            </Thead>
            <Tbody>
              {treeData.map((tree, index) => (
                <Tr key={index}>
                  <Td>{tree.collectorName}</Td>
                  <Td>{tree.dateCollected}</Td>
                  <Td>{tree.gpsCoordinates}</Td>
                  <Td>
                    <Image src={tree.photo} alt="Tree" width="50" height="50" />
                  </Td>
                  <Td>{tree.dbh}</Td>
                  <Td>{tree.height}</Td>
                  <Td>{tree.canopyBreath}</Td>
                  <Td>{tree.species}</Td>
                  <Td>{tree.mistletoe === true ? "Yes" : "No"}</Td>
                  <Td>{tree.epicormicGrowth === true ? "Yes" : "No"}</Td>
                  <Td>{tree.deadWood === true ? "Yes" : "No"}</Td>
                  <Td>{tree.oakPitScale === true ? "Yes" : "No"}</Td>
                  <Td>{tree.hangingItems === true ? "Yes" : "No"}</Td>
                  <Td>{tree.additionalNotes}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
}
