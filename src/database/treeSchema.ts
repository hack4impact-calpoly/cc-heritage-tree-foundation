import mongoose, { Schema } from "mongoose";

const TreeSchema = new Schema({
  collectorName: { type: String, required: true },
  dateCollected: { type: String, required: true },
  gpsCoordinates: { type: String, required: true },
  photo: { type: String, required: false },
  dbh: { type: mongoose.Types.Decimal128, required: true },
  canopyBreadth: { type: mongoose.Types.Decimal128, required: true },
  species: { type: String, required: true },
  treeCondition: { type: [String], required: true },
  additionalNotes: {
    type: String,
    required: false,
  },
});

export default mongoose.model("Tree", TreeSchema);
