import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import LogoutButton from "@/components/logout-button";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const session = verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);

  if (!session) {
    redirect("/login");
  }

  return (
    <main>
      <div className="card stack">
        <div className="row-between">
          <h1>Dashboard</h1>
          <LogoutButton />
        </div>
        <p>Welcome, {session.email}</p>
        <p className="muted">This page is protected by your signed auth cookie.</p>
      </div>
    </main>
  );
}
