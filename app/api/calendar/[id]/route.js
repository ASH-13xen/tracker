import * as calendarService from "@/lib/services/calendar.service";
import { ok, fail } from "@/lib/utils/api-response";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await calendarService.updateEvent(id, body);
    return ok(updated);
  } catch (err) {
    return fail(err, 500);
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await calendarService.deleteEvent(id);
    return ok({ success: true });
  } catch (err) {
    return fail(err, 500);
  }
}
