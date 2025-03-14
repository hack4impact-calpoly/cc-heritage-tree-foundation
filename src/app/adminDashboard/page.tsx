"use client";
import { ArrowUpRight, NotebookPen, SquarePen } from "lucide-react";
import {
  Grid,
  GridItem,
  Image,
  Text,
  Button,
  Flex,
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
import Map from "@/components/Map";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

function AdminDashboard() {
  const user = useUser();
  const router = useRouter();

  return (
    <Box width="100%" height="100%" p={{ base: "20px", md: "0 50px 50px 50px" }} pt="0px">
      <Grid
        width="100%"
        height="100%"
        templateRows={{ base: "auto auto auto auto", md: "repeat(10, 1fr)" }}
        templateColumns={{ base: "1fr", md: "repeat(8, 1fr)" }}
        gap={4}
      >
        {/* Welcome Message */}
        <GridItem colSpan={{ base: 1, md: 8 }} rowSpan={1} display="flex" alignItems="center">
          <Text fontSize="3xl" fontWeight="bold" color="#596334">
            Welcome back, {user.user?.firstName}!
          </Text>
        </GridItem>

        {/* Trees Logged This Year */}
        <GridItem rowSpan={{ base: 1, md: 3 }} colSpan={{ base: 1, md: 3 }}>
          <Box borderRadius="20px" borderColor="black" bg="white" height="100%" p={{ base: 5, md: 10 }}>
            <HStack>
              <Text color="#333333">Trees Logged This Year</Text>
              <Link href="" ml="auto">
                <ArrowUpRight />
              </Link>
            </HStack>
            <Text mt={5} mb={5} fontWeight="bold" color="#596334" fontSize="7xl">
              123
            </Text>
            <Text color="#333333">% incr from December</Text>
          </Box>
        </GridItem>

        {/* Trees in Poor Condition */}
        <GridItem rowSpan={{ base: 2, md: 4 }} colSpan={{ base: 1, md: 5 }}>
          <Box borderRadius="20px" borderColor="black" bg="white" height="100%" p={{ base: 5, md: 10 }}>
            <HStack>
              <Text color="#333333">Trees in Poor Condition</Text>
              <Link href="" ml="auto">
                <ArrowUpRight />
              </Link>
            </HStack>
            <Box borderRadius="20px" overflow="hidden" border="1px solid" borderColor="#596334" mt={10}>
              <Table size="sm" variant="simple">
                <Thead bg="#DFED98">
                  <Tr h="40px">
                    <Th width="20%">#</Th>
                    <Th width="20%">Species</Th>
                    <Th width="20%">Condition</Th>
                    <Th width="20%">Date Recorded</Th>
                    <Th width="20%">Volunteer</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {[1, 2, 3].map((item) => (
                    <Tr key={item}>
                      <Td>{item}</Td>
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
                          {item === 1 ? 10 : item === 2 ? 8 : 9}
                        </Box>
                      </Td>
                      <Td>{item === 1 ? "12/24/2024" : item === 2 ? "1/3/2025" : "2/6/2025"}</Td>
                      <Td>
                        <NotebookPen />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Box>
        </GridItem>

        {/* Create New Announcement Button */}
        <GridItem rowSpan={1} colSpan={{ base: 1, md: 3 }}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            borderRadius="20px"
            borderColor="black"
            bg="white"
            height="100%"
          >
            <Button
              width="100%"
              maxWidth="300px"
              height="50px"
              color="white"
              bg="#E57300"
              borderRadius="50px"
              fontWeight="bold"
              fontSize="sm"
              onClick={() => router.push("/createAnnouncement")}
            >
              Create new announcement&nbsp;
              <SquarePen />
            </Button>
          </Box>
        </GridItem>

        {/* Map */}
        <GridItem rowSpan={{ base: 2, md: 5 }} colSpan={{ base: 1, md: 8 }} data-testid="map_id">
          <Map />
        </GridItem>
      </Grid>
    </Box>
  );
}

export default AdminDashboard;
