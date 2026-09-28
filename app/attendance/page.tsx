"use client";

import Link from "next/link";
import { useState } from "react";

type AttendanceStatus = "present" | "absent" | null;

type Student = {
  id: number;
  name: string;
  roll: string;
  status: AttendanceStatus;
};

const initialStudents: Student[] = [
  { id: 1, name: "Student 01", roll: "CSE-2201", status: null },
  { id: 2, name: "Student 02", roll: "CSE-2202", status: null },
  { id: 3, name: "Student 03", roll: "CSE-2203", status: null },
  { id: 4, name: "Student 04", roll: "CSE-2204", status: null },
  { id: 5, name: "Student 05", roll: "CSE-2205", status: null },
];

export default function AttendancePage() {
  const [students, setStudents] = useState(initialStudents);
  const [saved, setSaved] = useState(false);

  const updateStatus = (
    id: number,
    status: AttendanceStatus
  ) => {
    setSaved(false);

    setStudents((currentStudents) =>
      currentStudents.map((student) =>
        student.id === id
          ? { ...student, status }
          : student
      )
    );
  };

  const presentCount = students.filter(
    (student) => student.status === "present"
  ).length;

  const absentCount = students.filter(
    (student) => student.status === "absent"
  ).length;

  const handleSave = () => {
    setSaved(true);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/dashboard">
            <div>
              <h1 className="text-2xl font-bold">
                ClassTrack
              </h1>

              <p className="text-xs text-slate-500">
                Daffodil Institute of IT
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <section>
          <p className="text-sm font-semibold text-blue-600">
            ATTENDANCE
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Software Engineering
          </h2>

          <p className="mt-2 text-slate-500">
            Section A · Room 701 · 11:40 AM
          </p>
        </section>

        <section className="mt-8 grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              Students
            </p>

            <p className="mt-2 text-2xl font-bold">
              {students.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              Present
            </p>

            <p className="mt-2 text-2xl font-bold text-green-600">
              {presentCount}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              Absent
            </p>

            <p className="mt-2 text-2xl font-bold text-red-600">
              {absentCount}
            </p>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {students.map((student) => (
            <div
              key={student.id}
              className="flex flex-col gap-4 border-b border-slate-100 p-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold">
                  {student.name}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {student.roll}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    updateStatus(student.id, "present")
                  }
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    student.status === "present"
                      ? "bg-green-600 text-white"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-green-50"
                  }`}
                >
                  Present
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateStatus(student.id, "absent")
                  }
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    student.status === "absent"
                      ? "bg-red-600 text-white"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-red-50"
                  }`}
                >
                  Absent
                </button>
              </div>
            </div>
          ))}
        </section>

        {saved && (
          <div className="mt-5 rounded-xl bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
            Attendance saved successfully.
          </div>
        )}

        <button
          type="button"
          onClick={handleSave}
          className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Save Attendance
        </button>
      </div>
    </main>
  );
}