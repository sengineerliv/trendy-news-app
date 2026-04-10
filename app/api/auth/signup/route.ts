import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE } from "@/lib/session";
import { createUser, findUserByEmail } from "@/lib/users";

type SignupBody = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as SignupBody;
  const email = body.email?.trim().toLowerCase();
  const password = body.password?.trim();

  if (!email || !password || password.length < 8) {
    return NextResponse.json(
      { error: "Email and password are required (password min 8 chars)." },
      { status: 400 },
    );
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return NextResponse.json({ error: "Account already exists." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await createUser(email, passwordHash);
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
