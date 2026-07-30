import * as dsaService from "@/lib/services/dsa.service";
import { ok, fail } from "@/lib/utils/api-response";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { done, date } = await request.json();
    const updated = await dsaService.markPractice(id, done, date);
    return ok(updated);
  } catch (err) {
    return fail(err, 500);
  }
}
