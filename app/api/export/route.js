import * as exportService from "@/lib/services/export.service";
import { fail } from "@/lib/utils/api-response";

export async function GET() {
  try {
    const data = await exportService.exportAll();
    return new Response(JSON.stringify(data, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="tracker-export-${data.exportedAt.slice(0, 10)}.json"`,
      },
    });
  } catch (err) {
    return fail(err, 500);
  }
}
