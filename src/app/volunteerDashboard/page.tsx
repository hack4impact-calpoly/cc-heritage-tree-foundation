import { Box, Grid, GridItem, Text, Button, HStack, VStack, Link, IconButton } from "@chakra-ui/react";
import { Plus, ArrowUpRight, EllipsisVertical } from "lucide-react";
import Map from "@/components/Map";
export default function VolunteerDashboard() {
  return (
    <Box
      height="100%"
      width="100%"
      maxWidth="100%"
      bg="#F4F1E8"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Grid
        templateRows={["auto auto"]}
        templateColumns={["1fr", "1fr", "1fr", "435px 700px"]}
        gap={4}
        my={10}
        mx={"50px"}
      >
        {/*Hello Message*/}
        <GridItem colSpan={2}>
          <Box>
            <Text fontSize="38px" color="#333" fontWeight={"600"}>
              {/*Dummy data*/}
              Hello Jane 👋
            </Text>
            <Text fontSize="16px" color="#333" fontWeight={"400"}>
              Thank you so much for your effort, let&#39;s do this!
            </Text>
          </Box>
        </GridItem>
        {/*Tree Logs*/}
        <GridItem h="auto" minWidth="250px" minHeight="150px">
          <Box w="100%" borderRadius="16px" bg="white" p="24px">
            <HStack position={"relative"}>
              <Button h={50} bg="#596334" px="14px" py="8px" borderRadius="12px">
                <Box
                  w="28px"
                  h="28px"
                  borderRadius="100px"
                  bg="#F4F1E8"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Plus color="#596334" />
                </Box>
                <Text ml="10px" color="#F4F1E8" fontSize="16px">
                  Add Tree
                </Text>
              </Button>
              <Link href="" position="absolute" top="0px" right="0px">
                <ArrowUpRight color="#333333" />
              </Link>
            </HStack>
            <Text marginTop="24px" marginBottom="16px" fontSize="24px" fontWeight="600" color="#333333">
              Trees Logged
            </Text>
            <Grid templateColumns={["1fr", "1fr", "1fr 1fr"]} gap="24px">
              <Box bg="#DFED98" borderRadius="12px" padding="20px">
                <VStack spacing="0px">
                  <Text w="100%" color="#596334" fontSize="18px" fontWeight="600">
                    You&#39;ve logged
                  </Text>
                  <HStack>
                    <Text color="#596334" fontSize="48px" fontWeight="600">
                      25
                    </Text>
                    <Text color="#596334" fontSize="18px" fontWeight="600">
                      trees
                    </Text>
                  </HStack>
                </VStack>
              </Box>
              <Box borderRadius="12px" border="3px solid #647038" padding="20px">
                <VStack spacing="0px">
                  <Text w="100%" color="#596334" fontSize="18px" fontWeight="600">
                    Total logged
                  </Text>
                  <HStack>
                    <Text color="#596334" fontSize="48px" fontWeight="600">
                      175
                    </Text>
                    <Text color="#596334" fontSize="18px" fontWeight="600">
                      trees
                    </Text>
                  </HStack>
                </VStack>
              </Box>
            </Grid>
          </Box>
        </GridItem>
        {/*Map*/}
        <GridItem rowSpan={2} bg="white" borderRadius="16px" display="flex" justifyContent="center" alignItems="center">
          <Map />
        </GridItem>
        {/*Announcements*/}
        <GridItem h="auto" minWidth="250px" minHeight="150px">
          <Box w="100%" borderRadius="16px" bg="#596334" p="24px">
            <VStack spacing={15}>
              <HStack position={"relative"} w="100%">
                <Text color="#F4F1E8" fontSize="24px" fontWeight="600">
                  Annoucements
                </Text>
                <Link href="" position="absolute" top="0px" right="0px">
                  <ArrowUpRight color="#F4F1E8" />
                </Link>
              </HStack>
              <Box w="100%" bg="#F8F8F8" borderRadius="12px" py="16px" px="8px">
                <HStack position={"relative"} w="100%">
                  <Box bg="#D9D9D9" w="42px" h="42px" borderRadius="full" flexShrink={0}></Box>
                  <Text color="#000000" fontSize="16px" fontWeight="400" marginRight={10}>
                    Hello Volunteers! Please check your emails for updates from CCHTF
                  </Text>
                  <IconButton aria-label="More options" variant={"ghost"} position={"absolute"} right="0px">
                    <EllipsisVertical color="#333333" />
                  </IconButton>
                </HStack>
              </Box>
              <Box w="100%" bg="#F8F8F8" borderRadius="12px" py="16px" px="8px">
                <HStack position={"relative"}>
                  <Box bg="#D9D9D9" w="42px" h="42px" borderRadius="full" flexShrink={0}></Box>
                  <Text color="#000000" fontSize="16px" fontWeight="400" marginRight={10}>
                    You&#39;ve logged 25 trees 🎉🎉 Thank you so much for your hard work!
                  </Text>
                  <IconButton aria-label="More options" variant={"ghost"} position={"absolute"} right="0px">
                    <EllipsisVertical color="#333333" />
                  </IconButton>
                </HStack>
              </Box>
              <Box w="100%" bg="#F8F8F8" borderRadius="12px" py="16px" px="8px">
                <HStack position={"relative"}>
                  <Box bg="#D9D9D9" w="42px" h="42px" borderRadius="full" flexShrink={0}></Box>
                  <Text color="#000000" fontSize="16px" fontWeight="400" marginRight={10}>
                    Message here!
                  </Text>
                  <IconButton aria-label="More options" variant={"ghost"} position={"absolute"} right="0px">
                    <EllipsisVertical color="#333333" />
                  </IconButton>
                </HStack>
              </Box>
              <Text color="#DFED98" fontSize="16px" fontWeight="400">
                No other messages
              </Text>
            </VStack>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
}
