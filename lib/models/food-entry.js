import mongoose from "mongoose";

const FoodEntrySchema = new mongoose.Schema(
  {
    date: { type: String, required: true, index: true },
    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "snack", "other"],
      default: "other",
    },
    description: { type: String, required: true },
    calories: { type: Number, required: true },
    markedLater: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.FoodEntry || mongoose.model("FoodEntry", FoodEntrySchema);
