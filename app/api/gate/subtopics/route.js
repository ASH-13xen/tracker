import * as gateService from "@/lib/services/gate.service";
import { ok, fail } from "@/lib/utils/api-response";

export async function POST(request) {
  try {
    const body = await request.json();
    const created = await gateService.addSubtopic(body);
    return ok(created, { status: 201 });
  } catch (err) {
    return fail(err, 500);
  }
}
