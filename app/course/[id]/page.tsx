"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  attendanceStats,
  errorText,
  readAttendance,
  readCourses,
  writeCourses,
} from "../../lib/classtrack";
import type { AttendanceRecords, Course } from "../../lib/classtrack";

const detailFields = [
  ["teacher", "Teacher"],
  ["section", "Section"],
  ["room", "Room"],
  ["time", "Class time"],
  ["schedule", "Weekly schedule"],
] as const;

export default function CourseDetailsPage() {
  const params = useParams();
  const id = String(params.id);

  const [course, setCourse] = useState<Course | null>(null);
  const [records, setRecords] = useState<AttendanceRecords>({});
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        setCourse(readCourses().find((item) => item.id === id) ?? null);
        setRecords(readAttendance());
        setError("");
      } catch (error) {
        setError(errorText(error));
      }
      setReady(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [id]);

  function changeRoster(
    transform: (students: Course["students"]) => Course["students"]
  ) {
    const latest = readCourses();
    const savedCourse = latest.find((item) => item.id === id);

    if (!savedCourse) throw new Error("Course no longer exists.");

    const updated = {
      ...savedCourse,
      students: transform(savedCourse.students),
    };

    writeCourses(latest.map((item) => (item.id === id ? updated : item)));

    // Preserve any unsaved edits in the course-information form.
    setCourse((current) =>
      current ? { ...current, students: updated.students } : updated
    );
  }

  function addStudent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanName = name.trim();
    const cleanRoll = roll.trim().toUpperCase();

    if (!cleanName || !cleanRoll) return;

    try {
      changeRoster((students) => {
        if (
          students.some(
            (student) => student.roll.trim().toUpperCase() === cleanRoll
          )
        ) {
          throw new Error("This roll number is already enrolled.");
        }

        return [
          ...students,
          { id: crypto.randomUUID(), name: cleanName, roll: cleanRoll },
        ];
      });

      setName("");
      setRoll("");
      window.alert("Student added successfully!");
    } catch (error) {
      window.alert(errorText(error));
    }
  }

  function removeStudent(studentId: string) {
    if (
      !window.confirm(
        "Remove this student from the current roster? Saved attendance history will remain."
      )
    ) {
      return;
    }

    try {
      changeRoster((students) =>
        students.filter((student) => student.id !== studentId)
      );
    } catch (error) {
      window.alert(errorText(error));
    }
  }

  function saveDetails(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!course) return;

    try {
      const latest = readCourses();
      const savedCourse = latest.find((item) => item.id === id);
      if (!savedCourse) throw new Error("Course no longer exists.");

      const updated: Course = {
        ...savedCourse,
        teacher: course.teacher.trim() || "TBA",
        section: course.section.trim() || "TBA",
        room: course.room.trim() || "TBA",
        time: course.time.trim() || "TBA",
        schedule: course.schedule.trim() || "Not set",
      };

      writeCourses(latest.map((item) => (item.id === id ? updated : item)));
      setCourse(updated);
      window.alert("Course information saved!");
    } catch (error) {
      window.alert(errorText(error));
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-700";

  if (!ready) return <main className="p-10">Loading course…</main>;

  if (error || !course) {
    return (
      <main className="p-10">
        <p role="alert">{error || "Course not found."}</p>
        <Link href="/dashboard" className="mt-5 inline-block text-blue-700">
          ← Dashboard
        </Link>
      </main>
    );
  }

  const overall = attendanceStats(records, course.id);

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="text-2xl font-bold text-blue-800">
            Class<span className="text-green-700">Track</span>
          </Link>
          <Link href="/dashboard" className="font-semibold text-blue-700">
            ← Dashboard
          </Link>
        </header>

        <h1 className="mt-10 text-3xl font-bold">{course.name}</h1>
        <p className="mt-2 text-slate-600">
          {course.code} · {course.semester}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <span className="rounded-xl bg-green-100 px-4 py-3 font-semibold text-green-900">
            {course.students.length} students · Attendance {overall.percentage}
          </span>
          <Link
            href={`/attendance?course=${encodeURIComponent(course.id)}`}
            className="rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white"
          >
            Take Attendance
          </Link>
        </div>

        <form onSubmit={saveDetails} className="mt-8 rounded-2xl border bg-white p-6">
          <h2 className="text-xl font-bold">Course information</h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {detailFields.map(([key, label]) => (
              <label key={key} className={key === "schedule" ? "sm:col-span-2" : ""}>
                <span className="mb-2 block font-medium">{label}</span>
                <input
                  value={course[key]}
                  maxLength={200}
                  onChange={(event) =>
                    setCourse({ ...course, [key]: event.target.value })
                  }
                  className={inputClass}
                />
              </label>
            ))}
          </div>

          <button className="mt-5 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white">
            Save Course Information
          </button>
        </form>

        <section className="mt-8 rounded-2xl border bg-white p-6">
          <h2 className="text-xl font-bold">Add a student</h2>

          <form onSubmit={addStudent} className="mt-5 grid gap-4 sm:grid-cols-2">
            <label>
              <span className="mb-2 block font-medium">Student name</span>
              <input
                required
                value={name}
                maxLength={100}
                onChange={(event) => setName(event.target.value)}
                className={inputClass}
              />
            </label>
            <label>
              <span className="mb-2 block font-medium">Roll number</span>
              <input
                required
                value={roll}
                maxLength={50}
                onChange={(event) => setRoll(event.target.value)}
                className={inputClass}
              />
            </label>
            <button className="rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white sm:col-span-2">
              Add Student
            </button>
          </form>
        </section>

        <section className="mt-8 rounded-2xl border bg-white p-6">
          <h2 className="text-xl font-bold">Students and attendance</h2>
          <p className="mt-2 text-sm text-slate-500">
            Percentages use saved sessions for this course. Roster changes
            apply to new sessions; existing sessions keep their original students.
          </p>

          {course.students.length === 0 ? (
            <p className="py-8 text-slate-500">Add your first student above.</p>
          ) : (
            <div className="mt-5 divide-y">
              {course.students.map((student) => {
                const stats = attendanceStats(records, course.id, student.id);

                return (
                  <div key={student.id} className="flex flex-wrap items-center justify-between gap-4 py-5">
                    <div>
                      <p className="font-semibold">{student.name}</p>
                      <p className="text-sm text-slate-500">{student.roll}</p>
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="text-right">
                        <p className="font-bold text-green-700">
                          {stats.percentage}
                        </p>
                        <p className="text-sm text-slate-500">
                          {stats.present}/{stats.total} attended
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeStudent(student.id)}
                        className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}