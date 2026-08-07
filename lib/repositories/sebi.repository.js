import { connectDB } from "@/lib/db/connect";
import { SebiPhase, SebiPaper, SebiSubject, SebiTopic } from "@/lib/models/sebi";

export async function getTree() {
  await connectDB();
  const [phases, papers, subjects, topics] = await Promise.all([
    SebiPhase.find().sort({ order: 1, createdAt: 1 }).lean(),
    SebiPaper.find().sort({ order: 1, createdAt: 1 }).lean(),
    SebiSubject.find().sort({ order: 1, createdAt: 1 }).lean(),
    SebiTopic.find().sort({ order: 1, createdAt: 1 }).lean(),
  ]);
  return { phases, papers, subjects, topics };
}

export async function countPhases() {
  await connectDB();
  return SebiPhase.countDocuments();
}

export async function createPhase(data) {
  await connectDB();
  return SebiPhase.create(data);
}
export async function updatePhase(id, data) {
  await connectDB();
  return SebiPhase.findByIdAndUpdate(id, data, { new: true }).lean();
}
export async function deletePhase(id) {
  await connectDB();
  const papers = await SebiPaper.find({ phaseId: id }).select("_id").lean();
  const paperIds = papers.map((p) => p._id);
  const subjects = await SebiSubject.find({ paperId: { $in: paperIds } })
    .select("_id")
    .lean();
  const subjectIds = subjects.map((s) => s._id);
  await SebiTopic.deleteMany({ subjectId: { $in: subjectIds } });
  await SebiSubject.deleteMany({ paperId: { $in: paperIds } });
  await SebiPaper.deleteMany({ phaseId: id });
  return SebiPhase.findByIdAndDelete(id).lean();
}

export async function createPaper(data) {
  await connectDB();
  return SebiPaper.create(data);
}
export async function updatePaper(id, data) {
  await connectDB();
  return SebiPaper.findByIdAndUpdate(id, data, { new: true }).lean();
}
export async function deletePaper(id) {
  await connectDB();
  const subjects = await SebiSubject.find({ paperId: id }).select("_id").lean();
  const subjectIds = subjects.map((s) => s._id);
  await SebiTopic.deleteMany({ subjectId: { $in: subjectIds } });
  await SebiSubject.deleteMany({ paperId: id });
  return SebiPaper.findByIdAndDelete(id).lean();
}

export async function createSubject(data) {
  await connectDB();
  return SebiSubject.create(data);
}
export async function updateSubject(id, data) {
  await connectDB();
  return SebiSubject.findByIdAndUpdate(id, data, { new: true }).lean();
}
export async function deleteSubject(id) {
  await connectDB();
  await SebiTopic.deleteMany({ subjectId: id });
  return SebiSubject.findByIdAndDelete(id).lean();
}

export async function createTopic(data) {
  await connectDB();
  return SebiTopic.create(data);
}
export async function updateTopic(id, data) {
  await connectDB();
  return SebiTopic.findByIdAndUpdate(id, data, { new: true }).lean();
}
export async function deleteTopic(id) {
  await connectDB();
  return SebiTopic.findByIdAndDelete(id).lean();
}
