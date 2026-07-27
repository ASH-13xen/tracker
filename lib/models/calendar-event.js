import mongoose from "mongoose";

const CalendarEventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: String, required: true, index: true },
    description: { type: String, default: "" },
    category: { type: String, default: "general" },
  },
  { timestamps: true }
);

export default mongoose.models.CalendarEvent ||
  mongoose.model("CalendarEvent", CalendarEventSchema);
