import mongoose, { Schema } from "mongoose";

export type IAnnouncement = {
  _id: string;
  from: string;
  to: string[];
  time: Date;
  message: string;
  readStatus: {
    userID: string;
    read: boolean;
  }[];
};

const AnnouncementSchema = new Schema<IAnnouncement>({
  from: { type: String, required: true },
  to: { type: [String], required: true },
  time: { type: Date, required: true },
  message: { type: String, required: true },
  readStatus: [
    {
      userID: { type: String, required: true },
      read: { type: Boolean, required: true },
    },
  ],
});

export default mongoose.models.Announcement || mongoose.model<IAnnouncement>("Announcement", AnnouncementSchema);
