import mongoose from "mongoose";

const FoodItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    caloriesPerUnit: { type: Number, required: true },
    unit: { type: String, default: "serving" },
  },
  { timestamps: true }
);

export default mongoose.models.FoodItem || mongoose.model("FoodItem", FoodItemSchema);
