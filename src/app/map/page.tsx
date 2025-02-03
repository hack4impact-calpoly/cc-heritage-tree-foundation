"use client";
import { useRef, useEffect } from "react";
import { Tree, treeData } from "./tree_data";
import styles from "@/styles/map.module.css";
import dynamic from "next/dynamic";
//import leaflet in client
const L = dynamic(() => import("leaflet") as any, {
  ssr: false,
});
export default function Map() {
  const mapRef = useRef(null);
  useEffect(() => {
    require("leaflet/dist/leaflet.css");
    const L = require("leaflet");
    const DefaultIcon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
    L.Marker.prototype.options.icon = DefaultIcon;
    //initilize the map
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([35.270378, -120.680656], 14.5);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(mapRef.current);
      //add marker to map
      treeData.map((tree: Tree) => {
        const marker = L.marker([tree.gpsCoords[0], tree.gpsCoords[1]]).addTo(mapRef.current);
        marker.bindPopup(`
          <strong>${tree.species}</strong><br/>
          Collected by: ${tree.collectorName}<br/>
          Date Collected: ${tree.dateCollected.toISOString().split("T")[0]}<br/>
          Notes: ${tree.notes || "No additional notes"}
        `);
      });
    }
  }, []);

  return (
    <div>
      <div className={styles.MapContainer}>
        Map with 5 points
        <div id="map" style={{ height: "50vh", width: "75%" }}></div>
      </div>
    </div>
  );
}
