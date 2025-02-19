import mongoose, { Schema } from "mongoose";

export type IUser = {
  _id: string;
  name: string;
  roles: string[];
  email: string;
  phoneNumber: string;
};

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  roles: { type: [String], required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
