import * as dsaService from "@/lib/services/dsa.service";
import { ok, fail } from "@/lib/utils/api-response";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { field, done, date, isRevision } = await request.json();
    if (field !== "theory" && field !== "practice") {
      return fail("field must be 'theory' or 'practice'");
    }
    const updated =
      field === "theory"
        ? await dsaService.markTheory(id, done, date, isRevision)
        : await dsaService.markPractice(id, done, date, isRevision);
    return ok(updated);
  } catch (err) {
    return fail(err, 500);
  }
}
