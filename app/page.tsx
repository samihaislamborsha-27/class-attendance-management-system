import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="bg-white text-slate-900">
        <section className="mx-auto flex min-h-[calc(100vh-81px)] max-w-7xl items-center px-6 py-20 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              Class Attendance Management System
            </div>

            <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Manage classroom
              <span className="block text-blue-600">attendance with ease.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">
              A centralized attendance management system for teachers to manage
              courses, record daily attendance, monitor students, and review
              semester attendance records.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <button className="rounded-lg bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700">
                Teacher Login
              </button>

              <a
                href="#features"
                className="rounded-lg border border-slate-300 px-6 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Learn More
              </a>
            </div>

            <div className="mt-14 flex flex-wrap gap-x-10 gap-y-5 border-t border-slate-200 pt-7">
              <div>
                <p className="text-2xl font-bold text-slate-950">Daily</p>
                <p className="mt-1 text-sm text-slate-500">
                  Attendance Tracking
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-slate-950">Semester</p>
                <p className="mt-1 text-sm text-slate-500">
                  Attendance Overview
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-slate-950">Centralized</p>
                <p className="mt-1 text-sm text-slate-500">
                  Course Management
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="border-t border-slate-200 bg-slate-50"
        >
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
              Core Features
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Everything needed to manage attendance
            </h2>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-7">
                <h3 className="text-xl font-bold">Course Management</h3>
                <p className="mt-3 leading-7 text-slate-600">
                  View assigned courses, class schedules, departments, and
                  student information in one place.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-7">
                <h3 className="text-xl font-bold">Take Attendance</h3>
                <p className="mt-3 leading-7 text-slate-600">
                  Teachers can quickly record daily student attendance for each
                  scheduled class.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-7">
                <h3 className="text-xl font-bold">Semester Overview</h3>
                <p className="mt-3 leading-7 text-slate-600">
                  Review attendance records and understand the overall
                  attendance scenario throughout the semester.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="bg-white">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <p className="text-sm font-semibold text-slate-500">
              Developed for academic class attendance management
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">
              Daffodil Institute of IT
            </h2>
          </div>
        </section>
      </main>
    </>
  );
}