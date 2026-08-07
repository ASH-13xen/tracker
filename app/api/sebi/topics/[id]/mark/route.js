import * as sebiService from "@/lib/services/sebi.service";
import { ok, fail } from "@/lib/utils/api-response";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { done, date } = await request.json();
    const updated = await sebiService.markTopic(id, done, date);
    return ok(updated);
  } catch (err) {
    return fail(err, 500);
  }
}
