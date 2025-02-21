"use client";
import React, { useState } from "react";
import {
  Box,
  Input,
  Textarea,
  Button,
  Select,
  VStack,
  Heading,
  Flex,
  Text,
  Image,
  InputProps,
  HStack,
  Show,
} from "@chakra-ui/react";
import {
  treeTypes,
  treeIssues,
  treeHealthColors,
  TreeIssue,
  TreeType,
  TreeSpecsData,
  FormValues,
} from "./tree-form-data";
import { COLORS } from "@/styles/color-styles-data";
import { LuNotebookPen } from "react-icons/lu";
import { FaRegCircleCheck } from "react-icons/fa6";

export default function TreeEntryForm() {
  const TreeFormLabel = (props: InputProps) => <Text fontSize="16px" marginTop="20px" marginBottom="10px" {...props} />;

  const TreeFormInput = (props: InputProps) => (
    <Input bg={COLORS.Cream} color={COLORS.Olive} _placeholder={{ color: "inherit" }} {...props} />
  );

  const TreeFormSection = (props: InputProps) => (
    <Box borderWidth="1px" borderColor={COLORS.Olive} borderRadius="16px" p="24px" w="90%" {...props} />
  );

  const TreeFormSectionTitle = (props: InputProps) => <Heading color={COLORS.Olive} size="md" {...props} />;

  const [formData, setFormData] = useState<FormValues>({
    treeType: treeTypes[0],
    treeSpecs: {},
  });

  const [treeSpecsData, setTreeSpecsData] = useState<TreeSpecsData>({
    treeHeight: "",
    canopySpread: "",
    trunkDBH: "",
  });

  const [treeTypeData, setTreeTypeData] = useState<TreeType | null>(null);

  const [treeHealthData, setTreeHealthData] = useState<number | null>(null);

  const [treeIssuesData, setTreeIssuesData] = useState<Array<TreeIssue>>([]);

  const [treeHeight, setTreeHeight] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name);
    console.log(value);
    setTreeHeight(value);
  };

  const handleSubmit = (e) => {
    console.log("Submitted");
  };

  return (
    <Box p={6} maxW="600px" mx="auto" boxShadow="md" borderRadius="md" bg={COLORS.PureWhite}>
      <Heading mb={4}>Tell us about this tree!</Heading>
      <VStack spacing={4} as="form" onSubmit={handleSubmit}>
        <TreeFormSection>
          <TreeFormSectionTitle marginBottom="20px">Tree Type</TreeFormSectionTitle>
          <Flex justify="left" gap="4">
            <Button
              borderRadius="1rem"
              backgroundColor={COLORS.RobinsEgg}
              color={COLORS.Steel}
              onClick={() => setTreeTypeData("Valley Oak")}
              disabled={treeTypeData == "Valley Oak" ? true : false}
            >
              Valley Oak
            </Button>
            <Button
              borderRadius="1rem"
              backgroundColor={COLORS.Sky}
              color={COLORS.Charcoal}
              onClick={() => setTreeTypeData("Coast Live Oak")}
              disabled={treeTypeData == "Coast Live Oak" ? true : false}
            >
              Coast Live Oak
            </Button>
            <Button
              borderRadius="1rem"
              backgroundColor={COLORS.Steel}
              color={COLORS.PureWhite}
              onClick={() => setTreeTypeData("Blue Oak")}
              disabled={treeTypeData == "Blue Oak" ? true : false}
            >
              Blue Oak
            </Button>
          </Flex>
        </TreeFormSection>
        <TreeFormSection>
          <TreeFormSectionTitle>Tree Specs</TreeFormSectionTitle>
          <Box>
            <TreeFormLabel>Tree Height</TreeFormLabel>
            <TreeFormInput
              name="treeHeight"
              value={treeHeight}
              placeholder="input a number"
              onChange={handleInputChange}
            />
          </Box>
          <Box>
            <TreeFormLabel>Canopy Spread</TreeFormLabel>
            <TreeFormInput placeholder="input a number"></TreeFormInput>
          </Box>
          <Box>
            <TreeFormLabel>Trunk DBH</TreeFormLabel>
            <TreeFormInput placeholder="type here..."></TreeFormInput>
          </Box>
        </TreeFormSection>
        <TreeFormSection>
          <TreeFormSectionTitle>Tree Health</TreeFormSectionTitle>
          <Box>
            <TreeFormLabel>How would your rate the overall tree health?</TreeFormLabel>
            <Flex gap="3" justify="left">
              {[...Array.from(Array(10).keys())].reverse().map((n) => (
                <Button
                  key={n}
                  backgroundColor={treeHealthColors[n][0]}
                  color={treeHealthColors[n][1]}
                  size="sm"
                  w="2rem"
                  h="1.8rem"
                  borderRadius="0.5rem"
                  padding="0.2rem"
                  fontSize="18px"
                  disabled={treeHealthData == n ? true : false}
                  onClick={() => setTreeHealthData(n)}
                >
                  {n + 1}
                </Button>
              ))}
            </Flex>
          </Box>
          <Box>
            <TreeFormLabel>Identify issues present in your tree.</TreeFormLabel>
          </Box>
          <Box gap="4" justifyContent="center">
            {treeIssues.map((issue) => (
              <Button
                margin="0.5rem"
                w="12rem"
                h="12rem"
                key={issue}
                borderWidth="4px"
                borderColor={treeIssuesData.includes(issue) ? COLORS.Moss : COLORS.PureWhite}
                onClick={() => {
                  if (!treeIssuesData.includes(issue)) {
                    setTreeIssuesData([...treeIssuesData, issue]);
                  } else {
                    setTreeIssuesData(treeIssuesData.filter((treeIssue) => treeIssue != issue));
                  }
                }}
              >
                <Image
                  borderRadius="inherit"
                  src={"/TreeIssues/" + issue + ".png"}
                  alt={issue}
                  pos="absolute"
                  fit="cover"
                  w="100%"
                  h="100%"
                />
                <Text pos="absolute" top="0.5rem" left="0.5rem" color={COLORS.PureWhite}>
                  {issue}
                </Text>
                {treeIssuesData.includes(issue) && (
                  <Box pos="absolute" bottom="0.25rem" right="0.25rem">
                    <FaRegCircleCheck color={COLORS.Moss} w="2rem" />
                  </Box>
                )}
              </Button>
            ))}
          </Box>
        </TreeFormSection>
        <TreeFormSection>
          <HStack gap="3">
            <TreeFormSectionTitle>Field Notes</TreeFormSectionTitle>
            <LuNotebookPen color={COLORS.Olive} size="1.3rem" />
          </HStack>
          <Box>
            <TreeFormLabel>Any additional observations or thoughts?</TreeFormLabel>
            <Textarea
              placeholder="type here..."
              bg={COLORS.Cream}
              color={COLORS.Olive}
              h="16rem"
              _placeholder={{ color: "inherit" }}
              borderRadius="1rem"
            ></Textarea>
          </Box>
        </TreeFormSection>
        <Button type="submit" backgroundColor={COLORS.Olive} color={COLORS.PureWhite} borderRadius="5rem">
          Submit
        </Button>

        <Button type="submit" colorScheme="blue">
          Submit
        </Button>
      </VStack>
    </Box>
  );
}
