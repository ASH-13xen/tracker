import * as dashboardService from "@/lib/services/dashboard.service";
import { ok, fail } from "@/lib/utils/api-response";

export async function POST(request) {
  try {
    const { date, note } = await request.json();
    if (!date) return fail("date is required");
    const updated = await dashboardService.setNote(date, note ?? "");
    return ok(updated);
  } catch (err) {
    return fail(err, 500);
  }
}
