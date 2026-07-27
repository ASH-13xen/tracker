import * as dsaService from "@/lib/services/dsa.service";
import { ok, fail } from "@/lib/utils/api-response";

export async function GET() {
  try {
    const tree = await dsaService.getSyllabus();
    return ok(tree);
  } catch (err) {
    return fail(err, 500);
  }
}
