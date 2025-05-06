"use client";
import { useRef, useLayoutEffect } from "react";
import { ITree } from "@/database/treeSchema";
import dynamic from "next/dynamic";
import { Box, Wrap, Text, HStack, VStack, WrapItem } from "@chakra-ui/react";
import { createRoot } from "react-dom/client";
import { TreePine, NotebookPen } from "lucide-react";
import "./Map.css";
const L = dynamic(() => import("leaflet") as any, { ssr: false });
import { Schema } from "mongoose";

export function decimal128ToNumber(decimal?: Schema.Types.Decimal128): number | null {
  if (!decimal) return null;

  const str = decimal.toString();
  const num = parseFloat(str);

  if (isNaN(num)) return null;
  return num;
}
function PopupContent({ tree }: { tree: ITree }) {
  const getSpeciesBadge = (species?: string) => {
    const abbreviation = species
      ? species
          .split(" ")
          .map((word) => word[0])
          .join("")
          .toUpperCase()
      : "XX";
    const speciesStyleMap: Record<string, { bg: string; color: string }> = {
      VO: { bg: "#CFEFF9", color: "#426B87" },
      CLO: { bg: "#78C1DE", color: "#333333" },
      BO: { bg: "#426B87", color: "#FFFFFF" },
    };
    const defaultStyle = { bg: "#E0E0E0", color: "#333333" };
    const style = speciesStyleMap[abbreviation as keyof typeof speciesStyleMap] ?? defaultStyle;
    return { abbreviation, ...style };
  };

  const { abbreviation, bg, color } = getSpeciesBadge(tree.species);
  //popups content for Leaflet
  return (
    <Box maxH={"400px"} overflow={"auto"}>
      <VStack gap={10}>
        <Box
          position="absolute"
          px="10px"
          paddingTop={"5px"}
          bg={"#596334"}
          borderTopRadius={"16px"}
          w="100%"
          maxH={"65px"}
          h={"60px"}
        >
          <VStack w="100%" padding={"5px"} gap={2} sx={{ "& > p": { p: 0, m: 0 } }}>
            <HStack w="100%" paddingRight="15px" justifyContent="space-between" textColor="#ffffff">
              <HStack sx={{ "& > p": { p: 0, m: 0 } }}>
                <TreePine color="#ffffff" fontSize="15px" />
                <Text fontSize="15px" fontWeight="semibold">
                  Tree #{" "}
                </Text>
              </HStack>
              <Box bg={bg} borderRadius="8px" px="8px" py="4px" fontSize="13px" color={color} fontWeight="semibold">
                {abbreviation}
              </Box>
            </HStack>
            <Text w="100%" textColor={"#DFED98"}>
              {tree.gpsCoordinates[0].toString()}, {tree.gpsCoordinates[1].toString()}
            </Text>
          </VStack>
        </Box>
        <HStack
          mt="65px"
          maxH="180px"
          w="100%"
          px="10px"
          justifyContent="space-between"
          sx={{ "& > p": { p: 0, m: 0 } }}
        >
          <HStack
            bg={"#F4F1E8"}
            maxW={"150px"}
            minW={"120px"}
            h="35px"
            borderRadius={"16px"}
            padding={"5px"}
            sx={{ "& > p": { p: 0, m: 0 } }}
          >
            <Box bg={"#596334"} borderRadius={100} w="24px" h="24px"></Box>
            <Text textStyle="xs">{tree.collectorName}</Text>
          </HStack>
          <Text> {new Date(tree.dateCollected).toLocaleDateString()} </Text>
        </HStack>
        <HStack w="100%" px="10px" justify="center">
          <Box bg="#F4F1E8" w="100px" h="80px" borderRadius="16px">
            <HStack h="100%" gap={0}>
              <Box w="15px" h="100%" bg="#596334" borderLeftRadius="16px"></Box>

              <VStack width="100%" height="100%" gap={3} py="5px" sx={{ "& > p": { p: 0, m: 0 } }}>
                <Text fontWeight="semibold" fontSize="15px">
                  Condition
                </Text>

                <Box
                  width="32px"
                  height="30px"
                  bg="#596334"
                  borderRadius="10px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text textColor="#ffffff" fontSize="14px" fontWeight="semibold">
<<<<<<< HEAD
                    {parseFloat(tree.treeQuality ? tree.treeQuality.toString() : "0")}
=======
                    {parseFloat(tree.treeQuality.toString())}
>>>>>>> 9d9594d (feat: update schema to use Decimal128 again, also update map markers to properly indicate tree quality)
                  </Text>
                </Box>

                <Text fontSize="12px">Health</Text>
              </VStack>
            </HStack>
          </Box>

          <VStack w="170px" h="80px" gap="1" sx={{ "& > p": { p: 0, m: 0 } }} overflow={"auto"}>
            <HStack w="100%" alignItems="center" spacing="7px" sx={{ "& > p": { p: 0, m: 0 } }}>
              <NotebookPen color="#596334" size="18px" />
              <Text textColor="#596334" fontSize="15px">
                Notes
              </Text>
            </HStack>
            <Text w="100%">{tree.additionalNotes}</Text>
          </VStack>
        </HStack>

        <Box px={"10px"} w="100%">
          <Wrap spacing="5px">
            {tree.treeCondition.map((issue, index) => (
              <WrapItem key={index}>
                <Box
                  bg="#DFED98"
                  borderRadius="12px"
                  px="10px"
                  py="4px"
                  fontSize="12px"
                  color="#333333"
                  lineHeight="1.2"
                >
                  {issue}
                </Box>
              </WrapItem>
            ))}
          </Wrap>
        </Box>
        <HStack px="10px" paddingBottom="10px" width="100%" justifyContent="space-between">
          <VStack sx={{ "& > p": { p: 0, m: 0 } }}>
            <Text textColor={"#596334"}>Trunk DBH</Text>
            <Text fontWeight="semibold">{tree.dbh.toString()}&apos;</Text>
          </VStack>
          <VStack sx={{ "& > p": { p: 0, m: 0 } }}>
            <Text textColor={"#596334"}>Tree Height</Text>
            {/* No height in DB schema */}
            <Text fontWeight="semibold">N/A</Text>
          </VStack>
          <VStack sx={{ "& > p": { p: 0, m: 0 } }}>
            <Text textColor={"#596334"}>Canopy Spread</Text>
            <Text fontWeight="semibold">{tree.canopyBreadth.toString()}&quot;</Text>
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );
}

export default function Map({ trees }: { trees: ITree[] }) {
  const mapRef = useRef<any>(null);

  useLayoutEffect(() => {
    require("leaflet/dist/leaflet.css");
    const L = require("leaflet");
    if (!mapRef.current) {
      const DefaultIcon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      });
      L.Marker.prototype.options.icon = DefaultIcon;
      const map = L.map("map", { scrollWheelZoom: false }).setView([35.549809, -120.70491], 14.5);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
      mapRef.current = map;
    }

    if (mapRef.current && trees.length > 0) {
      const markersLayer = L.layerGroup().addTo(mapRef.current);

      trees.forEach((tree) => {
        const lat = parseFloat(tree.gpsCoordinates[0].toString());
        const lng = parseFloat(tree.gpsCoordinates[1].toString());

        const marker = L.marker([lat, lng]).addTo(markersLayer);
        const popupDiv = document.createElement("div");
        const root = createRoot(popupDiv);
        root.render(<PopupContent tree={tree} />);

        marker.bindPopup(popupDiv, {
          className: "customPopup",
          maxWidth: 300,
          minWidth: 200,
        });
      });

      return () => {
        mapRef.current?.removeLayer(markersLayer);
      };
    }
  }, [trees]);

  return (
    <div
      id="map"
      style={{
        height: "100%",
        width: "100%",
        borderRadius: "16px",
      }}
    ></div>
  );
}
