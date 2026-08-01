import { SESSION_COOKIE } from "@/lib/services/auth.service";
import { ok } from "@/lib/utils/api-response";

export async function POST() {
  const response = ok({ success: true });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
