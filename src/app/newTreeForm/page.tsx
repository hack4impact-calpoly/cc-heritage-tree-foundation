"use client";
import React, { useState } from "react";
import {
  Box,
  Input,
  Textarea,
  Button,
  VStack,
  Heading,
  Flex,
  Text,
  Image,
  HStack,
  FormControl,
  chakra,
  FormLabel,
} from "@chakra-ui/react";
import { treeIssues, treeHealthColors, TreeIssue, TreeType, FormValues, TREE_TYPE_DATA } from "./tree-form-data";
import { COLORS } from "@/styles/color-styles-data";
import { LuNotebookPen } from "react-icons/lu";
import { FaRegCircleCheck } from "react-icons/fa6";

const TreeFormSection = chakra(FormControl, {
  baseStyle: {
    borderWidth: "1px",
    borderColor: COLORS.Olive,
    borderRadius: "16px",
    p: "24px",
    w: "90%",
  },
});

const TreeFormInput = chakra(Input, {
  baseStyle: {
    bg: COLORS.Cream,
    color: COLORS.Olive,
    _placeholder: { color: "inherit" },
  },
});

const TreeFormLabel = chakra(FormLabel, {
  baseStyle: {
    marginTop: "20px",
    marginBottom: "10px",
  },
});

const TreeFormHeading = chakra(Heading, {
  baseStyle: {
    color: COLORS.Olive,
  },
});

const disabledStyle = {
  backgroundColor: COLORS.Charcoal,
  color: COLORS.PureWhite,
  _hover: {
    backgroundColor: COLORS.Charcoal,
    cursor: "not-allowed",
  },
};

export default function TreeEntryForm() {
  const [formData, setFormData] = useState<FormValues>({
    treeType: "",
    treeSpecs: {
      treeHeight: 0,
      canopySpread: 0,
      trunkDBH: "",
    },
    treeHealth: 0,
    treeIssues: [],
    fieldNotes: "",
  });

  const handleTreeType = (e: React.MouseEvent<HTMLButtonElement>) => {
    const treeType = e.currentTarget.getAttribute("name") as TreeType;
    setFormData((prev) => ({
      ...prev,
      treeType,
    }));
  };

  const handleTreeSpecs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      treeSpecs: {
        ...prev.treeSpecs,
        [name]: value,
      },
    }));
  };

  const handleTreeHealth = (e: React.MouseEvent<HTMLButtonElement>) => {
    const treeHealth = Number(e.currentTarget.getAttribute("value")) + 1;
    setFormData((prev) => ({
      ...prev,
      treeHealth,
    }));
  };

  const handleTreeIssues = (e: React.MouseEvent<HTMLButtonElement>) => {
    const treeIssue = e.currentTarget.getAttribute("name") as TreeIssue;
    let newIssues: Array<TreeIssue> = formData.treeIssues;
    if (formData.treeIssues.includes(treeIssue)) {
      newIssues = newIssues.filter((issue) => issue != treeIssue);
    } else {
      newIssues = [...newIssues, treeIssue];
    }
    setFormData((prev) => ({
      ...prev,
      treeIssues: newIssues,
    }));
  };

  const handleFieldNotes = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const fieldNotes = e.target.value;
    setFormData((prev) => ({
      ...prev,
      fieldNotes,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLDivElement>) => {
    event.preventDefault();
    console.log(formData);
  };

  return (
    <Box p={6} maxW="600px" mx="auto" boxShadow="md" borderRadius="md" bg={COLORS.PureWhite}>
      <Heading mb={4} justifySelf="center" margin="3rem">
        Tell us about this tree!
      </Heading>
      <VStack spacing={4} as="form" onSubmit={handleSubmit}>
        <TreeFormSection isRequired>
          <TreeFormHeading id="treeSpecies" style={{ fontSize: "24px" }} marginBottom="20px">
            Tree Type
          </TreeFormHeading>
          <Flex role="group" aria-labelledby="treeSpecies" justify="left" gap="4">
            {TREE_TYPE_DATA.map((data) => (
              <Button
                key={data.species}
                name={data.species}
                borderRadius="1rem"
                backgroundColor={data.bgColor}
                color={data.color}
                onClick={handleTreeType}
                disabled={formData.treeType == data.species}
                _disabled={disabledStyle}
              >
                {data.species}
              </Button>
            ))}
          </Flex>
        </TreeFormSection>
        <TreeFormSection isRequired>
          <TreeFormHeading style={{ fontSize: "24px" }}>Tree Specs</TreeFormHeading>
          <Box>
            <TreeFormLabel htmlFor="treeHeight" requiredIndicator>
              Tree Height
            </TreeFormLabel>
            <TreeFormInput
              id="treeHeight"
              type="number"
              name="treeHeight"
              value={formData.treeSpecs.treeHeight == 0 ? "" : formData.treeSpecs.treeHeight}
              placeholder="input a number"
              onChange={handleTreeSpecs}
            />
          </Box>
          <Box>
            <TreeFormLabel htmlFor="canopySpread" requiredIndicator>
              Canopy Spread
            </TreeFormLabel>
            <TreeFormInput
              id="canopySpread"
              type="number"
              name="canopySpread"
              value={formData.treeSpecs.canopySpread == 0 ? "" : formData.treeSpecs.canopySpread}
              placeholder="input a number"
              onChange={handleTreeSpecs}
            />
          </Box>
          <Box>
            <TreeFormLabel htmlFor="trunkDBH" requiredIndicator>
              Trunk DBH
            </TreeFormLabel>
            <TreeFormInput
              id="trunkDBH"
              type="text"
              name="trunkDBH"
              value={formData.treeSpecs.trunkDBH}
              placeholder="type here..."
              onChange={handleTreeSpecs}
            />
          </Box>
        </TreeFormSection>
        <TreeFormSection>
          <TreeFormHeading style={{ fontSize: "24px" }}>Tree Health</TreeFormHeading>
          <Box>
            <TreeFormLabel htmlFor="treeHealth">How would you rate the overall tree health?</TreeFormLabel>
            <Flex id="treeHealth" gap="3" justify="left">
              {[...Array.from(Array(10).keys())].reverse().map((n) => (
                <Button
                  key={n}
                  value={n}
                  backgroundColor={treeHealthColors[n][0]}
                  color={treeHealthColors[n][1]}
                  size="sm"
                  w="2rem"
                  h="1.8rem"
                  borderRadius="0.5rem"
                  padding="0.2rem"
                  fontSize="18px"
                  disabled={formData.treeHealth == n + 1}
                  onClick={handleTreeHealth}
                  _disabled={disabledStyle}
                >
                  {n + 1}
                </Button>
              ))}
            </Flex>
          </Box>
          <Box>
            <TreeFormLabel htmlFor="treeIssues">Identify issues present in your tree.</TreeFormLabel>
          </Box>
          <Box id="treeIssues" gap="4" justifyContent="center">
            {treeIssues.map((issue) => (
              <Button
                key={issue}
                name={issue}
                margin="0.5rem"
                w="12rem"
                h="12rem"
                borderWidth="4px"
                borderColor={formData.treeIssues.includes(issue) ? COLORS.Moss : COLORS.PureWhite}
                borderRadius="7%"
                onClick={handleTreeIssues}
              >
                <Image
                  borderRadius="inherit"
                  src={"/TreeIssues/" + issue + ".png"}
                  alt={issue}
                  aria-hidden="true"
                  pos="absolute"
                  fit="cover"
                  w="100%"
                  h="100%"
                />
                <Text
                  pos="absolute"
                  top="0.5rem"
                  left="0.5rem"
                  color={COLORS.PureWhite}
                  whiteSpace="normal"
                  align="left"
                >
                  {issue}
                </Text>
                {formData.treeIssues.includes(issue) && (
                  <Box pos="absolute" bottom="0.25rem" right="0.25rem">
                    <FaRegCircleCheck color={COLORS.Moss} width="2rem" data-testid={`icon-${issue}`} />
                  </Box>
                )}
              </Button>
            ))}
          </Box>
        </TreeFormSection>
        <TreeFormSection>
          <HStack gap="3">
            <TreeFormHeading style={{ fontSize: "24px" }}>Field Notes</TreeFormHeading>
            <LuNotebookPen color={COLORS.Olive} size="1.3rem" data-testid="icon-Field notes" />
          </HStack>
          <Box>
            <TreeFormLabel htmlFor="fieldNotes">Any additional observations or thoughts?</TreeFormLabel>
            <Textarea
              id="fieldNotes"
              name="fieldNotes"
              placeholder="type here..."
              value={formData.fieldNotes}
              bg={COLORS.Cream}
              color={COLORS.Olive}
              h="16rem"
              _placeholder={{ color: "inherit" }}
              borderRadius="1rem"
              onChange={handleFieldNotes}
            ></Textarea>
          </Box>
        </TreeFormSection>
        <Button type="submit" backgroundColor={COLORS.Olive} color={COLORS.PureWhite} borderRadius="5rem">
          Submit
        </Button>
      </VStack>
    </Box>
  );
}
