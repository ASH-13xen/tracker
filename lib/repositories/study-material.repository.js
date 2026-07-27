import { connectDB } from "@/lib/db/connect";
import StudyMaterial from "@/lib/models/study-material";

export async function getForAttachment(kind, id) {
  await connectDB();
  return StudyMaterial.find({ "attachedTo.kind": kind, "attachedTo.id": id })
    .sort({ createdAt: -1 })
    .lean();
}
export async function findById(id) {
  await connectDB();
  return StudyMaterial.findById(id).lean();
}
export async function create(data) {
  await connectDB();
  return StudyMaterial.create(data);
}
export async function remove(id) {
  await connectDB();
  return StudyMaterial.findByIdAndDelete(id).lean();
}
