import { connectDB } from "@/lib/db/connect";
import CalendarEvent from "@/lib/models/calendar-event";

export async function getAllEvents() {
  await connectDB();
  return CalendarEvent.find().sort({ date: 1 }).lean();
}
export async function getEventsInRange(startDate, endDate) {
  await connectDB();
  return CalendarEvent.find({ date: { $gte: startDate, $lte: endDate } })
    .sort({ date: 1 })
    .lean();
}
export async function createEvent(data) {
  await connectDB();
  return CalendarEvent.create(data);
}
export async function updateEvent(id, data) {
  await connectDB();
  return CalendarEvent.findByIdAndUpdate(id, data, { new: true }).lean();
}
export async function deleteEvent(id) {
  await connectDB();
  return CalendarEvent.findByIdAndDelete(id).lean();
}
