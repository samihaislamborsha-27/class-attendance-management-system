"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT SIDE */}
        <section className="hidden bg-slate-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-bold">ClassTrack</h1>
            <p className="mt-1 text-sm text-slate-400">
              Daffodil Institute of IT
            </p>
          </Link>

          <div className="max-w-lg">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-blue-400">
              Attendance Management
            </p>

            <h2 className="text-5xl font-bold leading-tight">
              Your classroom,
              <span className="block text-blue-400">
                organized in one place.
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              Record attendance, manage courses and monitor student attendance
              through one simple teacher dashboard.
            </p>
          </div>

          <p className="text-sm text-slate-500">
            ClassTrack · Academic Attendance System
          </p>
        </section>

        {/* RIGHT SIDE */}
        <section className="flex items-center justify-center bg-white px-6 py-12">
          <div className="w-full max-w-md">
            {/* MOBILE LOGO */}
            <Link href="/" className="mb-12 block lg:hidden">
              <h1 className="text-2xl font-bold text-slate-900">ClassTrack</h1>
              <p className="text-sm text-slate-500">
                Daffodil Institute of IT
              </p>
            </Link>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Teacher Portal
              </p>

              <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
                Welcome back.
              </h2>

              <p className="mt-3 text-slate-500">
                Sign in to access your attendance dashboard.
              </p>
            </div>

            <form onSubmit={handleLogin} className="mt-10 space-y-6">
              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teacher@diit.edu"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 pr-20 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500 hover:text-slate-900"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* REMEMBER */}
              <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                />
                Remember me
              </label>

              {/* LOGIN */}
              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700"
              >
                Sign In
              </button>
            </form>

            <div className="mt-8 border-t border-slate-200 pt-6">
              <p className="text-center text-sm text-slate-500">
                Teacher access only
              </p>

              <Link
                href="/"
                className="mt-4 block text-center text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                ← Back to homepage
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}