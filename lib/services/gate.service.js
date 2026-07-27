import * as repo from "@/lib/repositories/gate.repository";
import * as activityLogRepo from "@/lib/repositories/activity-log.repository";
import { nextRevisionDate } from "@/lib/services/shared/revision";
import { todayKey } from "@/lib/utils/date-helpers";

export async function getSyllabus() {
  return repo.getTree();
}

export const addSubject = (data) => repo.createSubject(data);
export const renameSubject = (id, data) => repo.updateSubject(id, data);
export const removeSubject = (id) => repo.deleteSubject(id);

export const addTopic = (data) => repo.createTopic(data);
export const renameTopic = (id, data) => repo.updateTopic(id, data);
export const removeTopic = (id) => repo.deleteTopic(id);

export const addSubtopic = (data) => repo.createSubtopic(data);
export const renameSubtopic = (id, data) => repo.updateSubtopic(id, data);
export const removeSubtopic = (id) => repo.deleteSubtopic(id);

async function markField(id, field, done, dateKey) {
  const now = new Date();
  const isBackdated = dateKey !== todayKey();
  const update = {
    [`${field}Done`]: done,
    [`${field}DoneAt`]: done ? now : null,
    [`${field}MarkedLater`]: done ? isBackdated : false,
  };
  if (done) {
    update.lastRevisedAt = now;
    update.nextRevisionDue = nextRevisionDate(now);
  }
  const updated = await repo.updateSubtopic(id, update);
  if (done) {
    await activityLogRepo.record(dateKey, "gate", 1, `${field}:${id}`);
  }
  return updated;
}

export const markTheory = (id, done, dateKey = todayKey()) =>
  markField(id, "theory", done, dateKey);
export const markPractice = (id, done, dateKey = todayKey()) =>
  markField(id, "practice", done, dateKey);

export async function markRevised(id, dateKey = todayKey()) {
  const now = new Date();
  const updated = await repo.updateSubtopic(id, {
    lastRevisedAt: now,
    nextRevisionDue: nextRevisionDate(now),
  });
  await activityLogRepo.record(dateKey, "gate", 1, `revised:${id}`);
  return updated;
}

export async function getDueForRevision() {
  const now = new Date();
  const due = await repo.findDueSubtopics(now);
  if (due.length === 0) return [];

  const { subjects, topics } = await repo.getTree();
  const topicMap = new Map(topics.map((t) => [String(t._id), t]));
  const subjectMap = new Map(subjects.map((s) => [String(s._id), s]));

  return due.map((subtopic) => {
    const topic = topicMap.get(String(subtopic.topicId));
    const subject = topic ? subjectMap.get(String(topic.subjectId)) : null;
    return {
      id: String(subtopic._id),
      category: "gate",
      subjectName: subject?.name ?? "",
      topicName: topic?.name ?? "",
      subtopicName: subtopic.name,
      nextRevisionDue: subtopic.nextRevisionDue,
    };
  });
}
