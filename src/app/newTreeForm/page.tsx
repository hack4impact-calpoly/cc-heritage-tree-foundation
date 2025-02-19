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
import { treeTypes, treeIssues, treeHealthColors } from "./tree-form-data";
import { COLORS } from "@/styles/color-styles-data";
import { LuNotebookPen } from "react-icons/lu";
import { CiCircleCheck } from "react-icons/ci";

export default function TreeEntryForm() {
  type TreeFormData = {
    treeName: string;
    species: string;
    location: string;
    description: string;
    treeCondition: string;
    photo: File | null;
  };

  const [formData, setFormData] = useState<TreeFormData>({
    treeName: "",
    species: "",
    location: "",
    description: "",
    treeCondition: "",
    photo: null,
  });

  const TreeFormLabel = (props: InputProps) => <Text fontSize="16px" marginTop="20px" marginBottom="10px" {...props} />;

  const TreeFormInput = (props: InputProps) => (
    <Input bg={COLORS.Cream} color={COLORS.Olive} _placeholder={{ color: "inherit" }} {...props} />
  );

  const TreeFormSection = (props: InputProps) => (
    <Box borderWidth="1px" borderColor={COLORS.Olive} borderRadius="16px" p="24px" w="90%" {...props} />
  );

  const TreeFormSectionTitle = (props: InputProps) => <Heading color={COLORS.Olive} size="md" {...props} />;

  const [treeIssuesData, setTreeIssuesData] = useState<Array<string>>([]);

  const [submittedData, setSubmittedData] = useState<TreeFormData | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        photo: e.target.files![0],
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedData(formData);
  };

  return (
    <Box p={6} maxW="600px" mx="auto" boxShadow="md" borderRadius="md" bg={COLORS.PureWhite}>
      <Heading mb={4}>Tell us about this tree!</Heading>
      <VStack spacing={4} as="form" onSubmit={handleSubmit}>
        <TreeFormSection>
          <TreeFormSectionTitle marginBottom="20px">Tree Type</TreeFormSectionTitle>
          <Flex justify="left" gap="4">
            <Button borderRadius="1rem" backgroundColor={COLORS.RobinsEgg} color={COLORS.Steel}>
              Valley Oak
            </Button>
            <Button borderRadius="1rem" backgroundColor={COLORS.Sky} color={COLORS.Charcoal}>
              Coast Live Oak
            </Button>
            <Button borderRadius="1rem" backgroundColor={COLORS.Steel} color={COLORS.PureWhite}>
              Blue Oak
            </Button>
          </Flex>
        </TreeFormSection>
        <TreeFormSection>
          <TreeFormSectionTitle>Tree Specs</TreeFormSectionTitle>
          <Box>
            <TreeFormLabel>Tree Height</TreeFormLabel>
            <TreeFormInput placeholder="input a number"></TreeFormInput>
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
                >
                  {n + 1}
                </Button>
              ))}
            </Flex>
          </Box>
          <Box>
            <TreeFormLabel>Identify issues present in your tree.</TreeFormLabel>
          </Box>
          {treeIssues.map((issue) => (
            <Button
              key={issue}
              borderWidth="4px"
              borderColor={treeIssuesData.includes(issue) ? COLORS.Moss : "transparent"}
              onClick={() => {
                if (!treeIssuesData.includes(issue)) {
                  setTreeIssuesData([...treeIssuesData, issue]);
                } else {
                  setTreeIssuesData(treeIssuesData.filter((treeIssue) => treeIssue != issue));
                }
              }}
            >
              <Text>{issue}</Text>
              <Image alt={issue}></Image>
              {treeIssuesData.includes(issue) && <CiCircleCheck />}
            </Button>
          ))}
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

        <Input placeholder="Tree Name" name="treeName" value={formData.treeName} onChange={handleChange} required />
        <Input placeholder="Species" name="species" value={formData.species} onChange={handleChange} required />
        <Input placeholder="Location" name="location" value={formData.location} onChange={handleChange} required />
        <Textarea
          placeholder="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <Select name="treeCondition" value={formData.treeCondition} onChange={handleChange} required>
          <option value="">Select Condition</option>
          <option value="Healthy">Healthy</option>
          <option value="Fair">Fair</option>
          <option value="Poor">Poor</option>
        </Select>
        <Input type="file" accept="image/*" onChange={handleFileChange} />
        <Button type="submit" colorScheme="blue">
          Submit
        </Button>
      </VStack>

      {submittedData && (
        <Box mt={6} p={4} borderWidth={1} borderRadius="md">
          <Heading size="md">Submitted Data</Heading>
          <p>
            <>Tree Name:</> {submittedData.treeName}
          </p>
          <p>
            <>Species:</> {submittedData.species}
          </p>
          <p>
            <>Location:</> {submittedData.location}
          </p>
          <p>
            <>Description:</> {submittedData.description}
          </p>
          <p>
            <>Condition:</> {submittedData.treeCondition}
          </p>
          {submittedData.photo && (
            <p>
              <>Photo:</> {submittedData.photo.name}
            </p>
          )}
        </Box>
      )}
    </Box>
  );
}
