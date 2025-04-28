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
  const [formData, setFormData] = useState<FormValues>({
    treeLocation: ["", ""],
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
            treeLocation: [
              treeInfo.gpsCoordinates[0]["$numberDecimal"] ? treeInfo.gpsCoordinates[0]["$numberDecimal"] : "",
              treeInfo.gpsCoordinates[1]["$numberDecimal"] ? treeInfo.gpsCoordinates[1]["$numberDecimal"] : "",
            ],
            treeType: treeInfo.species ? treeInfo.species : "",
            treeSpecs: {
              treeHeight: treeInfo.treeHeight["$numberDecimal"] ? treeInfo.treeHeight["$numberDecimal"] : 0, // height info not kept
              canopySpread: treeInfo.canopyBreadth["$numberDecimal"] ? treeInfo.canopyBreadth["$numberDecimal"] : "",
              trunkDBH: treeInfo.dbh["$numberDecimal"] ? treeInfo.dbh["$numberDecimal"] : "",
            },
            treeHealth: treeInfo.treeQuality["$numberDecimal"] ? treeInfo.treeQuality["$numberDecimal"] : "",
            treeIssues: treeInfo.treeCondition ? treeInfo.treeCondition : [],
            fieldNotes: treeInfo.additionalNotes ? treeInfo.additionalNotes : "",
          });
        } else {
          console.log("Failed to retreive data.");
        }
      } catch (error) {
        console.error("Error retreiving tree data:", error);
      }
    };
    console.log("load data into the formData");
    getTreeData();
  }, []);

  const handleTreeType = (e: React.MouseEvent<HTMLButtonElement>) => {
    const treeType = e.currentTarget.getAttribute("name") as TreeType;
    console.log("Tree type selected: " + treeType);
    setFormData((prev) => ({
      ...prev,
      treeType,
    }));
  };

  const handleTreeLocation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const longOrLat = e.currentTarget.getAttribute("name");
    const value = e.target.value;
    if (longOrLat === "treeLatitude") {
      setFormData((prev) => ({
        ...prev,
        treeLocation: [value, formData.treeLocation[1]],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        treeLocation: [formData.treeLocation[0], value],
      }));
    }
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

  const handleSubmit = async (event: React.FormEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (!user) {
      alert("Please log in to submit the form.");
      return;
    }

    try {
      // Fetch user's name from backend using email
      const userResponse = await fetch(`/api/user/${user.primaryEmailAddress}`);

      if (!userResponse.ok) {
        throw new Error("Failed to fetch user details.");
      }

      const userData = await userResponse.json();

      const collectorName = userData.name || "Unknown Collector"; // Fallback if no name is found

      const currentDate = new Date();

      const dbhDecimal = mongoose.Types.Decimal128.fromString(formData.treeSpecs.trunkDBH.toString());
      const canopyBreadthDecimal = mongoose.Types.Decimal128.fromString(formData.treeSpecs.canopySpread.toString());
      const treeHeight = mongoose.Types.Decimal128.fromString(formData.treeSpecs.treeHeight.toString());

      const gpsCoordinates = formData.treeLocation.map((coord) =>
        mongoose.Types.Decimal128.fromString(coord.toString()),
      );

      // Construct the submission data
      const dataToSubmit = {
        collectorName, // Use the fetched name
        dateCollected: currentDate,
        gpsCoordinates,
        dbh: dbhDecimal,
        canopyBreadth: canopyBreadthDecimal,
        species: formData.treeType,
        treeCondition: formData.treeIssues,
        treeQuality: formData.treeHealth,
        additionalNotes: formData.fieldNotes,
        treeHeight: treeHeight,
      };

      console.log("Submitting the following data:", JSON.stringify(dataToSubmit, null, 2));

      const response = await fetch(`/api/tree/${params.treeID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });

      const responseText = await response.text();
      console.log("Response Text: " + responseText);

      if (response.ok) {
        alert("Tree data edited and submitted successfully!");
      } else {
        alert("Failed to edit and submit data.");
      }
    } catch (error) {
      console.error("Error editing and submitting tree data:", error);
      alert("Error editing and submitting tree data.");
    }
  };

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
          <Box display="flex" flexDirection="row" gap="20px">
            <TreeFormInput
              id="treeLatitude"
              type="string"
              name="treeLatitude"
              value={formData.treeLocation[0]}
              placeholder="input latitude"
              onChange={handleTreeLocation}
            />
            <TreeFormInput
              id="treeLongitude"
              type="string"
              name="treeLongitude"
              value={formData.treeLocation[1]}
              placeholder="input longitude"
              onChange={handleTreeLocation}
            />
          </Box>
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
        <Button type="submit" backgroundColor={COLORS.Olive} color={COLORS.PureWhite} borderRadius="5rem">
          Submit
        </Button>
      </VStack>
    </Box>
  );
}
