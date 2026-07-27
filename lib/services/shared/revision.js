import { REVISION_CYCLE_DAYS } from "@/lib/utils/constants";

export function nextRevisionDate(from = new Date()) {
  const d = new Date(from);
  d.setDate(d.getDate() + REVISION_CYCLE_DAYS);
  return d;
}
