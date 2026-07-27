import * as exerciseService from "@/lib/services/exercise.service";
import { ok, fail } from "@/lib/utils/api-response";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = Number(searchParams.get("days") || 90);
    const summary = await exerciseService.getSummary(days);
    return ok(summary);
  } catch (err) {
    return fail(err, 500);
  }
}
