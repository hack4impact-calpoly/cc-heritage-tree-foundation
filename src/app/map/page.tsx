"use client";
import { useRef, useEffect } from "react";
import { Tree, treeData } from "./tree_data";
import styles from "@/styles/map.module.css";
import dynamic from "next/dynamic";
import MapComponent from "@/components/Map";
import { Box } from "@chakra-ui/react";
//import leaflet in client
const L = dynamic(() => import("leaflet") as any, {
  ssr: false,
});
export default function Map() {
  return (
    <Box width="100%" height="90vh" p={{ base: "20px", md: "50px" }}>
      <MapComponent />
    </Box>
  );
}
