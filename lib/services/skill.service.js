import * as repo from "@/lib/repositories/skill.repository";
import * as activityLogRepo from "@/lib/repositories/activity-log.repository";
import { todayKey } from "@/lib/utils/date-helpers";

export async function getAllSkills() {
  const skills = await repo.getAllSkills();
  return Promise.all(
    skills.map(async (skill) => {
      const { subtopics } = await repo.getTreeForSkill(skill._id);
      const total = subtopics.length * 2;
      const done = subtopics.reduce(
        (sum, st) => sum + (st.theoryDone ? 1 : 0) + (st.practiceDone ? 1 : 0),
        0
      );
      return { ...skill, progress: total === 0 ? 0 : Math.round((done / total) * 100) };
    })
  );
}
export const getSkill = (id) => repo.findSkillById(id);
export const createSkill = (data) => repo.createSkill(data);
export const updateSkill = (id, data) => repo.updateSkill(id, data);
export const deleteSkill = (id) => repo.deleteSkill(id);

export const getTreeForSkill = (skillId) => repo.getTreeForSkill(skillId);

export const addTopic = (data) => repo.createTopic(data);
export const renameTopic = (id, data) => repo.updateTopic(id, data);
export const removeTopic = (id) => repo.deleteTopic(id);

export const addSubtopic = (data) => repo.createSubtopic(data);
export const renameSubtopic = (id, data) => repo.updateSubtopic(id, data);
export const removeSubtopic = (id) => repo.deleteSubtopic(id);

async function markField(id, field, done, dateKey) {
  const now = new Date();
  const isBackdated = dateKey !== todayKey();
  const updated = await repo.updateSubtopic(id, {
    [`${field}Done`]: done,
    [`${field}DoneAt`]: done ? now : null,
    [`${field}MarkedLater`]: done ? isBackdated : false,
  });
  if (done) {
    await activityLogRepo.record(dateKey, "skill", 1, `${field}:${id}`);
  }
  return updated;
}

export const markTheory = (id, done, dateKey = todayKey()) =>
  markField(id, "theory", done, dateKey);
export const markPractice = (id, done, dateKey = todayKey()) =>
  markField(id, "practice", done, dateKey);
