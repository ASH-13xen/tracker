import { connectDB } from "@/lib/db/connect";
import { Skill, SkillTopic, SkillSubtopic } from "@/lib/models/skill";

export async function getAllSkills() {
  await connectDB();
  return Skill.find().sort({ order: 1, createdAt: 1 }).lean();
}
export async function findSkillById(id) {
  await connectDB();
  return Skill.findById(id).lean();
}
export async function createSkill(data) {
  await connectDB();
  return Skill.create(data);
}
export async function updateSkill(id, data) {
  await connectDB();
  return Skill.findByIdAndUpdate(id, data, { new: true }).lean();
}
export async function deleteSkill(id) {
  await connectDB();
  const topics = await SkillTopic.find({ skillId: id }).select("_id").lean();
  const topicIds = topics.map((t) => t._id);
  await SkillSubtopic.deleteMany({ topicId: { $in: topicIds } });
  await SkillTopic.deleteMany({ skillId: id });
  return Skill.findByIdAndDelete(id).lean();
}

export async function getTreeForSkill(skillId) {
  await connectDB();
  const topics = await SkillTopic.find({ skillId }).sort({ order: 1, createdAt: 1 }).lean();
  const topicIds = topics.map((t) => t._id);
  const subtopics = await SkillSubtopic.find({ topicId: { $in: topicIds } })
    .sort({ order: 1, createdAt: 1 })
    .lean();
  return { topics, subtopics };
}

export async function createTopic(data) {
  await connectDB();
  return SkillTopic.create(data);
}
export async function updateTopic(id, data) {
  await connectDB();
  return SkillTopic.findByIdAndUpdate(id, data, { new: true }).lean();
}
export async function deleteTopic(id) {
  await connectDB();
  await SkillSubtopic.deleteMany({ topicId: id });
  return SkillTopic.findByIdAndDelete(id).lean();
}

export async function createSubtopic(data) {
  await connectDB();
  return SkillSubtopic.create(data);
}
export async function updateSubtopic(id, data) {
  await connectDB();
  return SkillSubtopic.findByIdAndUpdate(id, data, { new: true }).lean();
}
export async function deleteSubtopic(id) {
  await connectDB();
  return SkillSubtopic.findByIdAndDelete(id).lean();
}
