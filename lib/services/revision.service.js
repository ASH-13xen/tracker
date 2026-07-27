import * as gateService from "@/lib/services/gate.service";
import * as dsaService from "@/lib/services/dsa.service";
import { todayKey } from "@/lib/utils/date-helpers";

export async function getDueForRevision() {
  const [gateDue, dsaDue] = await Promise.all([
    gateService.getDueForRevision(),
    dsaService.getDueForRevision(),
  ]);
  return [...gateDue, ...dsaDue].sort(
    (a, b) => new Date(a.nextRevisionDue) - new Date(b.nextRevisionDue)
  );
}

export async function markRevised(category, id, dateKey = todayKey()) {
  if (category === "gate") return gateService.markRevised(id, dateKey);
  if (category === "dsa") return dsaService.markRevised(id, dateKey);
  throw new Error(`Unknown revision category: ${category}`);
}
