import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export async function saveFile(file) {
  await mkdir(UPLOAD_DIR, { recursive: true });
  const ext = path.extname(file.name || "");
  const storedName = `${randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, storedName), buffer);
  return { filePath: storedName, fileName: file.name || storedName };
}

export async function deleteFile(storedName) {
  if (!storedName) return;
  try {
    await unlink(path.join(UPLOAD_DIR, storedName));
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }
}

export function resolveFilePath(storedName) {
  return path.join(UPLOAD_DIR, storedName);
}
