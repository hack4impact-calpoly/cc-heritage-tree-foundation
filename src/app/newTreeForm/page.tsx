"use client";
import React, { useState } from "react";
import { Box, Input, Textarea, Button, Select, VStack, Heading } from "@chakra-ui/react";

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
      <Heading mb={4}>Tree Entry Form</Heading>
      <VStack spacing={4} as="form" onSubmit={handleSubmit}>
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
