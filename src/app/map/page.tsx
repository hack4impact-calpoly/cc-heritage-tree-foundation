"use client";
import React, { useState, useEffect } from "react";
import { ITree } from "@/database/treeSchema";
import dynamic from "next/dynamic";
import MapComponent from "@/components/Map";
import { Box } from "@chakra-ui/react";
//import leaflet in client
const L = dynamic(() => import("leaflet") as any, {
  ssr: false,
});
export default function Map() {
  const [treeData, setTree] = useState<ITree[]>([]);
  useEffect(() => {
    const fetchTrees = async () => {
      try {
        const response = await fetch("/api/tree");
        if (!response.ok) throw new Error("Failed to fetch trees for map");
        const data: ITree[] = await response.json();
        setTree(data);
      } catch (error) {
        console.error("Error fetching tree data:", error);
      }
    };
    fetchTrees();
  }, []);
  return (
    <Box width="100%" height="90vh" p={{ base: "20px", md: "50px" }}>
      <MapComponent trees={treeData} />
    </Box>
  );
}
