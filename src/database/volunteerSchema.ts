import mongoose, { Schema } from "mongoose";

export type IVolunteer = {
  _id: string;
  name: string;
  roles: string[];
  email: string;
  phoneNumber: string;
};

const VolunteerSchema = new Schema<IVolunteer>({
  name: { type: String, required: true },
  roles: { type: [String], required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

export default mongoose.models.Volunteer || mongoose.model<IVolunteer>("Volunteer", VolunteerSchema);
