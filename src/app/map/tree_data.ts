//temp class tree
export interface Tree {
  collectorName: string;
  gpsCoords: number[];
  dateCollected: Date;
  photo?: string;
  dbh: number;
  canopyBreadth: number;
  species: string;
  treeCond: string[];
  notes?: string;
}
//Dummy data
export const treeData: Tree[] = [
  {
    collectorName: "John Doe",
    gpsCoords: [35.267763, -120.675414],
    dateCollected: new Date("2025-01-25"),
    dbh: 15.2,
    canopyBreadth: 8.5,
    species: "Quercus agrifolia",
    treeCond: ["Healthy", "Mature"],
  },
  {
    collectorName: "Jane Smith",
    gpsCoords: [35.273266, -120.680012],
    dateCollected: new Date("2025-01-26"),
    dbh: 10.4,
    canopyBreadth: 6.3,
    species: "Pinus ponderosa",
    treeCond: ["Healthy", "Young"],
  },
  {
    collectorName: "Michael Brown",
    gpsCoords: [35.276883, -120.673991],
    dateCollected: new Date("2025-01-27"),
    dbh: 20.8,
    canopyBreadth: 12.4,
    species: "Sequoia sempervirens",
    treeCond: ["Healthy", "Mature", "Thriving"],
  },
  {
    collectorName: "Sarah Johnson",
    gpsCoords: [35.276889, -120.686529],
    dateCollected: new Date("2025-01-27"),
    dbh: 5.9,
    canopyBreadth: 3.2,
    species: "Acer macrophyllum",
    treeCond: ["Healthy", "Young"],
  },
  {
    collectorName: "Emily Davis",
    gpsCoords: [35.270783, -120.674544],
    dateCollected: new Date("2025-01-28"),
    dbh: 25.6,
    canopyBreadth: 15.7,
    species: "Platanus racemosa",
    treeCond: ["Healthy", "Old Growth"],
  },
];
