import * as dsaService from "@/lib/services/dsa.service";
import { ok, fail } from "@/lib/utils/api-response";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await dsaService.renameSubtopic(id, body);
    return ok(updated);
  } catch (err) {
    return fail(err, 500);
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await dsaService.removeSubtopic(id);
    return ok({ success: true });
  } catch (err) {
    return fail(err, 500);
  }
}
