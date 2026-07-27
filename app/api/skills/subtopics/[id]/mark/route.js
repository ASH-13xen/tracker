import * as skillService from "@/lib/services/skill.service";
import { ok, fail } from "@/lib/utils/api-response";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { field, done, date } = await request.json();
    if (field !== "theory" && field !== "practice") {
      return fail("field must be 'theory' or 'practice'");
    }
    const updated =
      field === "theory"
        ? await skillService.markTheory(id, done, date)
        : await skillService.markPractice(id, done, date);
    return ok(updated);
  } catch (err) {
    return fail(err, 500);
  }
}
