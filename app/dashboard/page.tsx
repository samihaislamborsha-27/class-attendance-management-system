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

import type { AttendanceRecords } from "../lib/classtrack";

import {
  loadUniversityCourses,
} from "../lib/university-courses";

import type {
  UniversityCourse,
} from "../lib/university-courses";

export default function DashboardPage() {
  const [courses, setCourses] = useState<UniversityCourse[]>([]);
  const [records, setRecords] = useState<AttendanceRecords>({});
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  const [teacherName, setTeacherName] = useState("Teacher");
  const [photo, setPhoto] = useState("");

  const [batch, setBatch] = useState("22");
  const [semester, setSemester] = useState("all");
  const [section, setSection] = useState("all");
  const [search, setSearch] = useState("");

  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);

  useEffect(() => {
    function load() {
      try {
        // Read attendance first so a storage error is reported
        // before importing university courses.
        const nextRecords = readAttendance();
        const nextCourses = loadUniversityCourses();

        setRecords(nextRecords);
        setCourses(nextCourses);
        setError("");
      } catch (error) {
        setError(errorText(error));
      }

      try {
        const raw = localStorage.getItem("classtrack-demo-session");
        const session = raw ? JSON.parse(raw) : null;

        const email =
          typeof session?.email === "string"
            ? session.email.trim().toLowerCase()
            : "";

        const profileRaw = email
          ? localStorage.getItem(`classtrack-profile-v1:${email}`)
          : null;

        const profile = profileRaw ? JSON.parse(profileRaw) : null;

        setTeacherName(
          typeof profile?.name === "string" && profile.name.trim()
            ? profile.name.trim()
            : "Teacher"
        );

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

  function changeBatch(value: string) {
    setBatch(value);
    setSemester("all");
    setSection("all");
    setSearch("");
  }

  function handleAddCourse(input: {
    name: string;
    code: string;
    semester: string;
  }) {
    try {
      const latest = readCourses() as UniversityCourse[];

      const selectedBatch = batch === "all" ? "" : batch;

      const selectedSection =
        section === "all" ? "Not specified" : section;

      const duplicate = latest.some(
        (course) =>
          (course.batch || "") === selectedBatch &&
          course.section === selectedSection &&
          course.code.trim().toLowerCase() ===
            input.code.trim().toLowerCase() &&
          course.semester.trim().toLowerCase() ===
            input.semester.trim().toLowerCase()
      );

      if (duplicate) {
        window.alert(
          "This course already exists for the selected batch, section and semester."
        );
        return;
      }

      const newCourse: UniversityCourse = {
        id: crypto.randomUUID(),
        batch: selectedBatch,
        name: input.name.trim(),
        code: input.code.trim().toUpperCase(),
        semester: input.semester.trim(),
        semesterNumber: null,
        teacher: teacherName,
        section: selectedSection,
        students: [],
        room: "TBA",
        time: "TBA",
        schedule: "Not set",
      };

      const next = [...latest, newCourse];

      writeCourses(next);
      setCourses(next);
      setSemester("all");
      setSection("all");
      setSearch("");

      window.alert(
        "Course saved. Click Students / Details to add students."
      );
    } catch (error) {
      window.alert(`Could not save course. ${errorText(error)}`);
    }
  }

  const batches = Array.from(
    new Set(
      courses
        .map((course) => course.batch)
        .filter((value): value is string => Boolean(value))
    )
  ).sort((a, b) => Number(a) - Number(b));

  const batchCourses = courses.filter(
    (course) => batch === "all" || course.batch === batch
  );

  const semesters = Array.from(
    new Set(batchCourses.map((course) => course.semester))
  ).sort();

  const semesterCourses = batchCourses.filter(
    (course) =>
      semester === "all" || course.semester === semester
  );

  const sections = Array.from(
    new Set(semesterCourses.map((course) => course.section))
  ).sort();

  const query = search.trim().toLowerCase();

  const filteredCourses = semesterCourses.filter((course) => {
    return (
      (section === "all" || course.section === section) &&
      `${course.name} ${course.code} ${course.teacher}`
        .toLowerCase()
        .includes(query)
    );
  });

  const visibleCourseIds = new Set(
    filteredCourses.map((course) => course.id)
  );

  const visibleRecords: AttendanceRecords = {};

  for (const [key, record] of Object.entries(records)) {
    if (visibleCourseIds.has(record.courseId)) {
      visibleRecords[key] = record;
    }
  }

  const uniqueStudents = new Set(
    filteredCourses.flatMap((course) =>
      course.students.map(
        (student) =>
          `${course.batch || "unassigned"}:${student.roll.trim().toUpperCase()}`
      )
    )
  ).size;

  const average = attendanceStats(visibleRecords);

  const initials =
    teacherName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "T";

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100";

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        Loading courses…
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5">
          <Link
            href="/"
            className="text-2xl font-bold text-blue-800"
          >
            Class
            <span className="text-green-700">Track</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/schedule"
              className="font-semibold text-green-800 hover:underline"
            >
              Class Schedule
            </Link>

            <Link
              href="/profile"
              aria-label="Open my profile"
              className="flex items-center gap-3"
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
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10">
        <section className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="font-semibold text-green-700">
              TEACHER DASHBOARD
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Welcome back, {teacherName}.
            </h1>

            <p className="mt-3 text-slate-600">
              Select your batch and course to take attendance.
            </p>
          </div>

          <button
            type="button"
            disabled={Boolean(error)}
            onClick={() => setIsAddCourseOpen(true)}
            className="rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
          >
            + Add Course
          </button>
        </section>

        {error ? (
          <p
            role="alert"
            className="mt-8 rounded-xl bg-red-50 p-5 text-red-700"
          >
            {error} Refresh to retry.
          </p>
        ) : (
          <>
            <section className="mt-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-4">
              <label>
                <span className="mb-2 block font-semibold">
                  Batch
                </span>

                <select
                  value={batch}
                  onChange={(event) =>
                    changeBatch(event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="all">All batches</option>

                  {batches.map((item) => (
                    <option key={item} value={item}>
                      Batch {item}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="mb-2 block font-semibold">
                  Semester
                </span>

                <select
                  value={semester}
                  onChange={(event) => {
                    setSemester(event.target.value);
                    setSection("all");
                  }}
                  className={inputClass}
                >
                  <option value="all">All semesters</option>

                  {semesters.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="mb-2 block font-semibold">
                  Section
                </span>

                <select
                  value={section}
                  onChange={(event) =>
                    setSection(event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="all">All sections</option>

                  {sections.map((item) => (
                    <option key={item} value={item}>
                      {item === "Not specified"
                        ? item
                        : `Section ${item}`}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="mb-2 block font-semibold">
                  Search
                </span>

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Course, code or teacher"
                  className={inputClass}
                />
              </label>
            </section>

            <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Courses", filteredCourses.length],
                ["Unique students", uniqueStudents],
                ["Saved sessions", Object.keys(visibleRecords).length],
                ["Attendance", average.percentage],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <p className="text-slate-500">{label}</p>

                  <p className="mt-3 text-3xl font-bold text-blue-800">
                    {value}
                  </p>
                </div>
              ))}
            </section>

            <p className="mt-3 text-sm text-slate-500">
              Totals follow the selected filters. New university courses
              start with an empty student roster.
            </p>

            <section className="mt-10">
              <h2 className="mb-5 text-2xl font-bold">
                Courses and attendance
              </h2>

              {filteredCourses.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                  No courses match these filters.
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2">
                  {filteredCourses.map((course) => {
                    const stats = attendanceStats(
                      records,
                      course.id
                    );

                    return (
                      <article
                        key={course.id}
                        className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6"
                      >
                        <p className="text-sm font-semibold text-green-700">
                          {course.batch
                            ? `Batch ${course.batch}`
                            : "Batch not assigned"}
                          {" · "}
                          {course.semester}
                        </p>

                        <h3 className="mt-2 text-xl font-bold">
                          {course.name}
                        </h3>

                        <p className="mt-2 text-slate-600">
                          {course.teacher}
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                          Section: {course.section}
                          {course.code
                            ? ` · Code: ${course.code}`
                            : ""}
                        </p>

                        <div className="mt-5 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-slate-500">
                              Students
                            </p>
                            <p className="mt-1 font-bold">
                              {course.students.length}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-slate-500">
                              Saved attendance
                            </p>
                            <p className="mt-1 font-bold text-green-700">
                              {stats.percentage}
                            </p>
                          </div>
                        </div>

                        <details className="mt-5 rounded-xl bg-slate-50 p-4">
                          <summary className="cursor-pointer font-semibold text-blue-800">
                            View class times
                          </summary>

                          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                            {course.schedule}
                          </p>
                        </details>

                        {course.students.length === 0 && (
                          <p className="mt-4 text-sm text-slate-500">
                            Add students before taking attendance.
                          </p>
                        )}

                        <div className="mt-auto flex flex-wrap gap-3 pt-6">
                          <Link
                            href={`/attendance?course=${encodeURIComponent(course.id)}`}
                            className="rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white hover:bg-blue-800"
                          >
                            Take Attendance
                          </Link>

                          <Link
                            href={`/course/${encodeURIComponent(course.id)}`}
                            className="rounded-lg border border-slate-300 px-4 py-3 font-semibold text-green-800 hover:bg-green-50"
                          >
                            Students / Details
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}

        <footer className="mt-12 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
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