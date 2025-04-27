// "use client";
// import {
//   Table,
//   Flex,
//   Thead,
//   Tbody,
//   HStack,
//   Tr,
//   Th,
//   Td,
//   Text,
//   TableContainer,
//   Box,
//   Button,
//   Image,
//   VStack,
//   IconButton,
//   Tag,
//   Grid,
//   GridItem,
//   Input,
//   InputGroup,
//   InputLeftElement,
//   Select,
// } from "@chakra-ui/react";
// import * as XLSX from "xlsx";
// import Navbar from "@/components/Navbar";
// import "./treetable.css";
// import { useState, useEffect } from "react";
// import { ITree } from "@/database/treeSchema";
// import { FileDown, Menu, Edit, Search, X, ChevronDown, ChevronLeft, ChevronRight, TreePine } from "lucide-react";
// import { BrowserView, MobileView, isMobile } from "react-device-detect";

// export default function TreeTable() {
//   const [trees, setTrees] = useState<ITree[]>([]);
//   const [isClient, setIsClient] = useState(false);
//   const [selectedTree, setSelectedTree] = useState<ITree | null>(null);

//   useEffect(() => {
//     fetch("/api/tree")
//       .then((response) => {
//         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//         return response.json();
//       })
//       .then((data) => {
//         console.log("data");
//         console.log(data);
//         if (Array.isArray(data)) {
//           setTrees(data);
//         } else {
//           console.error("Unexpected data format:", data);
//           setTrees([]);
//         }
//       })
//       .catch((err) => {
//         console.error("Fetch error:", err);
//         setTrees([]);
//       });
//   }, []);

//   // tree table structure
//   const treesPerPage = 8;
//   const [currentPage, setCurrentPage] = useState(1);

//   const totalPages = Math.ceil(trees.length / treesPerPage);

//   const handlePageChange = (pageNumber: number) => {
//     if (pageNumber >= 1 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber);
//     }
//   };

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   const downloadData = () => {
//     // retrieve ALL trees data
//     const dataSheet = XLSX.utils.json_to_sheet(
//       trees.map((tree: ITree, index) => ({
//         Index: index,
//         "Tree Id": tree._id,
//         "Collector Name": tree.collectorName,
//         "Date Collected": new Date(tree.dateCollected).toLocaleDateString(),
//         "GPS Coordinates": Array.isArray(tree.gpsCoordinates) ? tree.gpsCoordinates.join(", ") : tree.gpsCoordinates,
//         "DBH (inches)": tree.dbh.toString(),
//         "Tree Canopy Breadth": tree.canopyBreadth.toString(),
//         Species: tree.species,
//         "Tree Quality": String(tree.treeQuality),
//         "Tree Condition": Array.isArray(tree.treeCondition) ? tree.treeCondition.join(", ") : tree.treeCondition,
//         "Additional Notes": tree.additionalNotes || "N/A",
//       })),
//     );

//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, dataSheet, "Trees Table");
//     XLSX.writeFile(wb, "treesTable.xlsx");
//   };

//   const openTreeDetails = (tree: ITree) => {
//     setSelectedTree(tree);
//   };

//   const getConditionNumber = (condition: string | string[]) => {
//     const conditionStr = Array.isArray(condition) ? condition[0] : condition;
//     if (conditionStr.includes("2")) return 2;
//     if (conditionStr.includes("3")) return 3;
//     return 1;
//   };

//   return (
//     <div>
//       {isClient ? (
//         <div>
//           <BrowserView>
//             <Flex>

//               {/* Main content */}
//               <Box flex="1" p={6} bg="#F5F5ED">
//                 <Flex justify="space-between" align="center" mb={6}>
//                   {/* Left: Title */}
//                   <Text fontSize="3xl" fontWeight="bold" color="#333">
//                     Tree Inventory
//                   </Text>

//                   {/* Right: User profile and export button */}
//                   <Flex align="center">
//                     <Button
//                       rightIcon={<FileDown size={18} />}
//                       variant="outline"
//                       colorScheme="gray"
//                       borderRadius="full"
//                       bg="white"
//                       mr={4}
//                       onClick={downloadData}
//                     >
//                       Export to Sheets
//                     </Button>
//                     <Flex
//                       align="center"
//                       bg="white"
//                       borderRadius="full"
//                       px={4}
//                       py={2}
//                       boxShadow="sm"
//                     >
//                       <Image
//                         src="https://via.placeholder.com/32"
//                         alt="User"
//                         borderRadius="full"
//                         boxSize="32px"
//                         mr={2}
//                       />
//                       <Box>
//                         <Text fontSize="sm" fontWeight="medium">User Name</Text>
//                         <Text fontSize="xs" color="gray.500">Admin</Text>
//                       </Box>
//                       <ChevronDown size={16} ml={2} />
//                     </Flex>
//                   </Flex>
//                 </Flex>

//                 {/* Search and filters */}
//                 <Flex mb={6} justify="space-between">
//                   <InputGroup maxWidth="300px">
//                     <InputLeftElement pointerEvents="none">
//                       <Search size={18} color="#999" />
//                     </InputLeftElement>
//                     <Input placeholder="Search" bg="white" borderRadius="md" />
//                   </InputGroup>

//                   <Flex>
//                     <Select
//                       placeholder="Condition worst to best"
//                       bg="white"
//                       borderRadius="md"
//                       width="200px"
//                       mr={4}
//                       icon={<ChevronDown />}
//                     />
//                     <Flex align="center" bg="#596334" borderRadius="full" px={2} py={1}>
//                       <Box
//                         borderRadius="full"
//                         bg="#596334"
//                         p={1}
//                         mr={2}
//                       >
//                         <Image
//                           src="https://via.placeholder.com/24"
//                           alt="User"
//                           borderRadius="full"
//                           boxSize="24px"
//                         />
//                       </Box>
//                       <Text color="white" fontSize="sm" fontWeight="medium" mr={1}>
//                         Jane Doe
//                       </Text>
//                       <IconButton
//                         aria-label="Clear filter"
//                         icon={<X size={16} />}
//                         size="xs"
//                         colorScheme="whiteAlpha"
//                         variant="ghost"
//                       />
//                     </Flex>
//                     <Flex align="center" bg="#B6E1EF" borderRadius="full" px={2} py={1} ml={2}>
//                       <Text color="gray.700" fontSize="sm" fontWeight="medium" mr={1}>
//                         vo
//                       </Text>
//                       <IconButton
//                         aria-label="Clear filter"
//                         icon={<X size={16} />}
//                         size="xs"
//                         colorScheme="blackAlpha"
//                         variant="ghost"
//                       />
//                     </Flex>
//                   </Flex>
//                 </Flex>

//                 {/* Tree table */}
//                 <Box
//                   bg="white"
//                   borderRadius="md"
//                   overflow="hidden"
//                   borderTopLeftRadius="0"
//                 >
//                   {/* Table header with light green background */}
//                   <Grid
//                     templateColumns="50px 1fr 1fr 1fr 1fr 50px"
//                     bg="#E8F0D6"
//                     p={3}
//                     borderBottom="1px solid #eee"
//                     fontWeight="bold"
//                     color="#596334"
//                   >
//                     <GridItem>#</GridItem>
//                     <GridItem>Species</GridItem>
//                     <GridItem>Date</GridItem>
//                     <GridItem>User</GridItem>
//                     <GridItem>Condition</GridItem>
//                     <GridItem></GridItem>
//                   </Grid>

//                   {/* Table rows */}
//                   {trees.slice((currentPage - 1) * treesPerPage, currentPage * treesPerPage).map((tree, index) => (
//                     <Grid
//                       key={tree._id}
//                       templateColumns="50px 1fr 1fr 1fr 1fr 50px"
//                       p={3}
//                       borderBottom="1px solid #eee"
//                       bg={selectedTree?._id === tree._id ? "#F5F5F0" : "white"}
//                       _hover={{ bg: "#F9F9F7" }}
//                       onClick={() => openTreeDetails(tree)}
//                       cursor="pointer"
//                     >
//                       <GridItem>{index + 1}</GridItem>
//                       <GridItem>
//                         <Tag
//                           size="sm"
//                           bg={tree.species === "vo" ? "#B6E1EF" : tree.species === "co" ? "#B6E1EF" : "#6B92B0"}
//                           color={tree.species === "bo" ? "white" : "gray.700"}
//                           borderRadius="full"
//                           px={3}
//                         >
//                           {tree.species}
//                         </Tag>
//                       </GridItem>
//                       <GridItem>{new Date(tree.dateCollected).toLocaleDateString()}</GridItem>
//                       <GridItem>
//                         <Flex align="center">
//                           <Box
//                             borderRadius="full"
//                             bg="#596334"
//                             p={1}
//                             mr={2}
//                           >
//                             <Image
//                               src="https://via.placeholder.com/24"
//                               alt="User"
//                               borderRadius="full"
//                               boxSize="24px"
//                             />
//                           </Box>
//                           <Text>{tree.collectorName}</Text>
//                         </Flex>
//                       </GridItem>
//                       <GridItem>
//                         <Tag
//                           size="sm"
//                           bg={getConditionNumber(tree.treeCondition) === 2 ? "#EB7742" : getConditionNumber(tree.treeCondition) === 3 ? "#C74A2E" : "#6A9944"}
//                           color="white"
//                           borderRadius="full"
//                           px={3}
//                         >
//                           {getConditionNumber(tree.treeCondition)}
//                         </Tag>
//                       </GridItem>
//                       <GridItem textAlign="right">
//                         <ChevronRight size={20} color={selectedTree?._id === tree._id ? "#596334" : "#ccc"} />
//                       </GridItem>
//                     </Grid>
//                   ))}
//                 </Box>

//                 {/* Pagination */}
//                 <Flex justify="center" mt={4}>
//                   <Button
//                     leftIcon={<ChevronLeft size={16} />}
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => handlePageChange(currentPage - 1)}
//                     isDisabled={currentPage === 1}
//                   >
//                     Previous
//                   </Button>

//                   {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
//                     // Show current page and neighbors
//                     const pageNum = i + 1;
//                     return (
//                       <Button
//                         key={pageNum}
//                         variant={currentPage === pageNum ? "solid" : "ghost"}
//                         bg={currentPage === pageNum ? "#596334" : "transparent"}
//                         color={currentPage === pageNum ? "white" : "inherit"}
//                         size="sm"
//                         mx={1}
//                         onClick={() => handlePageChange(pageNum)}
//                       >
//                         {pageNum}
//                       </Button>
//                     );
//                   })}

//                   <Button
//                     rightIcon={<ChevronRight size={16} />}
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => handlePageChange(currentPage + 1)}
//                     isDisabled={currentPage === totalPages}
//                   >
//                     Next
//                   </Button>
//                 </Flex>
//               </Box>

//               {/* Right side panel showing selected tree details */}
//               {selectedTree && (
//                 <Box width="300px" bg="white" p={0} margin={3} borderRadius={20}>

//                   <Box
//                     bg="#596334"
//                     color="white"
//                     p={5}
//                     borderTopLeftRadius={20}
//                     borderTopRightRadius={20}
//                   >
//                     <VStack gap={3} align="stretch">
//                       {/* Top row */}
//                       <Flex justifyContent="flex-end">
//                       {/* Notes icon on the right */}
//                         <Edit size={20} />
//                       </Flex>

//                       <Flex justifyContent="space-between" alignItems="center">
//                         <Flex alignItems="center" gap={3}>
//                           <TreePine size={18} color="white"/>

//                           <Text fontWeight="medium">Tree #1</Text>
//                         </Flex>

//                         <Tag
//                           size="md"
//                           bg="#B6E1EF"
//                           color="gray.700"
//                           borderRadius={5}
//                           px={2}
//                           py={1}
//                         >
//                           {selectedTree.species}
//                         </Tag>
//                       </Flex>

//                       {/* Bottom row */}
//                       <Flex justifyContent="space-between" alignItems="center">
//                         <Text>
//                           {Array.isArray(selectedTree.gpsCoordinates)
//                             ? selectedTree.gpsCoordinates.join(", ")
//                             : selectedTree.gpsCoordinates || "45.6789, -123.4567"}
//                         </Text>
//                       </Flex>
//                     </VStack>

//                   </Box>

//                   <Box p={4}>
//                     <VStack spacing={4} align="stretch">
//                       {/* Tree species button */}
//                       {/* <Flex justifyContent="flex-end">
//                         <Tag
//                           size="md"
//                           bg="#B6E1EF"
//                           color="gray.700"
//                           borderRadius="full"
//                           px={4}
//                           py={1}
//                         >
//                           {selectedTree.species}
//                         </Tag>
//                       </Flex> */}

//                       {/* GPS Coordinates */}
//                       {/* <Box>
//                         <Text fontSize="sm" color="gray.500">GPS Coordinates</Text>
//                         <Text>
//                           {Array.isArray(selectedTree.gpsCoordinates)
//                             ? selectedTree.gpsCoordinates.join(", ")
//                             : selectedTree.gpsCoordinates || "45.6789, -123.4567"}
//                         </Text>
//                       </Box> */}

//                       {/* User and Date */}
//                       <Flex justifyContent="space-between" align={"center"}>
//                         <Box bgColor="beige" alignItems="center" borderRadius={10} p={2}>
//                           <HStack align="center">
//                             {/* user */}
//                               <Box
//                               borderRadius="full"
//                               bg="#596334"
//                               boxSize={5}
//                               >
//                               </Box>
//                               <Text>{selectedTree.collectorName}</Text>

//                           </HStack>
//                         </Box>
//                         <Box textAlign="right">
//                           <Text>{new Date(selectedTree.dateCollected).toLocaleDateString() || "02/21/2024"}</Text>
//                         </Box>
//                       </Flex>

//                       <Grid templateColumns="repeat(2, 1fr)" gap={2}>
//                           <Box bg="gray.100" height="100px" borderRadius="md" display="flex" justifyContent="center" alignItems="center">
//                             <VStack>
//                               <Text>Condition</Text>
//                               <Tag
//                                 size="md"
//                                 bg="#596334"
//                                 color="white"
//                                 borderRadius="md"
//                                 mr={2}
//                               >
//                                 {selectedTree.treeCondition}
//                               </Tag>
//                               <Text>Healthy</Text>
//                             </VStack>
//                           </Box>
//                           <Box bg="gray.100" height="100px" borderRadius="md" display="flex" justifyContent="center" alignItems="center">
//                             <VStack>
//                               <Flex justifyContent="space-between">
//                                 <Text>Logo</Text>
//                                 <Text>Notes</Text>
//                               </Flex>
//                               <Text>{selectedTree.additionalNotes}</Text>
//                             </VStack>
//                           </Box>
//                         </Grid>

//                       {/* Tree conditions as tags */}
//                       <Box>
//                         <Flex flexWrap="wrap" gap={2}>
//                           {['Dead branches', 'Cavities or hollow', 'Blunt trauma', 'Ivy strangulation', 'Dual split trunk'].map((condition, idx) => (
//                             <Tag key={idx} size="med" bg="#F0F4D7" color="#596334" borderRadius="lg" p={1}>
//                               {condition}
//                             </Tag>
//                           ))}
//                         </Flex>
//                       </Box>

//                       {/* Tree measurements */}
//                       <Grid templateColumns="repeat(3, 1fr)" gap={4}>
//                         <Box>
//                           <Text fontSize="med" color="gray.500">Trunk</Text>
//                           <Text fontSize="med" color="gray.500">DBH</Text>
//                           <Text fontWeight="bold">{selectedTree.dbh}'</Text>
//                         </Box>
//                         <Box>
//                           <Text fontSize="med" color="gray.500">Tree</Text>
//                           <Text fontSize="med" color="gray.500">Height</Text>
//                           <Text fontWeight="bold">Tree height</Text>
//                         </Box>
//                         <Box>
//                           <Text fontSize="med" color="gray.500">Canopy</Text>
//                           <Text fontSize="med" color="gray.500">Spread</Text>
//                           <Text fontWeight="bold">{selectedTree.canopyBreadth}"</Text>
//                         </Box>
//                       </Grid>

//                       {/* Photos */}
//                       <Box>
//                         <Text fontSize="med" color="gray.500" mb={2}>Photos</Text>
//                         <Grid templateColumns="repeat(3, 1fr)" gap={2}>
//                           <Box bg="gray.100" height="220px" borderRadius="md" display="flex" justifyContent="center" alignItems="center">
//                             <IconButton aria-label="Expand" icon={<Text fontSize="xl">⤢</Text>} variant="ghost" />
//                           </Box>
//                           <Box bg="gray.100" height="220px" borderRadius="md" display="flex" justifyContent="center" alignItems="center">
//                             <IconButton aria-label="Expand" icon={<Text fontSize="xl">⤢</Text>} variant="ghost" />
//                           </Box>
//                           <Box bg="gray.100" height="220px" borderRadius="md" display="flex" justifyContent="center" alignItems="center">
//                             <IconButton aria-label="Expand" icon={<Text fontSize="xl">⤢</Text>} variant="ghost" />
//                           </Box>
//                         </Grid>
//                       </Box>
//                     </VStack>
//                   </Box>
//                 </Box>
//               )}
//             </Flex>
//           </BrowserView>
//         </div>
//       ) : (
//         <div></div>
//       )}
//     </div>
//   );
// }

"use client";
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
  VStack,
  IconButton,
  Tag,
  Grid,
} from "@chakra-ui/react";
import * as XLSX from "xlsx";
import Navbar from "@/components/Navbar";
import "./treetable.css";
import { useState, useEffect } from "react";
import { ITree } from "@/database/treeSchema";
import { FileDown, Menu, Edit, TreePine } from "lucide-react";
import { BrowserView, MobileView, isMobile } from "react-device-detect";

export default function TreeTable() {
  const [trees, setTrees] = useState<ITree[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [selectedTree, setSelectedTree] = useState<ITree | null>(null);

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

  const openTreeDetails = (tree: ITree) => {
    setSelectedTree(tree);
  };

  return (
    <div>
      {isClient ? (
        <div>
          <BrowserView>
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
                        <Th>Species</Th>
                        <Th>Date Collected</Th>
                        <Th>Collector Name</Th>
                        {/* <Th>GPS Coordinates</Th> */}
                        {/* <Th>Photo</Th> */}
                        {/* <Th>DBH (inches)</Th> */}
                        {/* <Th>Tree Canopy Breadth</Th> */}

                        {/* <Th>Tree Quality</Th> */}
                        <Th>Tree Condition</Th>
                        {/* <Th>Additional Notes</Th> */}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {trees.slice((currentPage - 1) * treesPerPage, currentPage * treesPerPage).map((tree, index) => (
                        <Tr key={tree._id}>
                          <Td>{tree._id}</Td>
                          <Td>
                            <Button className="species-button">{tree.species}</Button>
                          </Td>
                          <Td>{new Date(tree.dateCollected).toLocaleDateString()}</Td>
                          <Td>{tree.collectorName}</Td>
                          <Td>
                            {Array.isArray(tree.treeCondition) ? tree.treeCondition.join(", ") : tree.treeCondition}
                          </Td>

                          {/* <Td>
                            {Array.isArray(tree.gpsCoordinates) ? tree.gpsCoordinates.join(", ") : tree.gpsCoordinates}
                          </Td>
                          <Td>{tree.photo && <Image src={tree.photo} alt="Tree" width="50" height="50" />}</Td>
                          <Td>{tree.dbh.toString()}</Td>
                          <Td>{tree.canopyBreadth.toString()}</Td>
                          
                          <Td>
                            <Button className="condition-button">{String(tree.treeQuality)}</Button>
                          </Td>
                          
                          <Td>{tree.additionalNotes || "N/A"}</Td> */}
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

              {/* Right side panel showing selected tree details */}
              {selectedTree && (
                <Box width="300px" bg="white" p={0} margin={3} borderRadius={20}>
                  <Box bg="#596334" color="white" p={5} borderTopLeftRadius={20} borderTopRightRadius={20}>
                    <VStack gap={3} align="stretch">
                      {/* Top row */}
                      <Flex justifyContent="flex-end">
                        {/* Notes icon on the right */}
                        <Edit size={20} />
                      </Flex>

                      <Flex justifyContent="space-between" alignItems="center">
                        <Flex alignItems="center" gap={3}>
                          <TreePine size={18} color="white" />

                          <Text fontWeight="medium">Tree #1</Text>
                        </Flex>

                        <Tag size="md" bg="#B6E1EF" color="gray.700" borderRadius={5} px={2} py={1}>
                          {selectedTree.species}
                        </Tag>
                      </Flex>

                      {/* Bottom row */}
                      <Flex justifyContent="space-between" alignItems="center">
                        <Text>
                          {Array.isArray(selectedTree.gpsCoordinates)
                            ? selectedTree.gpsCoordinates.join(", ")
                            : selectedTree.gpsCoordinates || "45.6789, -123.4567"}
                        </Text>
                      </Flex>
                    </VStack>
                  </Box>

                  <Box p={4}>
                    <VStack spacing={4} align="stretch">
                      {/* User and Date */}
                      <Flex justifyContent="space-between" align={"center"}>
                        <Box bgColor="beige" alignItems="center" borderRadius={10} p={2}>
                          <HStack align="center">
                            {/* user */}
                            <Box borderRadius="full" bg="#596334" boxSize={5}></Box>
                            <Text>{selectedTree.collectorName}</Text>
                          </HStack>
                        </Box>
                        <Box textAlign="right">
                          <Text>{new Date(selectedTree.dateCollected).toLocaleDateString() || "02/21/2024"}</Text>
                        </Box>
                      </Flex>

                      <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                        <Box
                          bg="gray.100"
                          height="100px"
                          borderRadius="md"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <VStack>
                            <Text>Condition</Text>
                            <Tag size="md" bg="#596334" color="white" borderRadius="md" mr={2}>
                              {selectedTree.treeCondition}
                            </Tag>
                            <Text>Healthy</Text>
                          </VStack>
                        </Box>
                        <Box
                          bg="gray.100"
                          height="100px"
                          borderRadius="md"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <VStack>
                            <Flex justifyContent="space-between">
                              <Text>Logo</Text>
                              <Text>Notes</Text>
                            </Flex>
                            <Text>{selectedTree.additionalNotes}</Text>
                          </VStack>
                        </Box>
                      </Grid>

                      {/* Tree conditions as tags */}
                      <Box>
                        <Flex flexWrap="wrap" gap={2}>
                          {[
                            "Dead branches",
                            "Cavities or hollow",
                            "Blunt trauma",
                            "Ivy strangulation",
                            "Dual split trunk",
                          ].map((condition, idx) => (
                            <Tag key={idx} size="med" bg="#F0F4D7" color="#596334" borderRadius="lg" p={1}>
                              {condition}
                            </Tag>
                          ))}
                        </Flex>
                      </Box>

                      {/* Tree measurements */}
                      <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                        <Box>
                          <Text fontSize="med" color="gray.500">
                            Trunk
                          </Text>
                          <Text fontSize="med" color="gray.500">
                            DBH
                          </Text>
                          <Text fontWeight="bold">{selectedTree.dbh}&apos;</Text>
                        </Box>
                        <Box>
                          <Text fontSize="med" color="gray.500">
                            Tree
                          </Text>
                          <Text fontSize="med" color="gray.500">
                            Height
                          </Text>
                          <Text fontWeight="bold">Tree height</Text>
                        </Box>
                        <Box>
                          <Text fontSize="med" color="gray.500">
                            Canopy
                          </Text>
                          <Text fontSize="med" color="gray.500">
                            Spread
                          </Text>
                          <Text fontWeight="bold">{selectedTree.canopyBreadth}&apos;</Text>
                        </Box>
                      </Grid>

                      {/* Photos */}
                      <Box>
                        <Text fontSize="med" color="gray.500" mb={2}>
                          Photos
                        </Text>
                        <Grid templateColumns="repeat(3, 1fr)" gap={2}>
                          <Box
                            bg="gray.100"
                            height="220px"
                            borderRadius="md"
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <IconButton aria-label="Expand" icon={<Text fontSize="xl">⤢</Text>} variant="ghost" />
                          </Box>
                          <Box
                            bg="gray.100"
                            height="220px"
                            borderRadius="md"
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <IconButton aria-label="Expand" icon={<Text fontSize="xl">⤢</Text>} variant="ghost" />
                          </Box>
                          <Box
                            bg="gray.100"
                            height="220px"
                            borderRadius="md"
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <IconButton aria-label="Expand" icon={<Text fontSize="xl">⤢</Text>} variant="ghost" />
                          </Box>
                        </Grid>
                      </Box>
                    </VStack>
                  </Box>
                </Box>
              )}
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
