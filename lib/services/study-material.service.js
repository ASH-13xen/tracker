import * as repo from "@/lib/repositories/study-material.repository";
import { saveFile, deleteFile } from "@/lib/services/shared/file-storage";

export const getForAttachment = (kind, id) => repo.getForAttachment(kind, id);
export const findById = (id) => repo.findById(id);

export async function createFileMaterial({ title, file, attachedTo }) {
  const { filePath, fileName } = await saveFile(file);
  return repo.create({ title, type: "file", filePath, fileName, attachedTo });
}

export async function createTextMaterial({ title, content, attachedTo }) {
  return repo.create({ title, type: "text", content, attachedTo });
}

export async function createLinkMaterial({ title, content, attachedTo }) {
  return repo.create({ title, type: "link", content, attachedTo });
}

export async function remove(id) {
  const material = await repo.findById(id);
  if (material?.type === "file") await deleteFile(material.filePath);
  return repo.remove(id);
}
