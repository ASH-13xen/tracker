import { connectDB } from "@/lib/db/connect";
import FoodItem from "@/lib/models/food-item";

export async function getAll() {
  await connectDB();
  return FoodItem.find().sort({ name: 1 }).lean();
}
export async function create(data) {
  await connectDB();
  return FoodItem.create(data);
}
export async function update(id, data) {
  await connectDB();
  return FoodItem.findByIdAndUpdate(id, data, { new: true }).lean();
}
export async function remove(id) {
  await connectDB();
  return FoodItem.findByIdAndDelete(id).lean();
}
