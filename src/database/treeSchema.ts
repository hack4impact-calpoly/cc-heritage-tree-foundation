import mongoose, { Decimal128, Schema } from "mongoose";

export type ITree = {
  _id: string;
  collectorName: string;
  dateCollected: Date;
  gpsCoordinates: Decimal128[];
  dbh: Decimal128;
  canopyBreadth: Decimal128;
  treeHeight: Decimal128; // added treeHeight
  species: string;
  treeCondition: string[];
  treeQuality: string;
  photo: string;
  additionalNotes?: string;
};

const TreeSchema = new Schema<ITree>({
  collectorName: { type: String, required: true },
  dateCollected: { type: Date, required: true },
  gpsCoordinates: { type: [mongoose.Types.Decimal128], required: true },
  dbh: { type: mongoose.Types.Decimal128, required: true },
  treeHeight: { type: mongoose.Types.Decimal128, required: true }, // added treeHeight
  canopyBreadth: { type: mongoose.Types.Decimal128, required: true },
  species: { type: String, required: true },
  treeCondition: { type: [String], required: true },
  treeQuality: { type: String, required: true },
  photo: {
    type: String,
    required: false,
  },
  additionalNotes: {
    type: String,
    required: false,
  },
});

const Tree = mongoose.models.Trees || mongoose.model("Trees", TreeSchema, "trees");
export default Tree;
