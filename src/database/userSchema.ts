import mongoose, { Schema } from "mongoose";

//! Example user schema. Not guaranteed to work
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  role: { type: String, required: true },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
