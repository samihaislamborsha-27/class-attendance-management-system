"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

const courses = [
  {
    id: "software-engineering",
    code: "SE",
    name: "Software Engineering",
    semester: "6th Semester",
    teacher: "NJS",
    room: "701",
    section: "A / C",
    students: 40,
    schedule: "Sunday, Monday, Tuesday & Thursday",
  },
  {
    id: "computer-networking",
    code: "CN",
    name: "Computer Networking",
    semester: "6th Semester",
    teacher: "MMR",
    room: "701 / 702",
    section: "A / C",
    students: 40,
    schedule: "Sunday, Monday, Tuesday & Thursday",
  },
  {
    id: "theory-of-computation",
    code: "TOC",
    name: "Theory of Computation",
    semester: "6th Semester",
    teacher: "TCO",
    room: "701 / 702",
    section: "A / C",
    students: 40,
    schedule: "Monday & Tuesday",
  },
  {
    id: "embedded-system-programming",
    code: "ESP",
    name: "Embedded System Programming",
    semester: "6th Semester",
    teacher: "RKD",
    room: "701 / 702",
    section: "A / C",
    students: 40,
    schedule: "Monday, Tuesday, Wednesday & Thursday",
  },
];

export default function CourseDetailsPage() {
  const params = useParams();
  const id = String(params.id);

  const course = courses.find((item) => item.id === id) ?? courses[0];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">ClassTrack</h1>
              <p className="text-sm text-slate-500">
                Daffodil Institute of IT
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
          Course Details
        </p>

        <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
          {course.name}
        </h2>

        <p className="mt-2 text-slate-500">
          {course.code} · {course.semester}
        </p>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Teacher</p>
            <p className="mt-2 text-xl font-bold">{course.teacher}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Section</p>
            <p className="mt-2 text-xl font-bold">{course.section}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Room</p>
            <p className="mt-2 text-xl font-bold">{course.room}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Students</p>
            <p className="mt-2 text-xl font-bold">{course.students}</p>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm font-semibold text-slate-500">
            CLASS SCHEDULE
          </p>

          <h3 className="mt-2 text-xl font-bold">{course.schedule}</h3>

          <p className="mt-2 text-sm text-slate-500">
            Based on the 6th semester class schedule.
          </p>
        </section>

        <section className="mt-6 rounded-2xl bg-slate-900 p-6 text-white">
          <p className="text-sm font-semibold text-blue-300">
            ATTENDANCE
          </p>

          <h3 className="mt-2 text-2xl font-bold">
            Manage student attendance
          </h3>

          <p className="mt-2 text-slate-300">
            Mark students present or absent for this course.
          </p>

          <Link
            href="/attendance"
            className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Take Attendance
          </Link>
        </section>
      </div>
    </main>
  );
}