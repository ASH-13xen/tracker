import * as gateService from "@/lib/services/gate.service";
import { ok, fail } from "@/lib/utils/api-response";

export async function GET() {
  try {
    const tree = await gateService.getSyllabus();
    return ok(tree);
  } catch (err) {
    return fail(err, 500);
  }
}
