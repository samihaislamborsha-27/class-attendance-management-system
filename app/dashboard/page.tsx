"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import AddCourseModel from "../components/AddCourseModel";
import {
  attendanceStats,
  errorText,
  readAttendance,
  readCourses,
  writeCourses,
} from "../lib/classtrack";
import type { AttendanceRecords, Course } from "../lib/classtrack";

export default function DashboardPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [records, setRecords] = useState<AttendanceRecords>({});
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [teacherName, setTeacherName] = useState("Teacher");
  const [photo, setPhoto] = useState("");

  useEffect(() => {
    function load() {
      try {
        const nextCourses = readCourses();
        const nextRecords = readAttendance();

        setCourses(nextCourses);
        setRecords(nextRecords);
        setError("");
      } catch (error) {
        setError(errorText(error));
      }

      try {
        const session = JSON.parse(
          localStorage.getItem("classtrack-demo-session") || "null"
        );

        const email =
          typeof session?.email === "string"
            ? session.email.trim().toLowerCase()
            : "";

        const profile = email
          ? JSON.parse(
              localStorage.getItem(`classtrack-profile-v1:${email}`) || "null"
            )
          : null;

        setTeacherName(profile?.name || "Teacher");

        setPhoto(
          typeof profile?.photo === "string" &&
            /^data:image\/(jpeg|png|webp);base64,/.test(profile.photo)
            ? profile.photo
            : ""
        );
      } catch {
        setTeacherName("Teacher");
        setPhoto("");
      }

      setReady(true);
    }

    const timer = window.setTimeout(load, 0);
    window.addEventListener("focus", load);
    window.addEventListener("storage", load);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("focus", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  function handleAddCourse(input: {
    name: string;
    code: string;
    semester: string;
  }) {
    try {
      const latest = readCourses();

      if (
        latest.some(
          (course) =>
            course.code.toLowerCase() === input.code.trim().toLowerCase() &&
            course.semester.toLowerCase() === input.semester.trim().toLowerCase()
        )
      ) {
        window.alert("This course code already exists in that semester.");
        return;
      }

      const course: Course = {
        id: crypto.randomUUID(),
        name: input.name.trim(),
        code: input.code.trim().toUpperCase(),
        semester: input.semester.trim(),
        teacher: teacherName,
        section: "A",
        room: "TBA",
        time: "TBA",
        schedule: "Not set",
        students: [],
      };

      const next = [...latest, course];
      writeCourses(next);
      setCourses(next);
      setError("");
      window.alert("Course saved! Click View to add students.");
    } catch (error) {
      window.alert(`Course could not be saved. ${errorText(error)}`);
    }
  }

  const uniqueStudents = new Set(
    courses.flatMap((course) =>
      course.students.map((student) => student.roll.trim().toUpperCase())
    )
  ).size;

  const average = attendanceStats(records);

  const initials =
    teacherName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "T";

  if (!ready) {
    return <main className="p-10">Loading dashboard…</main>;
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5">
          <Link href="/" className="text-2xl font-bold text-blue-800">
            Class<span className="text-green-700">Track</span>
          </Link>

          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-lg p-1"
          >
            <span className="hidden font-semibold sm:block">
              {teacherName}
            </span>

            <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-blue-800 font-bold text-white">
              {photo ? (
                <Image
                  src={photo}
                  alt="My profile"
                  width={48}
                  height={48}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10">
        <section className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="font-semibold text-green-700">TEACHER DASHBOARD</p>
            <h1 className="mt-2 text-3xl font-bold">
              Welcome back, {teacherName}.
            </h1>
          </div>

          <button
            type="button"
            disabled={Boolean(error)}
            onClick={() => setIsAddCourseOpen(true)}
            className="rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50"
          >
            + Add Course
          </button>
        </section>

        {error ? (
          <p role="alert" className="mt-8 rounded-xl bg-red-50 p-5 text-red-700">
            {error} Refresh to retry. Existing data has not been changed.
          </p>
        ) : (
          <>
            <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Courses", courses.length],
                ["Unique students", uniqueStudents],
                ["Saved sessions", Object.keys(records).length],
                ["Overall attendance", average.percentage],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border bg-white p-6">
                  <p className="text-slate-500">{label}</p>
                  <p className="mt-3 text-3xl font-bold text-blue-800">
                    {value}
                  </p>
                </div>
              ))}
            </section>

            <p className="mt-3 text-sm text-slate-500">
              Attendance is calculated from saved present and absent marks.
              Students are counted by roll number.
            </p>

            <section className="mt-10">
              <h2 className="mb-5 text-2xl font-bold">Your courses</h2>

              <div className="grid gap-5 md:grid-cols-2">
                {courses.map((course) => {
                  const stats = attendanceStats(records, course.id);

                  return (
                    <article key={course.id} className="rounded-2xl border bg-white p-6">
                      <p className="font-semibold text-green-700">{course.code}</p>
                      <h3 className="mt-2 text-xl font-bold">{course.name}</h3>
                      <p className="mt-2 text-sm text-slate-500">
                        {course.semester} · Section {course.section}
                      </p>

                      <dl className="mt-6 grid grid-cols-2 gap-5">
                        {[
                          ["Students", course.students.length],
                          ["Attendance", stats.percentage],
                          ["Room", course.room],
                          ["Class time", course.time],
                        ].map(([label, value]) => (
                          <div key={label}>
                            <dt className="text-sm text-slate-500">{label}</dt>
                            <dd className="mt-1 font-semibold">{value}</dd>
                          </div>
                        ))}
                      </dl>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <Link
                          href={`/attendance?course=${encodeURIComponent(course.id)}`}
                          className="rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white"
                        >
                          Take Attendance
                        </Link>
                        <Link
                          href={`/course/${encodeURIComponent(course.id)}`}
                          className="rounded-lg border px-4 py-3 font-semibold text-green-800"
                        >
                          View / Students
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </>
        )}

        <footer className="mt-12 border-t pt-6 text-center text-sm text-slate-500">
          Daffodil Institute of IT · Saved in this browser only
        </footer>
      </div>

      <AddCourseModel
        isOpen={isAddCourseOpen}
        onClose={() => setIsAddCourseOpen(false)}
        onAddCourse={handleAddCourse}
      />
    </main>
  );
}