"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";

const SESSION_KEY = "classtrack-demo-session";

export default function LoginPage() {
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signedInEmail, setSignedInEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function readSession() {
      try {
        const saved = localStorage.getItem(SESSION_KEY);
        const session: unknown = saved ? JSON.parse(saved) : null;

        if (
          session &&
          typeof session === "object" &&
          "email" in session &&
          typeof session.email === "string"
        ) {
          setSignedInEmail(session.email);
        } else {
          setSignedInEmail("");
        }
      } catch {
        setSignedInEmail("");
        setError("Browser storage is unavailable. Please try again.");
      }

      setReady(true);
    }

    const timer = window.setTimeout(readSession, 0);

    window.addEventListener("storage", readSession);
    window.addEventListener("focus", readSession);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("storage", readSession);
      window.removeEventListener("focus", readSession);
    };
  }, []);

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const cleanEmail = email.trim();

    if (!cleanEmail || !password.trim()) {
      setError("Enter your email and password.");
      return;
    }

    try {
      // Demo session only. Never save the password.
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ email: cleanEmail })
      );

      setSignedInEmail(cleanEmail);
      setPassword("");

      window.alert("Signed in successfully!");
      router.push("/dashboard");
    } catch {
      setError("Could not remember your sign-in. Check browser storage.");
    }
  }

  function handleSignOut() {
    try {
      localStorage.removeItem(SESSION_KEY);
      setSignedInEmail("");
      setEmail("");
      setPassword("");
      setError("");
    } catch {
      setError("Could not sign out. Please try again.");
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100";

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-green-50 via-white to-blue-50 px-5 py-12 text-slate-900">
      <section className="w-full max-w-md rounded-2xl border border-green-100 bg-white p-7 shadow-sm sm:p-9">
        <Link
          href="/"
          className="text-2xl font-bold text-blue-800"
        >
          Class<span className="text-green-700">Track</span>
        </Link>

        {!ready ? (
          <p className="mt-8 text-slate-600">Loading…</p>
        ) : signedInEmail ? (
          <div className="mt-8">
            <div className="rounded-xl bg-green-50 p-5">
              <h1 className="text-xl font-bold text-green-800">
                You’re already signed in
              </h1>

              <p className="mt-2 break-all text-slate-600">
                {signedInEmail}
              </p>
            </div>

            <Link
              href="/dashboard"
              className="mt-6 block rounded-xl bg-blue-800 px-5 py-3 text-center font-semibold text-white hover:bg-blue-900"
            >
              Open Dashboard
            </Link>
            <Link
             href="/profile"
             className="mt-3 block rounded-xl border border-green-700 px-5 py-3 text-center font-semibold text-green-800 hover:bg-green-50"
            >
            My Profile
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="mt-3 w-full rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Sign out
            </button>
          </div>
        ) : (
          <>
            <h1 className="mt-8 text-2xl font-bold">
              Teacher Login
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Demo access · No password verification yet.
            </p>

            <form onSubmit={handleLogin} className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block font-medium"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Your email address"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block font-medium"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Demo password"
                    className={`${inputClass} pr-20`}
                  />

                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute inset-y-0 right-4 text-sm font-semibold text-blue-800"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800"
              >
                Sign In
              </button>
            </form>
          </>
        )}

        {error && (
          <p role="alert" className="mt-5 text-sm text-red-700">
            {error}
          </p>
        )}

        <Link
          href="/"
          className="mt-6 block text-center text-sm font-semibold text-blue-800"
        >
          ← Back to Home
        </Link>
      </section>
    </main>
  );
}