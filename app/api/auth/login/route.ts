import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE } from "@/lib/session";
import { findUserByEmail } from "@/lib/users";

type LoginBody = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBody;
  const email = body.email?.trim().toLowerCase();
  const password = body.password?.trim();

  if (!email || !password) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const token = createSessionToken(user.id, user.email);
  const response = NextResponse.json({ ok: true, user: { id: user.id, email: user.email } });
  response.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return response;
}
