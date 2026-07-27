import * as foodService from "@/lib/services/food.service";
import { ok, fail } from "@/lib/utils/api-response";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    if (date) {
      const day = await foodService.getDay(date);
      return ok(day);
    }
    if (start && end) {
      const range = await foodService.getRange(start, end);
      return ok(range);
    }
    return fail("Provide either 'date' or 'start' and 'end'");
  } catch (err) {
    return fail(err, 500);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const created = await foodService.addEntry(body);
    return ok(created, { status: 201 });
  } catch (err) {
    return fail(err, 500);
  }
}
