import * as calendarService from "@/lib/services/calendar.service";
import { ok, fail } from "@/lib/utils/api-response";

export async function GET() {
  try {
    const events = await calendarService.getAllEvents();
    return ok(events);
  } catch (err) {
    return fail(err, 500);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const created = await calendarService.createEvent(body);
    return ok(created, { status: 201 });
  } catch (err) {
    return fail(err, 500);
  }
}
