"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
  CloseButton,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import {
  treeIssues,
  treeHealthColors,
  TreeIssue,
  TreeType,
  FormValues,
  TREE_TYPE_DATA,
} from "../../newTreeForm/tree-form-data";
import { COLORS } from "@/styles/color-styles-data";
import { LuNotebookPen } from "react-icons/lu";
import { FaRegCircleCheck } from "react-icons/fa6";
import { useUser } from "@clerk/nextjs";
import mongoose from "mongoose";

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

export default function EditTreeEntryForm() {
  const params = useParams(); // to get params.treeID
  const { user } = useUser();
  const [selectedImages, setSelectedImages] = useState<Array<File | string>>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormValues>({
    treeLocation: "",
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

  // when page reloads
  useEffect(() => {
    // get specific tree data from the form
    const getTreeData = async () => {
      try {
        const response = await fetch(`/api/tree/${params.treeID}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const treeInfo = await response.json();
        console.log("Response Text: " + treeInfo);

        if (response.ok) {
          console.log(treeInfo.treeQuality, treeInfo.canopyBreadth);
          console.log("Specific tree data retreived successfully!");
          setFormData({
            treeLocation:
              treeInfo.gpsCoordinates[0] && treeInfo.gpsCoordinates[1]
                ? `(${treeInfo.gpsCoordinates[0]["$numberDecimal"]}, ${treeInfo.gpsCoordinates[1]["$numberDecimal"]})`
                : "",
            treeType: treeInfo.species ? treeInfo.species : "",
            treeSpecs: {
              treeHeight: treeInfo.treeHeight ? treeInfo.treeHeight.$numberDecimal : 0, // height info not kept
              canopySpread: treeInfo.canopyBreadth["$numberDecimal"] ? treeInfo.canopyBreadth["$numberDecimal"] : "",
              trunkDBH: treeInfo.dbh["$numberDecimal"] ? treeInfo.dbh["$numberDecimal"] : "",
            },
            treeHealth: treeInfo.treeQuality["$numberDecimal"] ? treeInfo.treeQuality["$numberDecimal"] : "",
            treeIssues: treeInfo.treeCondition ? treeInfo.treeCondition : [],
            fieldNotes: treeInfo.additionalNotes ? treeInfo.additionalNotes : "",
          });
          setSelectedImages(treeInfo.photo);
          setImagePreviews(treeInfo.photo);
        } else {
          console.log("Failed to retreive data.");
        }
      } catch (error) {
        console.error("Error retreiving tree data:", error);
      }
    };
    console.log("load data into the formData");
    getTreeData();
  }, [params.treeID]);

  const handleTreeType = (e: React.MouseEvent<HTMLButtonElement>) => {
    const treeType = e.currentTarget.getAttribute("name") as TreeType;
    console.log("Tree type selected: " + treeType);
    setFormData((prev) => ({
      ...prev,
      treeType,
    }));
  };

  const handleTreeLocation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, treeLocation: value }));
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    const maxSize = 5; // MB

    // Filter valid files
    const validFiles = Array.from(files)
      .filter((file) => validTypes.includes(file.type))
      .filter((file) => file.size <= maxSize * 1024 * 1024);

    if (validFiles.length === 0) {
      alert("Only image files (JPEG, PNG, WEBP) under 5MB are allowed.");
      return;
    }

    // Add new files to state
    setSelectedImages((prev) => [...prev, ...validFiles]);

    // Create previews for new files
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index]);

    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validateCoordinates = () => {
    if (!formData.treeLocation.trim()) {
      return { valid: false, error: "Location is required" };
    }

    const coordinatePattern = /^\(?\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*\)?$/;
    const match = formData.treeLocation.match(coordinatePattern);

    if (!match) {
      return { valid: false, error: "Invalid format. Use: (lat, lng)" };
    }

    const [, latStr, lngStr] = match;
    const latitude = parseFloat(latStr);
    const longitude = parseFloat(lngStr);

    if (isNaN(latitude)) {
      return { valid: false, error: "Invalid latitude" };
    }
    if (isNaN(longitude)) {
      return { valid: false, error: "Invalid longitude" };
    }
    if (latitude < -90 || latitude > 90) {
      return { valid: false, error: "Latitude must be between -90 and 90" };
    }
    if (longitude < -180 || longitude > 180) {
      return { valid: false, error: "Longitude must be between -180 and 180" };
    }

    return { valid: true, latitude, longitude };
  };

  const handleSubmit = async (event: React.FormEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (!user) {
      alert("Please log in to submit the form.");
      return;
    }

    const coordMatch = formData.treeLocation.match(/\(?\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*\)?/);
    if (!coordMatch) {
      alert("Please use correct formatting for location");
      return;
    }

    const [latitude, longitude] = coordMatch ? [coordMatch[1], coordMatch[2]] : ["", ""];

    try {
      const form = new FormData();

      // Append all selected images
      selectedImages.forEach((file) => {
        if (typeof file === "string") form.append("existingPhotos", file);
        else form.append("files", file); // Note the plural "files" and we're not using array indices
      });

      form.append("collectorName", user.fullName || "Unknown Collector");
      form.append("dateCollected", new Date().toISOString());
      form.append("species", formData.treeType);
      form.append("dbh", formData.treeSpecs.trunkDBH.toString());
      form.append("canopyBreadth", formData.treeSpecs.canopySpread.toString());
      form.append("treeHeight", formData.treeSpecs.treeHeight.toString());
      form.append("treeQuality", formData.treeHealth.toString());
      form.append("additionalNotes", formData.fieldNotes);
      form.append("gpsCoordinates[0]", latitude);
      form.append("gpsCoordinates[1]", longitude);

      formData.treeIssues.forEach((issue, idx) => {
        form.append(`treeCondition[${idx}]`, issue);
      });

      const treeHeight = mongoose.Types.Decimal128.fromString(formData.treeSpecs.treeHeight.toString());
      console.log(form);

      const response = await fetch(`/api/tree/${params.treeID}`, {
        method: "PUT",
        body: form,
      });

      const result = await response.json();

      if (response.ok) {
        alert("Tree data submitted successfully!");
        // Reset form
        setFormData({
          treeLocation: "",
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
        // Clean up image previews
        imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
        setSelectedImages([]);
        setImagePreviews([]);
      } else {
        alert("Failed to submit tree: " + result);
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("An error occurred while submitting the tree.");
    }
  };

  useEffect(() => {
    console.log(selectedImages);
  }, [selectedImages]);

  return (
    <Box p={6} maxW="600px" mx="auto" boxShadow="md" borderRadius="md" bg={COLORS.PureWhite}>
      <Heading mb={4} display={"flex"} justifyContent="center" margin="3rem">
        Edit This Tree
      </Heading>
      <VStack spacing={4} as="form" onSubmit={handleSubmit}>
        <TreeFormSection isRequired>
          <TreeFormHeading id="treeLocation" style={{ fontSize: "24px" }} marginBottom="20px">
            Location
          </TreeFormHeading>
          <TreeFormInput
            id="treeCoordinates"
            type="text"
            name="treeCoordinates"
            value={formData.treeLocation}
            placeholder="(latitude, longitude) e.g. (35.555386, -120.713429)"
            onChange={handleTreeLocation}
            onBlur={() => {
              const validation = validateCoordinates();
              if (!validation.valid) {
                // You could set an error state here to display to the user
                console.warn(validation.error);
              }
            }}
          />
          <Text fontSize="sm" color="gray.500" mt={2}>
            Example format: (35.555386, -120.713429)
          </Text>
        </TreeFormSection>
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
        {/* Updated image upload section */}
        <TreeFormSection>
          <HStack gap="3">
            <TreeFormHeading style={{ fontSize: "23px", marginBottom: "10px" }}>Upload Tree Images</TreeFormHeading>
          </HStack>

          {/* Image previews */}
          {imagePreviews.length > 0 && (
            <Wrap spacing={3} mb={4}>
              {imagePreviews.map((preview, index) => (
                <WrapItem key={index} position="relative">
                  <Box
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    overflow="hidden"
                    width="100px"
                    height="100px"
                  >
                    <Image src={preview} alt={`Preview ${index + 1}`} objectFit="cover" width="100%" height="100%" />
                  </Box>
                  <CloseButton
                    size="sm"
                    color="white"
                    bg="red.500"
                    _hover={{ bg: "red.600" }}
                    position="absolute"
                    top="0"
                    right="0"
                    onClick={() => removeImage(index)}
                  />
                </WrapItem>
              ))}
            </Wrap>
          )}

          {/* File input */}
          <label htmlFor="treeImages">
            <Box
              as="span"
              cursor="pointer"
              padding="10px"
              backgroundColor={COLORS.Cream}
              color={COLORS.Olive}
              borderRadius="md"
              display="inline-block"
            >
              Choose Images
            </Box>
            <Text fontSize="sm" color="gray.500" mt={2}>
              {selectedImages.length} images selected
            </Text>
          </label>

          <input
            style={{ display: "none" }}
            type="file"
            id="treeImages"
            accept="image/*"
            onChange={handleImageChange}
            multiple
          />
        </TreeFormSection>
        <Button type="submit" backgroundColor={COLORS.Olive} color={COLORS.PureWhite} borderRadius="5rem">
          Submit
        </Button>
      </VStack>
    </Box>
  );
}
