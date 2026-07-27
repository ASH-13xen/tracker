import * as projectService from "@/lib/services/project.service";
import { ok, fail } from "@/lib/utils/api-response";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const created = await projectService.addTimeLog({ ...body, projectId: id });
    return ok(created, { status: 201 });
  } catch (err) {
    return fail(err, 500);
  }
}
