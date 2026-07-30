import * as repo from "@/lib/repositories/dsa.repository";
import * as activityLogRepo from "@/lib/repositories/activity-log.repository";
import { nextRevisionDate } from "@/lib/services/shared/revision";
import { todayKey } from "@/lib/utils/date-helpers";

export async function getSyllabus() {
  return repo.getTree();
}

export const addTopic = (data) => repo.createTopic(data);
export const renameTopic = (id, data) => repo.updateTopic(id, data);
export const removeTopic = (id) => repo.deleteTopic(id);

export const addSubtopic = (data) => repo.createSubtopic(data);
export const renameSubtopic = (id, data) => repo.updateSubtopic(id, data);
export const removeSubtopic = (id) => repo.deleteSubtopic(id);

export async function markPractice(id, done, dateKey = todayKey()) {
  const now = new Date();
  const isBackdated = dateKey !== todayKey();
  const update = {
    practiceDone: done,
    practiceDoneAt: done ? now : null,
    practiceMarkedLater: done ? isBackdated : false,
  };
  if (done) {
    update.lastRevisedAt = now;
    update.nextRevisionDue = nextRevisionDate(now);
  }
  const updated = await repo.updateSubtopic(id, update);
  if (done) {
    await activityLogRepo.record(dateKey, "dsa", 1, `practice:${id}`);
  }
  return updated;
}

export async function markRevised(id, dateKey = todayKey()) {
  const now = new Date();
  const updated = await repo.updateSubtopic(id, {
    lastRevisedAt: now,
    nextRevisionDue: nextRevisionDate(now),
  });
  await activityLogRepo.record(dateKey, "dsa", 1, `revised:${id}`);
  return updated;
}

export async function getDueForRevision() {
  const now = new Date();
  const due = await repo.findDueSubtopics(now);
  if (due.length === 0) return [];

  const { topics } = await repo.getTree();
  const topicMap = new Map(topics.map((t) => [String(t._id), t]));

  return due.map((subtopic) => {
    const topic = topicMap.get(String(subtopic.topicId));
    return {
      id: String(subtopic._id),
      category: "dsa",
      subjectName: "",
      topicName: topic?.name ?? "",
      subtopicName: subtopic.name,
      nextRevisionDue: subtopic.nextRevisionDue,
    };
  });
}
