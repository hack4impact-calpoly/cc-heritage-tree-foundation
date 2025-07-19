import mongoose, { Schema } from "mongoose";

export type IAnnouncement = {
  _id: string;
  from: string;
  to: string[];
  subject: string;
  time: Date;
  message: string;
  readStatus: {
    userID: string;
    read: boolean;
  }[];
  attachmentUrl: string;
};

const AnnouncementSchema = new Schema<IAnnouncement>({
  from: { type: String, required: true },
  to: { type: [String], required: true },
  subject: { type: String, required: true },
  time: { type: Date, required: true },
  message: { type: String, required: true },
  readStatus: [
    {
      userID: { type: String, required: true },
      read: { type: Boolean, required: true },
    },
  ],
  attachmentUrl: { type: String, required: false },
});

// Force model recompilation to ensure new fields are recognized
if (mongoose.models.Announcement) {
  delete mongoose.models.Announcement;
}

export default mongoose.model<IAnnouncement>("Announcement", AnnouncementSchema);
