import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { findUserById } from "@/lib/users";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = verifySessionToken(token);

  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const user = await findUserById(session.userId);
  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  return NextResponse.json({ user: { id: user.id, email: user.email } }, { status: 200 });
}
