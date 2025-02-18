"use client";
import React, { useState } from "react";
import { Box, Input, Textarea, Button, Select, VStack, Heading, Flex, Text, Image } from "@chakra-ui/react";
import styles from "@/styles/new-tree-form.module.css";
import { treeTypes, treeIssues, treeHealthColors } from "./tree-form-data";
import { COLORS } from "@/styles/color-styles-data";
import { LuNotebookPen } from "react-icons/lu";

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
    <Box p={6} maxW="600px" mx="auto" boxShadow="md" borderRadius="md" bg="gray.50">
      <Heading mb={4}>Tell us about this tree!</Heading>
      <VStack spacing={4} as="form" onSubmit={handleSubmit}>
        <Box className={styles.treeFormSection}>
          <Heading className={styles.treeFormSectionTitle} size="md">
            Tree Type
          </Heading>
          <Flex justify="center" gap="5">
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
        </Box>
        <Box className={styles.treeFormSection}>
          <Heading size="md" className={styles.treeFormSectionTitle}>
            Tree Specs
          </Heading>
          <Box>
            <Text className={styles.treeFormFieldLabel}>Tree Height</Text>
            <Input placeholder="input a number"></Input>
          </Box>
          <Box>
            <Text className={styles.treeFormFieldLabel}>Canopy Spread</Text>
            <Input placeholder="input a number"></Input>
          </Box>
          <Box>
            <Text className={styles.treeFormFieldLabel}>Trunk DBH</Text>
            <Input placeholder="type here..."></Input>
          </Box>
        </Box>
        <Box className={styles.treeFormSection}>
          <Heading size="md" className={styles.treeFormSectionTitle}>
            Tree Health
          </Heading>
          <Box>
            <Text>How would you rate the overall tree health?</Text>
            <Flex gap="4">
              {[...Array.from(Array(10).keys())].reverse().map((n) => (
                <Button
                  key={n}
                  backgroundColor={treeHealthColors[n][0]}
                  color={treeHealthColors[n][1]}
                  w="8px"
                  h="40px"
                  borderRadius="0.75rem"
                >
                  {n + 1}
                </Button>
              ))}
            </Flex>
          </Box>
          <Box>
            <Text className={styles.treeFormFieldLabel}>Identify issues present in your tree.</Text>
          </Box>
          {treeIssues.map((issue) => (
            <Button key={issue}>
              <Text>{issue}</Text>
              <Image alt={issue}></Image>
            </Button>
          ))}
        </Box>
        <Box className={styles.treeFormSection}>
          <Flex>
            <Heading size="md" className={styles.treeFormSectionTitle}>
              Field Notes
            </Heading>
            <LuNotebookPen color={COLORS.Olive} />
          </Flex>
          <Box>
            <Text>Any additional observations or thoughts?</Text>
          </Box>
        </Box>
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
