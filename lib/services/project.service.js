import * as repo from "@/lib/repositories/project.repository";
import * as activityLogRepo from "@/lib/repositories/activity-log.repository";
import { todayKey } from "@/lib/utils/date-helpers";

function withProgress(project, tasks) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  return {
    ...project,
    progress: total === 0 ? 0 : Math.round((done / total) * 100),
    taskCount: total,
    taskDoneCount: done,
  };
}

export async function getAllProjects() {
  const projects = await repo.getAllProjects();
  const withTasks = await Promise.all(
    projects.map(async (p) => {
      const tasks = await repo.getTasksForProject(p._id);
      return withProgress(p, tasks);
    })
  );
  return withTasks;
}

export async function getProject(id) {
  const project = await repo.findProjectById(id);
  if (!project) return null;
  const [tasks, timeLogs] = await Promise.all([
    repo.getTasksForProject(id),
    repo.getTimeLogsForProject(id),
  ]);
  return { ...withProgress(project, tasks), tasks, timeLogs };
}

export const createProject = (data) => repo.createProject(data);
export const updateProject = (id, data) => repo.updateProject(id, data);
export const deleteProject = (id) => repo.deleteProject(id);

export const addTask = (data) => repo.createTask(data);
export const updateTask = (id, data) => repo.updateTask(id, data);
export const removeTask = (id) => repo.deleteTask(id);

export async function addTimeLog(data) {
  const dateKey = data.date ?? todayKey();
  const created = await repo.createTimeLog({ ...data, date: dateKey });
  await activityLogRepo.record(dateKey, "project", data.hours ?? 1, `timelog:${created._id}`);
  return created;
}
export const removeTimeLog = (id) => repo.deleteTimeLog(id);
