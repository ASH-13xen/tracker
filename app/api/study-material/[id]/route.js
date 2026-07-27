import * as studyMaterialService from "@/lib/services/study-material.service";
import { ok, fail } from "@/lib/utils/api-response";

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await studyMaterialService.remove(id);
    return ok({ success: true });
  } catch (err) {
    return fail(err, 500);
  }
}
