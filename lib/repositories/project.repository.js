import { connectDB } from "@/lib/db/connect";
import { Project, ProjectTask, ProjectTimeLog } from "@/lib/models/project";

export async function getAllProjects() {
  await connectDB();
  return Project.find().sort({ order: 1, createdAt: 1 }).lean();
}
export async function findProjectById(id) {
  await connectDB();
  return Project.findById(id).lean();
}
export async function createProject(data) {
  await connectDB();
  return Project.create(data);
}
export async function updateProject(id, data) {
  await connectDB();
  return Project.findByIdAndUpdate(id, data, { new: true }).lean();
}
export async function deleteProject(id) {
  await connectDB();
  await ProjectTask.deleteMany({ projectId: id });
  await ProjectTimeLog.deleteMany({ projectId: id });
  return Project.findByIdAndDelete(id).lean();
}

export async function getTasksForProject(projectId) {
  await connectDB();
  return ProjectTask.find({ projectId }).sort({ order: 1, createdAt: 1 }).lean();
}
export async function createTask(data) {
  await connectDB();
  return ProjectTask.create(data);
}
export async function updateTask(id, data) {
  await connectDB();
  return ProjectTask.findByIdAndUpdate(id, data, { new: true }).lean();
}
export async function deleteTask(id) {
  await connectDB();
  return ProjectTask.findByIdAndDelete(id).lean();
}

export async function getTimeLogsForProject(projectId) {
  await connectDB();
  return ProjectTimeLog.find({ projectId }).sort({ date: -1 }).lean();
}
export async function createTimeLog(data) {
  await connectDB();
  return ProjectTimeLog.create(data);
}
export async function deleteTimeLog(id) {
  await connectDB();
  return ProjectTimeLog.findByIdAndDelete(id).lean();
}
