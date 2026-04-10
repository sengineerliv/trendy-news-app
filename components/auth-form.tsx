"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type AuthFormProps = {
  mode: "login" | "signup";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isLogin = mode === "login";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(body.error ?? "Request failed.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <div className="card stack">
        <h1>{isLogin ? "Log in" : "Create account"}</h1>
        <p className="muted">Use your email and password.</p>
        <form className="stack" onSubmit={onSubmit}>
          <label className="stack">
            <span>Email</span>
            <input
              className="input"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </label>
          <label className="stack">
            <span>Password</span>
            <input
              className="input"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
          </label>

          {error ? <p className="error">{error}</p> : null}

          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Please wait..." : isLogin ? "Log in" : "Create account"}
          </button>
        </form>
        <p className="muted">
          {isLogin ? "Need an account? " : "Already have an account? "}
          <Link href={isLogin ? "/signup" : "/login"}>
            {isLogin ? "Sign up" : "Log in"}
          </Link>
        </p>
      </div>
    </main>
  );
}
