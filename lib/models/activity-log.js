import mongoose from "mongoose";

const ActivityLogSchema = new mongoose.Schema(
  {
    date: { type: String, required: true, index: true },
    category: {
      type: String,
      enum: ["gate", "dsa", "exercise", "skill", "food", "project"],
      required: true,
      index: true,
    },
    weight: { type: Number, default: 1 },
    meta: { type: String, default: "" },
  },
  { timestamps: true }
);

ActivityLogSchema.index({ date: 1, category: 1 });

export default mongoose.models.ActivityLog ||
  mongoose.model("ActivityLog", ActivityLogSchema);
