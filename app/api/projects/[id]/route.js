import * as projectService from "@/lib/services/project.service";
import { ok, fail } from "@/lib/utils/api-response";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const project = await projectService.getProject(id);
    if (!project) return fail("Project not found", 404);
    return ok(project);
  } catch (err) {
    return fail(err, 500);
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await projectService.updateProject(id, body);
    return ok(updated);
  } catch (err) {
    return fail(err, 500);
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await projectService.deleteProject(id);
    return ok({ success: true });
  } catch (err) {
    return fail(err, 500);
  }
}
