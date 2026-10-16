"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ATTENDANCE_KEY,
  attendanceStats,
  errorText,
  readAttendance,
  readCourses,
  recordKey,
  today,
} from "../lib/classtrack";
import type {
  AttendanceRecords,
  Course,
  Status,
} from "../lib/classtrack";

function csvCell(value: string) {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

export default function AttendancePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseId, setCourseId] = useState("");
  const [date, setDate] = useState("");
  const [records, setRecords] = useState<AttendanceRecords>({});
  const [marks, setMarks] = useState<Record<string, Status>>({});
  const [search, setSearch] = useState("");
  const [ready, setReady] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const loadedCourses = readCourses();
        const loadedRecords = readAttendance();
        const requested = new URLSearchParams(window.location.search).get("course");
        const selected = requested ?? loadedCourses[0]?.id ?? "";
        const selectedDate = today();

        setCourses(loadedCourses);
        setRecords(loadedRecords);
        setCourseId(selected);
        setDate(selectedDate);
        setMarks(loadedRecords[recordKey(selected, selectedDate)]?.marks ?? {});
      } catch (error) {
        setLoadError(errorText(error));
      }
      setReady(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!dirty) return;

    function warn(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const course = courses.find((item) => item.id === courseId);
  const currentRecord = records[recordKey(courseId, date)];
  const roster = currentRecord?.students ?? course?.students ?? [];

  const present = roster.filter((student) => marks[student.id] === "present").length;
  const absent = roster.filter((student) => marks[student.id] === "absent").length;
  const unmarked = roster.length - present - absent;

  const query = search.trim().toLowerCase();
  const filtered = roster.filter(
    (student) =>
      student.name.toLowerCase().includes(query) ||
      student.roll.toLowerCase().includes(query)
  );

  const history = Object.values(records)
    .filter((record) => record.courseId === courseId)
    .sort((a, b) => b.date.localeCompare(a.date));

  const average = attendanceStats(records, courseId);

  function canLeave() {
    return !dirty || window.confirm("Discard your unsaved attendance changes?");
  }

  function selectSession(nextCourse: string, nextDate: string) {
    if (!nextDate || !canLeave()) return;

    try {
      const latest = readAttendance();
      const latestCourses = readCourses();

      setRecords(latest);
      setCourses(latestCourses);
      setCourseId(nextCourse);
      setDate(nextDate);
      setMarks(latest[recordKey(nextCourse, nextDate)]?.marks ?? {});
      setDirty(false);
      setSearch("");
      setNotice("");

      const url = new URL(window.location.href);
      url.searchParams.set("course", nextCourse);
      window.history.replaceState(null, "", url.toString());
    } catch (error) {
      setNotice(errorText(error));
    }
  }

  function markStudent(id: string, status: Status) {
    setMarks((current) => ({ ...current, [id]: status }));
    setDirty(true);
    setNotice("");
  }

  function markAllPresent() {
    const next: Record<string, Status> = {};
    roster.forEach((student) => {
      next[student.id] = "present";
    });
    setMarks(next);
    setDirty(true);
    setNotice("");
  }

  function saveAttendance() {
    if (!course || loadError) return;

    if (!date || date > today()) {
      setNotice("Select today or a previous date.");
      return;
    }

    if (!roster.length || unmarked > 0) {
      setNotice("Add students and mark everyone before saving.");
      return;
    }

    try {
      const latest = readAttendance();
      const key = recordKey(courseId, date);
      const isUpdate = Boolean(latest[key]);

      const next: AttendanceRecords = {
        ...latest,
        [key]: {
          courseId,
          date,
          students: roster.map((student) => ({ ...student })),
          marks: { ...marks },
          updatedAt: new Date().toISOString(),
        },
      };

      localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(next));
      setRecords(next);
      setDirty(false);

      const message = isUpdate
        ? "Attendance updated successfully!"
        : "Attendance saved successfully!";

      setNotice(message);
      window.alert(
        `${message}\n\n${course.name}\nDate: ${date}\nPresent: ${present} | Absent: ${absent}`
      );
    } catch (error) {
      setNotice(`Could not save attendance. ${errorText(error)}`);
    }
  }

  function downloadCsv() {
    if (!currentRecord || dirty || !course) return;

    const rows = [
      ["Course", "Date", "Roll", "Student", "Status"],
      ...currentRecord.students.map((student) => [
        course.name,
        currentRecord.date,
        student.roll,
        student.name,
        currentRecord.marks[student.id] ?? "unmarked",
      ]),
    ];

    const csv = rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
    const url = URL.createObjectURL(
      new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = `${courseId}-${date}-attendance.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-700";

  if (!ready) return <main className="p-10">Loading attendance…</main>;

  if (loadError || !course) {
    return (
      <main className="p-10">
        <p role="alert">{loadError || "Course not found. Select a course from your dashboard."}</p>
        <Link href="/dashboard" className="mt-5 inline-block text-blue-700">
          ← Dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between gap-4">
          <p className="text-2xl font-bold text-blue-800">
            Class<span className="text-green-700">Track</span>
          </p>
          <Link
            href="/dashboard"
            onClick={(event) => {
              if (!canLeave()) event.preventDefault();
            }}
            className="font-semibold text-blue-700"
          >
            ← Dashboard
          </Link>
        </header>

        <h1 className="mt-10 text-3xl font-bold">{course.name}</h1>
        <p className="mt-2 text-slate-500">
          Section {course.section} · Saved attendance: {average.percentage}
        </p>

        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <label>
            <span className="mb-2 block font-semibold">Course</span>
            <select
              value={courseId}
              onChange={(event) => selectSession(event.target.value, date)}
              className={inputClass}
            >
              {courses.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-2 block font-semibold">Class date</span>
            <input
              type="date"
              value={date}
              max={today()}
              onChange={(event) => selectSession(courseId, event.target.value)}
              className={inputClass}
            />
          </label>
        </section>

        <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ["Students", roster.length],
            ["Present", present],
            ["Absent", absent],
            ["Unmarked", unmarked],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border bg-white p-5">
              <p className="text-slate-500">{label}</p>
              <p className="mt-2 text-2xl font-bold text-blue-800">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border bg-white">
          <div className="flex flex-wrap gap-3 border-b p-4">
            <input
              type="search"
              aria-label="Search students"
              placeholder="Search name or roll"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className={`${inputClass} sm:max-w-sm`}
            />
            <button
              type="button"
              onClick={markAllPresent}
              disabled={!roster.length}
              className="rounded-xl bg-green-100 px-4 py-3 font-semibold text-green-900 disabled:opacity-40 sm:ml-auto"
            >
              Mark all present
            </button>
          </div>

          {!roster.length ? (
            <div className="p-8 text-center">
              <p>No students enrolled yet.</p>
              <Link
                href={`/course/${encodeURIComponent(courseId)}`}
                className="mt-3 inline-block font-semibold text-blue-700"
              >
                Add students →
              </Link>
            </div>
          ) : !filtered.length ? (
            <p className="p-8 text-center text-slate-500">No matching students.</p>
          ) : (
            filtered.map((student) => (
              <div key={student.id} className="flex flex-wrap items-center justify-between gap-4 border-b p-5 last:border-b-0">
                <div>
                  <p className="font-semibold">{student.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{student.roll}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    aria-label={`Mark ${student.name} present`}
                    aria-pressed={marks[student.id] === "present"}
                    onClick={() => markStudent(student.id, "present")}
                    className={`rounded-lg border px-4 py-3 font-semibold ${
                      marks[student.id] === "present"
                        ? "border-green-700 bg-green-700 text-white"
                        : "border-slate-300"
                    }`}
                  >
                    Present
                  </button>

                  <button
                    type="button"
                    aria-label={`Mark ${student.name} absent`}
                    aria-pressed={marks[student.id] === "absent"}
                    onClick={() => markStudent(student.id, "absent")}
                    className={`rounded-lg border px-4 py-3 font-semibold ${
                      marks[student.id] === "absent"
                        ? "border-red-700 bg-red-700 text-white"
                        : "border-slate-300"
                    }`}
                  >
                    Absent
                  </button>
                </div>
              </div>
            ))
          )}
        </section>

        {notice && (
          <p role="status" className="mt-5 rounded-xl border bg-white p-4">
            {notice}
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={saveAttendance}
            disabled={!roster.length}
            className="rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-40"
          >
            {currentRecord ? "Update Attendance" : "Save Attendance"}
          </button>

          <button
            type="button"
            onClick={downloadCsv}
            disabled={!currentRecord || dirty}
            className="rounded-xl border bg-white px-5 py-3 font-semibold disabled:opacity-40"
          >
            Download saved CSV
          </button>

          <span className="text-sm text-slate-500">
            {dirty ? "Unsaved changes" : currentRecord ? "Saved record loaded" : "New session"}
          </span>
        </div>

        {currentRecord && (
          <p className="mt-4 text-sm text-slate-500">
            This saved session uses its original student roster.
          </p>
        )}

        <section className="mt-10">
          <h2 className="text-xl font-bold">Saved attendance history</h2>

          {!history.length ? (
            <p className="mt-4 text-slate-500">No saved sessions yet.</p>
          ) : (
            <div className="mt-4 overflow-hidden rounded-xl border bg-white">
              {history.map((record) => {
                const count = record.students.filter(
                  (student) => record.marks[student.id] === "present"
                ).length;

                return (
                  <button
                    key={record.date}
                    type="button"
                    onClick={() => selectSession(courseId, record.date)}
                    className={`flex w-full flex-wrap justify-between gap-2 border-b p-4 text-left last:border-b-0 ${
                      record.date === date ? "bg-blue-50" : ""
                    }`}
                  >
                    <span className="font-semibold">{record.date}</span>
                    <span className="text-slate-600">
                      {count}/{record.students.length} present
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <p className="mt-10 text-sm text-slate-500">
          Saved in this browser only. Export important attendance records.
        </p>
      </div>
    </main>
  );
}