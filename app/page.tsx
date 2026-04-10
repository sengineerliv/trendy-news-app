import Link from "next/link";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

export default async function HomePage() {
  const cookieStore = await cookies();
  const session = verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);

  return (
    <main>
      <div className="card stack">
        <h1>Trendy News App</h1>
        <p className="muted">Password auth is enabled with bcryptjs hashing.</p>
        <div className="row">
          <Link href="/signup">Sign up</Link>
          <span>•</span>
          <Link href="/login">Log in</Link>
          <span>•</span>
          <Link href="/dashboard">Dashboard</Link>
        </div>
        {session ? <p>Signed in as {session.email}</p> : <p>Not signed in.</p>}
      </div>
    </main>
  );
}
