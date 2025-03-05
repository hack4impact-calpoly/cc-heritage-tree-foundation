import mongoose, { Schema } from "mongoose";

//! Example user schema. Not guaranteed to work
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: false },
  role: { type: String, required: true },
  active: { type: Boolean, required: true },
});

export type IUser = {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  active: boolean;
};

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
