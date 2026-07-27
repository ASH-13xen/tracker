import * as heatmapService from "@/lib/services/heatmap.service";
import { ok, fail } from "@/lib/utils/api-response";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "overall";
    const days = Number(searchParams.get("days") || 365);
    const data = await heatmapService.getHeatmap(category, days);
    return ok(data);
  } catch (err) {
    return fail(err, 500);
  }
}
