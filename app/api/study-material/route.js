import * as studyMaterialService from "@/lib/services/study-material.service";
import { ok, fail } from "@/lib/utils/api-response";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const kind = searchParams.get("kind");
    const id = searchParams.get("id");
    if (!kind || !id) return fail("kind and id are required");
    const materials = await studyMaterialService.getForAttachment(kind, id);
    return ok(materials);
  } catch (err) {
    return fail(err, 500);
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const title = formData.get("title");
    const type = formData.get("type");
    const attachedTo = {
      kind: formData.get("attachedToKind"),
      id: formData.get("attachedToId"),
    };

    if (!title || !type) return fail("title and type are required");
    if (!attachedTo.kind || !attachedTo.id) {
      return fail("attachedToKind and attachedToId are required");
    }

    let created;
    if (type === "file") {
      const file = formData.get("file");
      if (!file || typeof file === "string") return fail("file is required for type 'file'");
      created = await studyMaterialService.createFileMaterial({ title, file, attachedTo });
    } else if (type === "text") {
      created = await studyMaterialService.createTextMaterial({
        title,
        content: formData.get("content") || "",
        attachedTo,
      });
    } else if (type === "link") {
      created = await studyMaterialService.createLinkMaterial({
        title,
        content: formData.get("content") || "",
        attachedTo,
      });
    } else {
      return fail("type must be 'file', 'text', or 'link'");
    }

    return ok(created, { status: 201 });
  } catch (err) {
    return fail(err, 500);
  }
}
