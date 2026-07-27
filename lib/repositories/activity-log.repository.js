import { connectDB } from "@/lib/db/connect";
import ActivityLog from "@/lib/models/activity-log";

export async function record(date, category, weight = 1, meta = "") {
  await connectDB();
  return ActivityLog.create({ date, category, weight, meta });
}

export async function findInRange(startDate, endDate, category) {
  await connectDB();
  const query = { date: { $gte: startDate, $lte: endDate } };
  if (category) query.category = category;
  return ActivityLog.find(query).lean();
}
