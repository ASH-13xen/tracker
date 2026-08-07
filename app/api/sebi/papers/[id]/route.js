import * as sebiService from "@/lib/services/sebi.service";
import { ok, fail } from "@/lib/utils/api-response";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await sebiService.renamePaper(id, body);
    return ok(updated);
  } catch (err) {
    return fail(err, 500);
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await sebiService.removePaper(id);
    return ok({ success: true });
  } catch (err) {
    return fail(err, 500);
  }
}
