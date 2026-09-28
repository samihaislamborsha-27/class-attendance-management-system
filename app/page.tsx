export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">ClassTrack</h1>
            <p className="text-xs text-slate-500">
              Attendance Management System
            </p>
          </div>

          <button className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white">
            Teacher Login
          </button>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-blue-600">
          Academic Attendance Portal
        </p>

        <h2 className="max-w-3xl text-5xl font-bold leading-tight text-slate-900">
          Manage classroom attendance with ease.
        </h2>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          A centralized system for teachers to manage courses, take daily
          attendance, monitor students, and review semester attendance records.
        </p>

        <div className="mt-8 flex gap-4">
          <button className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white">
            Teacher Login
          </button>

          <button className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700">
            Learn More
          </button>
        </div>
      </section>
    </main>
  );
}