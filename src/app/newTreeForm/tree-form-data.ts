//Tree Types as on Figma
export const treeTypes = ["Valley Oak", "Coast Live Oak", "Blue Oak"] as const;
export type TreeType = (typeof treeTypes)[number];

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
] as const;
export type treeIssue = (typeof treeIssues)[number];

//Form Data
export type TreeFormData = {
  treeType: TreeType;
  treeSpecs: Map<string, string>;
  treeHealth: number; //Number between 1-10
  treeIssues: Array<treeIssue>;
  fieldNotes: string;
};
