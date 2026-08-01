import crypto from "crypto";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/connect";
import AuthConfig from "@/lib/models/auth-config";

const SESSION_SUBJECT = "authenticated";
export const SESSION_COOKIE = "session";

async function ensureConfig() {
  await connectDB();
  let config = await AuthConfig.findOne();
  if (!config) {
    const initialPassword = process.env.INITIAL_PASSWORD;
    if (!initialPassword) {
      throw new Error(
        "No password is configured yet. Set INITIAL_PASSWORD in .env.local, then try again."
      );
    }
    const passwordHash = await bcrypt.hash(initialPassword, 10);
    config = await AuthConfig.create({ passwordHash });
  }
  return config;
}

export async function verifyPassword(password) {
  if (!password) return false;
  const config = await ensureConfig();
  return bcrypt.compare(password, config.passwordHash);
}

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set in .env.local");
  return secret;
}

// Pure crypto, no DB access — safe to call from the proxy on every request.
export function createSessionToken() {
  return crypto.createHmac("sha256", getSecret()).update(SESSION_SUBJECT).digest("hex");
}

export function verifySessionToken(token) {
  if (!token) return false;
  const expected = createSessionToken();
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
