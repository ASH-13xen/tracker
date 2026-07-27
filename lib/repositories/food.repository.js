import { connectDB } from "@/lib/db/connect";
import FoodEntry from "@/lib/models/food-entry";

export async function getEntriesForDate(date) {
  await connectDB();
  return FoodEntry.find({ date }).sort({ createdAt: 1 }).lean();
}
export async function getEntriesInRange(startDate, endDate) {
  await connectDB();
  return FoodEntry.find({ date: { $gte: startDate, $lte: endDate } })
    .sort({ date: 1 })
    .lean();
}
export async function createEntry(data) {
  await connectDB();
  return FoodEntry.create(data);
}
export async function updateEntry(id, data) {
  await connectDB();
  return FoodEntry.findByIdAndUpdate(id, data, { new: true }).lean();
}
export async function deleteEntry(id) {
  await connectDB();
  return FoodEntry.findByIdAndDelete(id).lean();
}
