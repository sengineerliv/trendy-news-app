import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "auth_session";
const ONE_DAY_SECONDS = 60 * 60 * 24;

type SessionPayload = {
  userId: string;
  email: string;
  exp: number;
};

function getSecret() {
  return process.env.AUTH_SECRET ?? "dev-insecure-secret-change-me";
}

function base64url(input: string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function unbase64url(input: string) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return Buffer.from(`${normalized}${padding}`, "base64").toString("utf8");
}

function sign(data: string) {
  return base64url(createHmac("sha256", getSecret()).update(data).digest("base64"));
}

export function createSessionToken(userId: string, email: string, maxAgeSeconds = ONE_DAY_SECONDS) {
  const payload: SessionPayload = {
    userId,
    email,
    exp: Math.floor(Date.now() / 1000) + maxAgeSeconds,
  };
  const encodedPayload = base64url(JSON.stringify(payload));
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const [encodedPayload, providedSignature] = token.split(".");
  if (!encodedPayload || !providedSignature) return null;

  const expectedSignature = sign(encodedPayload);
  const provided = Buffer.from(providedSignature);
  const expected = Buffer.from(expectedSignature);

  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return null;
  }

  try {
    const payload = JSON.parse(unbase64url(encodedPayload)) as SessionPayload;
    if (!payload?.userId || !payload?.email || typeof payload.exp !== "number") {
      return null;
    }
    if (payload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
