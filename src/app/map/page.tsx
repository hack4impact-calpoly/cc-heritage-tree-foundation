"use client";
import { useRef, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/images/marker-shadow.png";
import { Tree, treeData } from "./tree_data";
import styles from "@/styles/map.module.css";

export default function Map() {
  const mapRef = useRef<L.Map | null>(null);
  useEffect(() => {
    //use the default icon for marker
    const DefaultIcon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    //initilize the map
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([35.270378, -120.680656], 14.5);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(mapRef.current);
    }

    //add marker to map
    if (mapRef.current) {
      treeData.map((tree: Tree) => {
        const marker = L.marker([tree.gpsCoords[0], tree.gpsCoords[1]]).addTo(mapRef.current!);
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
