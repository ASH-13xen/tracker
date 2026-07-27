import * as projectService from "@/lib/services/project.service";
import { ok, fail } from "@/lib/utils/api-response";

export async function GET() {
  try {
    const projects = await projectService.getAllProjects();
    return ok(projects);
  } catch (err) {
    return fail(err, 500);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const created = await projectService.createProject(body);
    return ok(created, { status: 201 });
  } catch (err) {
    return fail(err, 500);
  }
}
