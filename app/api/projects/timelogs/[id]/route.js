import * as projectService from "@/lib/services/project.service";
import { ok, fail } from "@/lib/utils/api-response";

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await projectService.removeTimeLog(id);
    return ok({ success: true });
  } catch (err) {
    return fail(err, 500);
  }
}
