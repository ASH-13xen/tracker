import * as dashboardService from "@/lib/services/dashboard.service";
import { ok, fail } from "@/lib/utils/api-response";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") || undefined;
    const data = await dashboardService.getDashboard(date);
    return ok(data);
  } catch (err) {
    return fail(err, 500);
  }
}
