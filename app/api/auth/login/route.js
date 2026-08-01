import {
  verifyPassword,
  createSessionToken,
  SESSION_COOKIE,
} from "@/lib/services/auth.service";
import { ok, fail } from "@/lib/utils/api-response";

const THIRTY_DAYS = 60 * 60 * 24 * 30;

export async function POST(request) {
  try {
    const { password } = await request.json();
    const valid = await verifyPassword(password);
    if (!valid) return fail("Incorrect password", 401);

    const response = ok({ success: true });
    response.cookies.set(SESSION_COOKIE, createSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: THIRTY_DAYS,
    });
    return response;
  } catch (err) {
    return fail(err, 500);
  }
}
