import * as foodService from "@/lib/services/food.service";
import { ok, fail } from "@/lib/utils/api-response";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await foodService.updateEntry(id, body);
    return ok(updated);
  } catch (err) {
    return fail(err, 500);
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await foodService.removeEntry(id);
    return ok({ success: true });
  } catch (err) {
    return fail(err, 500);
  }
}
