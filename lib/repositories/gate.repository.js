import { connectDB } from "@/lib/db/connect";
import { GateSubject, GateTopic, GateSubtopic } from "@/lib/models/gate";

export async function getTree() {
  await connectDB();
  const [subjects, topics, subtopics] = await Promise.all([
    GateSubject.find().sort({ order: 1, createdAt: 1 }).lean(),
    GateTopic.find().sort({ order: 1, createdAt: 1 }).lean(),
    GateSubtopic.find().sort({ order: 1, createdAt: 1 }).lean(),
  ]);
  return { subjects, topics, subtopics };
}

export async function createSubject(data) {
  await connectDB();
  return GateSubject.create(data);
}
export async function updateSubject(id, data) {
  await connectDB();
  return GateSubject.findByIdAndUpdate(id, data, { new: true }).lean();
}
export async function deleteSubject(id) {
  await connectDB();
  const topics = await GateTopic.find({ subjectId: id }).select("_id").lean();
  const topicIds = topics.map((t) => t._id);
  await GateSubtopic.deleteMany({ topicId: { $in: topicIds } });
  await GateTopic.deleteMany({ subjectId: id });
  return GateSubject.findByIdAndDelete(id).lean();
}

export async function createTopic(data) {
  await connectDB();
  return GateTopic.create(data);
}
export async function updateTopic(id, data) {
  await connectDB();
  return GateTopic.findByIdAndUpdate(id, data, { new: true }).lean();
}
export async function deleteTopic(id) {
  await connectDB();
  await GateSubtopic.deleteMany({ topicId: id });
  return GateTopic.findByIdAndDelete(id).lean();
}

export async function createSubtopic(data) {
  await connectDB();
  return GateSubtopic.create(data);
}
export async function updateSubtopic(id, data) {
  await connectDB();
  return GateSubtopic.findByIdAndUpdate(id, data, { new: true }).lean();
}
export async function deleteSubtopic(id) {
  await connectDB();
  return GateSubtopic.findByIdAndDelete(id).lean();
}
export async function findSubtopicById(id) {
  await connectDB();
  return GateSubtopic.findById(id).lean();
}
export async function findDueSubtopics(now) {
  await connectDB();
  return GateSubtopic.find({
    nextRevisionDue: { $lte: now },
    $or: [{ theoryDone: true }, { practiceDone: true }],
  })
    .lean();
}
