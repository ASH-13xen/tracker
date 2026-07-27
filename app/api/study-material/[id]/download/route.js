import { readFile } from "fs/promises";
import * as studyMaterialService from "@/lib/services/study-material.service";
import { resolveFilePath } from "@/lib/services/shared/file-storage";
import { fail } from "@/lib/utils/api-response";

const MIME_TYPES = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".txt": "text/plain",
  ".md": "text/markdown",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".zip": "application/zip",
};

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const material = await studyMaterialService.findById(id);
    if (!material || material.type !== "file") {
      return fail("File not found", 404);
    }

    const buffer = await readFile(resolveFilePath(material.filePath));
    const ext = material.filePath.slice(material.filePath.lastIndexOf("."));
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${encodeURIComponent(material.fileName)}"`,
      },
    });
  } catch (err) {
    return fail(err, 500);
  }
}
