import { ArrowUpRight, NotebookPen, SquarePen } from "lucide-react";
import {
  Grid,
  GridItem,
  Image,
  Text,
  Button,
  Link,
  Box,
  HStack,
  Table,
  Td,
  Tbody,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

function AdminDashboard() {
  return (
    <div>
      <Grid
        minWidth="1024px"
        h="100%"
        bg="#F4F1E8"
        templateRows="repeat(7, 1fr)"
        templateColumns="repeat(8, 1fr)"
        gap={5}
      >
        <GridItem
          colSpan={8}
          rowSpan={2}
          display="flex"
          justifyContent="center"
          alignItems="center"
          position="relative"
        >
          <Text ml={-425} fontSize="3xl" fontWeight="bold" color="#596334" mt="auto">
            Welcome back, Jane!
          </Text>
        </GridItem>
        <GridItem rowSpan={4} colSpan={4}>
          <Box
            borderRadius={"20px"}
            borderColor="black"
            bg="white"
            w="350px"
            h="270px"
            alignItems="center"
            p={10}
            ml="auto"
          >
            <HStack>
              <Text color="#333333">Trees Logged This Year</Text>
              <Link href="" ml="auto">
                <ArrowUpRight></ArrowUpRight>
              </Link>
            </HStack>
            <Text mt={5} mb={5} fontWeight="bold" color="#596334" fontSize="7xl">
              123
            </Text>
            <Text color="#333333">% incr from December</Text>
          </Box>
        </GridItem>
        <GridItem rowSpan={6} colSpan={4}>
          <Box
            mr="auto"
            borderRadius={"20px"}
            alignItems="center"
            borderColor="black"
            bg="white"
            w="600px"
            h="355px"
            p={10}
          >
            <HStack>
              <Text color="#333333">Trees in Poor Condition</Text>
              <Link href="" ml="auto">
                <ArrowUpRight></ArrowUpRight>
              </Link>
            </HStack>
            <Box borderRadius="20px" overflow="hidden" border="1px solid" borderColor={"#596334"} mt={10}>
              <Table size="sm" variant="simple">
                <Thead bg="#DFED98">
                  <Tr>
                    <Th width={"20%"}>#</Th>
                    <Th width={"20%"}>Species</Th>
                    <Th width={"20%"}>Condition</Th>
                    <Th width={"20%"}>Date Recorded</Th>
                    <Th width={"20%"}>Volunteer</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>1</Td>
                    <Td>
                      <Box
                        color="#4A7B90"
                        bg="#CFEFF9"
                        height={10}
                        width={10}
                        display="flex"
                        pt={3}
                        justifyContent="center"
                        borderRadius={11}
                      >
                        VO
                      </Box>
                    </Td>
                    <Td>
                      <Box
                        color="white"
                        bg="#596334"
                        height={10}
                        width={10}
                        display="flex"
                        pt={3}
                        justifyContent="center"
                        borderRadius={11}
                      >
                        10
                      </Box>
                    </Td>
                    <Td>12/24/2024</Td>
                    <Td>
                      <NotebookPen></NotebookPen>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>1</Td>
                    <Td>
                      <Box
                        color="#4A7B90"
                        bg="#CFEFF9"
                        height={10}
                        width={10}
                        display="flex"
                        pt={3}
                        justifyContent="center"
                        borderRadius={11}
                      >
                        VO
                      </Box>
                    </Td>
                    <Td>
                      <Box
                        color="white"
                        bg="#596334"
                        height={10}
                        width={10}
                        display="flex"
                        pt={3}
                        justifyContent="center"
                        borderRadius={11}
                      >
                        8
                      </Box>
                    </Td>
                    <Td>1/3/2025</Td>
                    <Td>
                      <NotebookPen></NotebookPen>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>1</Td>
                    <Td>
                      <Box
                        color="#4A7B90"
                        bg="#CFEFF9"
                        height={10}
                        width={10}
                        display="flex"
                        pt={3}
                        justifyContent="center"
                        borderRadius={11}
                      >
                        VO
                      </Box>
                    </Td>
                    <Td>
                      <Box
                        color="white"
                        bg="#596334"
                        height={10}
                        width={10}
                        display="flex"
                        pt={3}
                        justifyContent="center"
                        borderRadius={11}
                      >
                        9
                      </Box>
                    </Td>
                    <Td>2/6/2025</Td>
                    <Td>
                      <NotebookPen></NotebookPen>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
          </Box>
        </GridItem>
        <GridItem rowSpan={2} colSpan={4}>
          <Box
            width={"350px"}
            display="flex"
            justifyContent={"center"}
            alignItems="center"
            borderRadius={"20px"}
            borderColor="black"
            bg="white"
            p={9}
            pl={-2}
            pr={-2}
            ml="auto"
            mt="auto"
            height={"40px"}
          >
            <Button
              width={"300px"}
              height={"50px"}
              color="white"
              bg="#E57300"
              borderRadius={"50px"}
              fontWeight="bold"
              fontSize="sm"
            >
              Create new announcement&nbsp;<SquarePen></SquarePen>
            </Button>
          </Box>
        </GridItem>
        <GridItem
          rowSpan={6}
          colSpan={8}
          display="flex"
          justifyContent="center"
          alignItems="center"
          position="relative"
        >
          <Image
            mb={70}
            mr={-250}
            src="/map.png"
            fit="cover"
            alt="Map not Appearing"
            height="200px"
            width="975px"
            borderRadius="20px"
          ></Image>
        </GridItem>
      </Grid>
    </div>
  );
}

export default AdminDashboard;
