import { connectDB } from "@/lib/db/connect";
import DailyLog from "@/lib/models/daily-log";

export async function findByDate(date) {
  await connectDB();
  return DailyLog.findOne({ date }).lean();
}

export async function findByDateRange(startDate, endDate) {
  await connectDB();
  return DailyLog.find({ date: { $gte: startDate, $lte: endDate } })
    .sort({ date: 1 })
    .lean();
}

export async function upsertByDate(date, update) {
  await connectDB();
  return DailyLog.findOneAndUpdate(
    { date },
    { $set: update },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).lean();
}
