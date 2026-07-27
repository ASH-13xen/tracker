import * as skillService from "@/lib/services/skill.service";
import { ok, fail } from "@/lib/utils/api-response";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const [skill, tree] = await Promise.all([
      skillService.getSkill(id),
      skillService.getTreeForSkill(id),
    ]);
    if (!skill) return fail("Skill not found", 404);
    return ok({ ...skill, ...tree });
  } catch (err) {
    return fail(err, 500);
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await skillService.updateSkill(id, body);
    return ok(updated);
  } catch (err) {
    return fail(err, 500);
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await skillService.deleteSkill(id);
    return ok({ success: true });
  } catch (err) {
    return fail(err, 500);
  }
}
