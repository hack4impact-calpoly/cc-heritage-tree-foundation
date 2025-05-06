"use client";
import { ArrowUpRight, NotebookPen, SquarePen } from "lucide-react";
import {
  Grid,
  Image,
  GridItem,
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
  Flex,
  Tr,
} from "@chakra-ui/react";
import Map from "@/components/Map";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { IconStyle, BoxItem, VO, Condition, ConditionMobile } from "@/styles/AdminDashStyle";
import { AlignJustify } from "lucide-react";
import { BrowserView, MobileView } from "react-device-detect";
import { useState, useEffect } from "react";
import { COLORS } from "@/styles/color-styles-data";
import Tree, { ITree } from "@/database/treeSchema";
import { treeHealthColors } from "../newTreeForm/tree-form-data";

interface Decimal128WithProperty {
  $numberDecimal: string;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getSpeciesAbbreviation = (species: string) => {
  switch (species) {
    case "Valley Oak":
      return "VO";
    case "Coast Live Oak":
      return "CLO";
    case "Blue Oak":
      return "BO";
    default:
      return "ERR";
  }
};

const getSpeciesColors = (species: string) => {
  switch (species) {
    case "Valley Oak":
      return {
        bgColor: COLORS.RobinsEgg,
        color: COLORS.Steel,
      };
    case "Coast Live Oak":
      return {
        bgColor: COLORS.Sky,
        color: COLORS.Charcoal,
      };
    case "Blue Oak":
      return {
        bgColor: COLORS.Steel,
        color: COLORS.PureWhite,
      };
    default:
      return {
        bgColor: COLORS.PureWhite,
        color: COLORS.PureWhite,
      };
  }
};

const getSpeciesAbbreviation = (species: string) => {
  switch (species) {
    case "Valley Oak":
      return "VO";
    case "Coast Live Oak":
      return "CLO";
    case "Blue Oak":
      return "BO";
    default:
      return "ERR";
  }
};

const getSpeciesColors = (species: string) => {
  switch (species) {
    case "Valley Oak":
      return {
        bgColor: COLORS.RobinsEgg,
        color: COLORS.Steel,
      };
    case "Coast Live Oak":
      return {
        bgColor: COLORS.Sky,
        color: COLORS.Charcoal,
      };
    case "Blue Oak":
      return {
        bgColor: COLORS.Steel,
        color: COLORS.PureWhite,
      };
    default:
      return {
        bgColor: COLORS.PureWhite,
        color: COLORS.PureWhite,
      };
  }
};

function AdminDashboard() {
  const user = useUser();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [treeData, setTreeData] = useState<ITree[]>([]);
  const [treesLoggedYear, setTreesLoggedYear] = useState<number>(0);
  const [treesLastMonth, setTreesLastMonth] = useState<number>(0);
  const [treesThisMonth, setTreesThisMonth] = useState<number>(0);
  const [worst3Trees, setWorst3Trees] = useState<Array<ITree>>([]);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchTreeCount = async () => {
      const response = await fetch("/api/tree");
    const fetchTreeCount = async () => {
      const response = await fetch("/api/tree");
      if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
      }
      const trees: Array<ITree> = await response.json();
      setTreeData(trees);
      setTreeData(trees);
      trees.forEach((tree: ITree) => {
        const treeDateLogged = new Date(tree.dateCollected);
        if (treeDateLogged.getFullYear() == currentYear) {
          const treeMonthLogged = treeDateLogged.getMonth();
          if (treeMonthLogged == currentMonth) {
            setTreesThisMonth((prevCount) => prevCount + 1);
          } else if (treeMonthLogged == currentMonth - 1) {
            setTreesLastMonth((prevCount) => prevCount + 1);
          }
          setTreesLoggedYear((prevCount) => prevCount + 1);
        }
      });
    };
    fetchTreeCount().catch(console.error);
  }, []);

  useEffect(() => {
    const fetchWorstTrees = async () => {
      const response = await fetch("/api/tree");
      if (!response.ok) {
        throw new Error(`HTTP ERROR Status:${response.status}`);
      }
      const trees: Array<ITree> = await response.json();
      trees.forEach((tree) => {
        // console.log(tree.treeQuality);
        // console.log(typeof tree.treeQuality);
      });
      // console.log(typeof trees[0]);
      // console.log(trees[0].treeQuality ? parseFloat(trees[0].treeQuality) : 11);
      trees.sort((a, b) => parseFloat(a.treeQuality.toString()) - parseFloat(b.treeQuality.toString()));

      setWorst3Trees([trees[0], trees[1], trees[2]]);
    };
    fetchWorstTrees().catch(console.error);
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <Box>
    <Box>
      {isClient ? (
        <Box>
        <Box>
          <BrowserView>
            <Box bg="#F4F1E8" display="flex" justifyContent="center" alignItems="center">
            <Box bg="#F4F1E8" display="flex" justifyContent="center" alignItems="center">
              <Grid
                templateRows={{ base: "auto auto auto auto", md: "repeat(9, 1fr)" }}
                templateRows={{ base: "auto auto auto auto", md: "repeat(9, 1fr)" }}
                templateColumns={{ base: "1fr", md: "repeat(8, 1fr)" }}
                gap={4}
                borderWidth={"4"}
                borderColor={"red"}
                borderWidth={"4"}
                borderColor={"red"}
              >
                {/* Welcome Message */}
                <GridItem colSpan={{ base: 1, md: 8 }} rowSpan={1} display="flex" alignItems="center">
                  <Text fontSize="3xl" fontWeight="bold" color="#596334">
                    Welcome back, {user.user ? user.user.firstName : "User"}!
                  </Text>
                </GridItem>

                {/* Trees Logged This Year */}
                <GridItem rowSpan={{ base: 1, md: 3 }} colSpan={{ base: 1, md: 2 }}>
                  <Box {...BoxItem} height="100%" p={{ base: 5, md: 10 }}>
                    <HStack>
                      <Text color="#333333" fontSize="1.25rem">
                        Trees Logged This Year
                      </Text>
                      <Link href="/treeTable" ml="auto">
                        <ArrowUpRight />
                      </Link>
                    </HStack>
                    <Text mt={5} mb={5} fontWeight="bold" color="#596334" fontSize="7xl">
                      {treesLoggedYear}
                    </Text>
                    <Text color="#333333">
                      {treesThisMonth > treesLastMonth
                        ? treesLastMonth != 0
                          ? ((treesThisMonth / treesLastMonth - 1) * 100).toFixed(2)
                          : 100
                        : "No "}
                      % incr from
                      {" " + MONTHS[currentMonth - 1]}
                    </Text>
                  </Box>
                </GridItem>

                {/* Trees in Poor Condition */}
                <GridItem rowSpan={{ base: 2, md: 4 }} colSpan={{ base: 1, md: 6 }}>
                <GridItem rowSpan={{ base: 2, md: 4 }} colSpan={{ base: 1, md: 6 }}>
                  <Box {...BoxItem} height="100%" p={{ base: 5, md: 10 }}>
                    <HStack>
                      <Text color="#333333" fontSize="1.25rem">
                        Trees in Poor Condition
                      </Text>
                      <Link href="/treeTable" ml="auto">
                        <ArrowUpRight />
                      </Link>
                    </HStack>
                    <Box borderRadius="20px" overflow="hidden" border="1px solid" borderColor="#596334" mt={10}>
                      <Table size="sm" variant="simple">
                        <Thead bg="#DFED98">
                          <Tr h="40px">
                            <Th width="20%">Tree ID</Th>
                            <Th width="20%">Species</Th>
                            <Th width="20%">Condition</Th>
                            <Th width="20%">Date Recorded</Th>
                            <Th width="20%" justifyItems="center">
                              Volunteer
                            </Th>
                            <Th width="20%" justifyItems="center">
                              Volunteer
                            </Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {worst3Trees.map((tree) =>
                            tree ? (
                              <Tr key={tree._id}>
                                <Td>{tree._id}</Td>
                                <Td>
                                  <Box
                                    {...IconStyle}
                                    color={getSpeciesColors(tree.species).color}
                                    background={getSpeciesColors(tree.species).bgColor}
                                  >
                                    {getSpeciesAbbreviation(tree.species)}
                                  </Box>
                                </Td>
                                <Td>
                                  <Box
                                    {...IconStyle}
                                    backgroundColor={
                                      treeHealthColors[
                                        parseFloat(tree.treeQuality ? tree.treeQuality.toString() : "0")
                                      ][0]
                                    }
                                    color={
                                      treeHealthColors[
                                        parseFloat(tree.treeQuality ? tree.treeQuality.toString() : "0")
                                      ][1]
                                    }
                                  >
                                    {parseFloat(tree.treeQuality ? tree.treeQuality.toString() : "0")}
                                  </Box>
                                </Td>
                                <Td>{new Date(tree.dateCollected).toLocaleDateString()}</Td>
                                <Td>{tree.collectorName}</Td>
                              </Tr>
                            ) : (
                              <></>
                            ),
                          )}
                        </Tbody>
                      </Table>
                    </Box>
                  </Box>
                </GridItem>

                {/* Create New Announcement Button */}
                <GridItem rowSpan={1} colSpan={{ base: 1, md: 2 }}>
                  <Box display="flex" justifyContent="center" {...BoxItem} height="100%">
                    <Button
                      display={"flex"}
                      justifyContent={"space-between"}
                      paddingLeft="1rem"
                      paddingRight="5px"
                      width="85%"
                      maxWidth="300px"
                      height="50px"
                      color="white"
                      bg="#E57300"
                      borderRadius="20rem"
                      fontWeight="bold"
                      fontSize="sm"
                      onClick={() => router.push("/createAnnouncement")}
                    >
                      Create new announcement&nbsp;
                      <Box
                        display={"flex"}
                        width="40px"
                        height="40px"
                        borderRadius="20rem"
                        bg={COLORS.PureWhite}
                        justifyContent="center"
                        alignItems="center"
                        color="#E57300"
                      >
                        <SquarePen />
                      </Box>
                    </Button>
                  </Box>
                </GridItem>

                {/* Map */}
                <GridItem rowSpan={{ base: 2, md: 4 }} colSpan={{ base: 1, md: 8 }} data-testid="map_id">
                  <Map trees={treeData} />
                </GridItem>
              </Grid>
            </Box>
          </BrowserView>

          <MobileView>
            {/* add tree icon */}
            <Box width="100%" height="100%" p={{ base: "20px", md: "0 50px 50px 50px" }} pt="0px">
              <Grid
                width="100%"
                height="100%"
                templateRows={{ base: "auto auto auto auto", md: "repeat(10, 1fr)" }}
                templateColumns={{ base: "1fr", md: "repeat(8, 1fr)" }}
                gap={4}
                mt={5}
              >
                <Text fontSize="3xl" fontWeight="bold" color="#596334">
                  Welcome back, {user.user ? user.user.firstName : "User"}!
                </Text>
                <Text fontSize="3xl" fontWeight="bold" color="#596334">
                  Welcome back, {user.user ? user.user.firstName : "User"}!
                </Text>

                <Flex justifyContent={"space-between"} mt={5}>
                  {/* Trees Logged This Year */}
                  <GridItem width="50%" m={1} height={165}>
                    <Box {...BoxItem} height="100%" p={{ base: 2, md: 2 }}>
                      <Text ml={2} fontWeight="bold" color="#596334" fontSize="4xl">
                        {treesLoggedYear}
                        {treesLoggedYear}
                      </Text>
                      <Text ml={2} color="#333333">
                        Trees Logged This Year
                      </Text>
                      <Text mt={2} ml={2} color="#596334">
                        % incr from 2024
                      </Text>
                    </Box>
                  </GridItem>

                  {/* Trees in Poor Condition 165*/}
                  <GridItem width="50%" m={1} height={165}>
                    <Box {...BoxItem} height="100%" p={{ base: 2, md: 2 }}>
                      <Text ml={2} fontWeight="bold" color="#596334" fontSize="4xl">
                        5
                      </Text>
                      <Text ml={2} color="#333333">
                        Trees in Poor Condition
                      </Text>
                      <Flex mt={2} justifyContent={"space-evenly"}>
                        <Box {...ConditionMobile} bg={"#A41D00"}>
                          1
                        </Box>
                        <Box {...ConditionMobile} bg={"#BC4201"}>
                          2
                        </Box>
                        <Box {...ConditionMobile} bg={"#ED8426"}>
                          3
                        </Box>
                      </Flex>
                    </Box>
                  </GridItem>
                </Flex>

                {/* Create New Announcement Button */}
                <GridItem rowSpan={1} colSpan={{ base: 1, md: 3 }}>
                  <Box mt={5} display="flex" justifyContent="center" {...BoxItem} height={100}>
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

                {/* Create New Announcement Button */}
                <GridItem rowSpan={1} colSpan={{ base: 1, md: 3 }}>
                  <Box mt={5} display="flex" justifyContent="center" {...BoxItem} height={100}>
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
                <GridItem height={250} data-testid="map_id">
                  <Text fontSize="2xl" mb={5} fontWeight={"bold"}>
                    Map
                  </Text>
                  <Map trees={treeData} />
                </GridItem>
              </Grid>
            </Box>
          </MobileView>
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
}

export default AdminDashboard;
