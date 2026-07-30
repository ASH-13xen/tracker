import { connectDB } from "@/lib/db/connect";
import { DsaTopic, DsaSubtopic } from "@/lib/models/dsa";

export async function getTree() {
  await connectDB();
  const [topics, subtopics] = await Promise.all([
    DsaTopic.find().sort({ order: 1, createdAt: 1 }).lean(),
    DsaSubtopic.find().sort({ order: 1, createdAt: 1 }).lean(),
  ]);
  return { topics, subtopics };
}

export async function createTopic(data) {
  await connectDB();
  return DsaTopic.create(data);
}
export async function updateTopic(id, data) {
  await connectDB();
  return DsaTopic.findByIdAndUpdate(id, data, { new: true }).lean();
}
export async function deleteTopic(id) {
  await connectDB();
  await DsaSubtopic.deleteMany({ topicId: id });
  return DsaTopic.findByIdAndDelete(id).lean();
}

export async function createSubtopic(data) {
  await connectDB();
  return DsaSubtopic.create(data);
}
export async function updateSubtopic(id, data) {
  await connectDB();
  return DsaSubtopic.findByIdAndUpdate(id, data, { new: true }).lean();
}
export async function deleteSubtopic(id) {
  await connectDB();
  return DsaSubtopic.findByIdAndDelete(id).lean();
}
export async function findSubtopicById(id) {
  await connectDB();
  return DsaSubtopic.findById(id).lean();
}
export async function findDueSubtopics(now) {
  await connectDB();
  return DsaSubtopic.find({
    nextRevisionDue: { $lte: now },
    practiceDone: true,
  }).lean();
}
