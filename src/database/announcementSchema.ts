import mongoose, { Schema } from "mongoose";

export type IAnnouncement = {
  _id: string;
  volunteers: string[];
  sender: string;
  dateSent: Date;
};

const AnnouncementSchema = new Schema<IAnnouncement>({
  volunteers: { type: [String], required: true },
  sender: { type: String, required: true },
  dateSent: { type: Date, required: true },
});

export default mongoose.models.Announcement || mongoose.model<IAnnouncement>("Announcement", AnnouncementSchema);
