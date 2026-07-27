import * as revisionService from "@/lib/services/revision.service";
import { ok, fail } from "@/lib/utils/api-response";

export async function GET() {
  try {
    const data = await revisionService.getDueForRevision();
    return ok(data);
  } catch (err) {
    return fail(err, 500);
  }
}

export async function POST(request) {
  try {
    const { category, id, date } = await request.json();
    if (!category || !id) return fail("category and id are required");
    const updated = await revisionService.markRevised(category, id, date);
    return ok(updated);
  } catch (err) {
    return fail(err, 500);
  }
}
