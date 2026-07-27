import mongoose from "mongoose";

const ActivityFlagSchema = new mongoose.Schema(
  {
    done: { type: Boolean, default: false },
    doneAt: { type: Date, default: null },
    markedLater: { type: Boolean, default: false },
  },
  { _id: false }
);

const DailyLogSchema = new mongoose.Schema(
  {
    date: { type: String, required: true, unique: true, index: true },
    gate: { type: ActivityFlagSchema, default: () => ({}) },
    dsa: { type: ActivityFlagSchema, default: () => ({}) },
    exercise: { type: ActivityFlagSchema, default: () => ({}) },
    skill: { type: ActivityFlagSchema, default: () => ({}) },
    foodLogged: { type: ActivityFlagSchema, default: () => ({}) },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.DailyLog || mongoose.model("DailyLog", DailyLogSchema);
