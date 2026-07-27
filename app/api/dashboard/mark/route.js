import * as dashboardService from "@/lib/services/dashboard.service";
import { ok, fail } from "@/lib/utils/api-response";

export async function POST(request) {
  try {
    const { activity, done, date } = await request.json();
    if (!activity) return fail("activity is required");
    const updated = await dashboardService.markActivity(activity, done, date);
    return ok(updated);
  } catch (err) {
    return fail(err, 500);
  }
}
