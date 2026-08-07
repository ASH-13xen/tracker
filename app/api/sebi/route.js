import * as sebiService from "@/lib/services/sebi.service";
import { ok, fail } from "@/lib/utils/api-response";

export async function GET() {
  try {
    await sebiService.seedDefaultSyllabus();
    const tree = await sebiService.getSyllabus();
    return ok(tree);
  } catch (err) {
    return fail(err, 500);
  }
}
