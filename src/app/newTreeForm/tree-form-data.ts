import { COLORS } from "@/styles/color-styles-data";

//Tree Types as on Figma
export const treeTypes = ["Valley Oak", "Coast Live Oak", "Blue Oak"] as const;
export type TreeType = (typeof treeTypes)[number];

interface TreeTypeData {
  species: string;
  bgColor: string;
  color: string;
}

export const TREE_TYPE_DATA: Array<TreeTypeData> = [
  {
    species: "Valley Oak",
    bgColor: COLORS.RobinsEgg,
    color: COLORS.Steel,
  },
  {
    species: "Coast Live Oak",
    bgColor: COLORS.Sky,
    color: COLORS.Charcoal,
  },
  {
    species: "Blue Oak",
    bgColor: COLORS.Steel,
    color: COLORS.PureWhite,
  },
];

//Tree Issues as on Figma
export const treeIssues = [
  "Dead branches",
  "Cavities or hollows",
  "Ivy strangulation",
  "Concrete strangulation",
  "Soil compaction",
  "Blunt trauma",
  "Dual main competing trunk",
  "Epicormic growth",
  "Insect activity (note kind, if known. Ants and oak pit scale common)",
  "Fungal bodies",
  "Oozing sap",
  "Bird activity including nesting holes",
  "Acorn granary",
] as const;
export type TreeIssue = (typeof treeIssues)[number];

//Form Data
export type TreeFormData = {
  treeType: TreeType;
  treeSpecs: Map<string, string>;
  treeHealth: number; //Number between 1-10
  treeIssues: Array<TreeIssue>;
  fieldNotes: string;
};

export const treeHealthColors = [
  ["#A41D00", COLORS.PureWhite], //1
  ["#BC4201", "#FFE9DD"], //2
  ["#ED8426", "#4E2602"], //3
  ["#F9A213", "#563601"], //4
  ["#F9C100", "#5B4804"], //5
  ["#FFE327", "#6B5E0A"], //6
  ["#E3E162", "#585719"], //7
  ["#BDCD69", "#495022"], //8
  ["#9AAD48", "#313714"], //9
  [COLORS.Olive, "#F2FBCC"], //10
];

export type TreeSpecsData = {
  treeHeight: string;
  canopySpread: string;
  trunkDBH: string;
};

export type FormValues = {
  treeType: TreeType;
  treeSpecs: {
    treeHeight: number;
    canopySpread: number;
    trunkDBH: string;
  };
  treeHealth: number;
  treeIssues: Array<TreeIssue>;
  fieldNotes: string;
};
