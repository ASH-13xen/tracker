import * as sebiService from "@/lib/services/sebi.service";
import { ok, fail } from "@/lib/utils/api-response";

export async function POST(request) {
  try {
    const body = await request.json();
    const created = await sebiService.addSubject(body);
    return ok(created, { status: 201 });
  } catch (err) {
    return fail(err, 500);
  }
}
