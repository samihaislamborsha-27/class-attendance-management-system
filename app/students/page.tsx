"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  readCourses,
  writeCourses,
  type Student,
} from "../lib/classtrack";

import {
  loadUniversityCourses,
  type UniversityCourse,
} from "../lib/university-courses";

type StudentRow = {
  classId: string;
  name: string;
};

type SavedRoster = {
  version: 1;
  students: StudentRow[];
};

const BATCHES = ["21", "22", "23", "24", "25", "26"];

const KNOWN_BATCH_22: Record<string, string> = {
  "220005": "Jahid Ajwad Sikder",
  "220006": "Noushad Zaman",
  "220008": "MD SAKIBUR RAHMAN RIAD",
  "220010": "Asif Mahmud",
  "220011": "Mst. Israt Jahan Morium",
  "220013": "Rakiba Rezwana",
  "220014": "Sabrina Ramima",
  "220015": "Faria Akter Eva",
  "220016": "Samiha Islam Borsha",
  "220017": "Nusrat Jahan Alin",
  "220019": "Nowshin Tabassum Nila",
  "220022": "Ferdousi",
  "220023": "Setu Akter",
  "220026": "Sara Chowdhury Shammi",
  "220027": "Syed Neaz Morshed Sajid",
  "220030": "Md. Shazzad Hossain",
  "220032": "Md. Muntasir Khan",
  "220033": "Namreen Alam",
  "220039": "Md Faijul Islam Rafiq",
  "220055": "Mirza Mahin Alam Aranna",
  "220057": "MD. ENAMUL HAQUE UTSHA",
  "220058": "Tahasina Aktar",
  "220061": "Munia Islam",
  "220063": "Rukaiya Binte Sulaiman",
  "220064": "Suraiya Binte Sulaiman Moni",
  "220065": "Talha Bin Saleh",
  "220066": "Nazmul Hassan Shuvo",
  "220067": "Bipu Chandra Gour",
  "220068": "Sazid Kamal Anik",
  "220070": "Tansin Afrin Fariha",
  "220071": "Md. Jobaer Hossain Mulla",
  "220073": "Naeem Radoan",
  "220076": "Rahman Mahadi",
  "220078": "Khairun Nahar Supty",
  "220079": "Md. Habibullah",
  "220083": "Tajmim Rahman Mahia",
  "220088": "Md. Shihab Sikder",
  "220090": "Md. Ibrahim Mollah",
  "220091": "MR Nijhum",
  "220093": "Tanvir Ahmed Ishaat",
  "220094": "Sajib Kumar Samuddar",
  "220095": "Saidatus Sabah Tasfia",
  "220097": "Aysha Akter",
  "220101": "MD. Tahmid Ahmed",
  "220102": "Adity Ghosh",
  "220105": "Md. Robin Khan",
  "220106": "Tahmidur Rahman",
  "220108": "Aurthy Banik",
  "220109": "Md. Nabirul Kabir Rahid",
  "220110": "Israt Zahan Tanha",
  "220111": "Md. Shariful Islam",
  "220113": "Saifullah Haque Siam",
  "220115": "Md. Estiaq Ahmmed",
  "220116": "Estiak Ahamed Tasin",
  "220121": "Noman Mahmud Pranto",
  "220123": "Abu Sayeed Emon",
  "220125": "Nusrat Jahan Oishe",
  "220133": "Tanmoy Sikder",
  "220135": "Syed Rafi Rahman",
  "220139": "Md. Abdur Rahman",
  "220143": "Md. Redwan Islam",
  "220144": "Rima Akter",
  "220145": "Arounjit Ghosh",
};

function rosterKey(batch: string) {
  return `classtrack-batch-roster-v1:${batch}`;
}

function defaultRows(batch: string): StudentRow[] {
  const count = batch === "22" ? 145 : 100;

  return Array.from({ length: count }, (_, index) => {
    const classId = `${batch}${String(index + 1).padStart(4, "0")}`;

    return {
      classId,
      name: batch === "22" ? KNOWN_BATCH_22[classId] ?? "" : "",
    };
  });
}

function belongsToBatch(
  course: UniversityCourse,
  batch: string
): boolean {
  if (course.batch !== batch) return false;

  if (batch !== "22") return true;

  return (
    course.semesterNumber === 6 ||
    course.semesterNumber === 7 ||
    /^(6|7)(th)?\b/i.test(course.semester.trim())
  );
}

function isSampleStudent(student: Student) {
  return (
    /^Student\s*0?[1-5]$/i.test(student.name.trim()) &&
    /^CSE-220[1-5]$/i.test(student.roll.trim())
  );
}

function readRoster(
  batch: string,
  courses: UniversityCourse[]
): StudentRow[] {
  const rows = defaultRows(batch);
  const byId = new Map(rows.map((row) => [row.classId, row]));

  // Preserve students previously entered through course details.
  for (const course of courses) {
    if (!belongsToBatch(course, batch)) continue;

    for (const student of course.students) {
      const classId = student.roll.trim();

      if (
        isSampleStudent(student) ||
        !new RegExp(`^${batch}\\d{4}$`).test(classId)
      ) {
        continue;
      }

      const existing = byId.get(classId);

      if (existing) {
        if (!existing.name && student.name.trim()) {
          existing.name = student.name.trim();
        }
      } else {
        byId.set(classId, {
          classId,
          name: student.name.trim(),
        });
      }
    }
  }

  const raw = localStorage.getItem(rosterKey(batch));

  if (raw) {
    const parsed: unknown = JSON.parse(raw);

    if (
      !parsed ||
      typeof parsed !== "object" ||
      !("version" in parsed) ||
      parsed.version !== 1 ||
      !("students" in parsed) ||
      !Array.isArray(parsed.students)
    ) {
      throw new Error("The saved student list could not be read.");
    }

    const seen = new Set<string>();

    for (const item of parsed.students) {
      if (
        !item ||
        typeof item !== "object" ||
        typeof item.classId !== "string" ||
        typeof item.name !== "string" ||
        !new RegExp(`^${batch}\\d{4}$`).test(item.classId) ||
        seen.has(item.classId)
      ) {
        throw new Error("The saved student list contains invalid data.");
      }

      seen.add(item.classId);

      byId.set(item.classId, {
        classId: item.classId,
        name: item.name,
      });
    }
  }

  return [...byId.values()].sort((a, b) =>
    a.classId.localeCompare(b.classId)
  );
}

function courseStudents(
  course: UniversityCourse,
  rows: StudentRow[],
  batch: string
): Student[] {
  const existingByRoll = new Map(
    course.students.map((student) => [student.roll.trim(), student])
  );

  const namedStudents = rows
    .filter((row) => row.name.trim())
    .map((row) => {
      const existing = existingByRoll.get(row.classId);

      return {
        // Preserve existing identifiers used by saved attendance.
        id: existing?.id ?? `student-${row.classId}`,
        roll: row.classId,
        name: row.name.trim(),
      };
    });

  // Preserve manually added students outside this numbered roster.
  // For batch 22, explicitly exclude older batch IDs.
  const rowIds = new Set(rows.map((row) => row.classId));

  const additionalStudents = course.students.filter((student) => {
    const roll = student.roll.trim();

    if (isSampleStudent(student) || rowIds.has(roll)) return false;
    if (batch === "22" && !/^22\d{4}$/.test(roll)) return false;

    return true;
  });

  return [...namedStudents, ...additionalStudents];
}

export default function StudentsPage() {
  const [batch, setBatch] = useState("22");
  const [rows, setRows] = useState<StudentRow[]>([]);
  const [courses, setCourses] = useState<UniversityCourse[]>([]);
  const [courseId, setCourseId] = useState("");
  const [search, setSearch] = useState("");
  const [ready, setReady] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const loaded = loadUniversityCourses();
        const roster = readRoster("22", loaded);
        const available = loaded.filter((course) =>
          belongsToBatch(course, "22")
        );

        setCourses(loaded);
        setRows(roster);
        setCourseId(available[0]?.id ?? "");
      } catch (cause) {
        setBlocked(true);
        setError(
          cause instanceof Error
            ? cause.message
            : "Could not load students."
        );
      } finally {
        setReady(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!dirty) return;

    function beforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", beforeUnload);

    return () =>
      window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty]);

  const availableCourses = courses.filter((course) =>
    belongsToBatch(course, batch)
  );

  const namedCount = rows.filter((row) => row.name.trim()).length;

  const query = search.trim().toLowerCase();

  const visibleRows = rows.filter(
    (row) =>
      row.classId.includes(query) ||
      row.name.toLowerCase().includes(query)
  );

  function canLeave() {
    return (
      !dirty ||
      window.confirm("Discard your unsaved student name changes?")
    );
  }

  function changeBatch(nextBatch: string) {
    if (!canLeave()) return;

    try {
      const latest = loadUniversityCourses();
      const roster = readRoster(nextBatch, latest);
      const available = latest.filter((course) =>
        belongsToBatch(course, nextBatch)
      );

      setBatch(nextBatch);
      setCourses(latest);
      setRows(roster);
      setCourseId(available[0]?.id ?? "");
      setSearch("");
      setDirty(false);
      setBlocked(false);
      setError("");
      setMessage("");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not open this batch."
      );
    }
  }

  function updateName(classId: string, name: string) {
    setRows((current) =>
      current.map((row) =>
        row.classId === classId ? { ...row, name } : row
      )
    );

    setDirty(true);
    setError("");
    setMessage("");
  }

  function saveStudents(): boolean {
    if (blocked) return false;

    setError("");
    setMessage("");

    const cleaned = rows.map((row) => ({
      classId: row.classId,
      name: row.name.trim(),
    }));

    try {
      const latest = readCourses() as UniversityCourse[];

      const targets = latest.filter((course) =>
        belongsToBatch(course, batch)
      );

      const nextCourses = latest.map((course) =>
        belongsToBatch(course, batch)
          ? {
              ...course,
              students: courseStudents(course, cleaned, batch),
            }
          : course
      );

      const saved: SavedRoster = {
        version: 1,
        students: cleaned,
      };

      // Save the editable roster first. If course synchronization fails,
      // the entered names remain available for a retry.
      localStorage.setItem(rosterKey(batch), JSON.stringify(saved));

      writeCourses(nextCourses);

      setCourses(nextCourses);
      setRows(cleaned);
      setDirty(false);

      const count = cleaned.filter((row) => row.name).length;

      setMessage(
        targets.length
          ? `${count} named students saved and applied to ${targets.length} courses.`
          : `${count} named students saved. No matching courses exist yet. After adding courses for this batch, open this page and save again.`
      );

      return true;
    } catch (cause) {
      setError(
        `Could not finish saving and updating the courses. Your entries are still on this page. Please retry. ${
          cause instanceof Error ? cause.message : ""
        }`
      );

      return false;
    }
  }

  function takeAttendance() {
    if (!courseId) {
      setError("Select a course first.");
      return;
    }

    if (namedCount === 0) {
      setError("Enter at least one student's name first.");
      return;
    }

    if (!saveStudents()) return;

    window.location.assign(
      `/attendance?course=${encodeURIComponent(courseId)}`
    );
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        Loading students…
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <div>
            <p className="text-xl font-bold">ClassTrack</p>
            <p className="text-xs text-slate-500">
              Daffodil Institute of IT
            </p>
          </div>

          <Link
            href="/dashboard"
            onClick={(event) => {
              if (!canLeave()) event.preventDefault();
            }}
            className="text-sm font-semibold text-blue-700"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="text-sm font-semibold text-blue-700">
          STUDENT MANAGEMENT
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Batch {batch} students
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          Enter or correct student names, save the list, then select a
          course to take attendance.
        </p>

        {batch === "22" && (
          <p className="mt-2 text-sm font-medium text-blue-800">
            This list is shared by the sixth and seventh semester
            courses of batch 22.
          </p>
        )}

        <section className="mt-6 grid gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-2">
          <label>
            <span className="mb-2 block text-sm font-semibold">
              Batch
            </span>

            <select
              value={batch}
              onChange={(event) => changeBatch(event.target.value)}
              className={inputClass}
            >
              {BATCHES.map((item) => (
                <option key={item} value={item}>
                  Batch {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-2 block text-sm font-semibold">
              Search student
            </span>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search class ID or name"
              className={inputClass}
            />
          </label>
        </section>

        <section className="mt-5 grid grid-cols-3 gap-3">
          {[
            ["Student rows", rows.length],
            ["Names entered", namedCount],
            ["Names to add", rows.length - namedCount],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <p className="text-xs text-slate-500 sm:text-sm">
                {label}
              </p>
              <p className="mt-2 text-2xl font-bold">{value}</p>
            </div>
          ))}
        </section>

        {error && (
          <p
            role="alert"
            className="mt-5 rounded-lg bg-red-50 p-4 text-sm text-red-800"
          >
            {error}
          </p>
        )}

        {message && (
          <p
            role="status"
            className="mt-5 rounded-lg bg-green-50 p-4 text-sm text-green-800"
          >
            {message}
          </p>
        )}

        <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4">
            <h2 className="font-bold">Student names and class IDs</h2>

            <button
              type="button"
              onClick={() => saveStudents()}
              disabled={blocked}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Save student list
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[470px] text-left text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="w-16 px-4 py-3">SL</th>
                  <th className="w-32 px-4 py-3">Class ID</th>
                  <th className="px-4 py-3">Student name</th>
                </tr>
              </thead>

              <tbody>
                {visibleRows.map((row) => (
                  <tr
                    key={row.classId}
                    className="border-t border-slate-100"
                  >
                    <td className="px-4 py-3 text-slate-500">
                      {rows.findIndex(
                        (item) => item.classId === row.classId
                      ) + 1}
                    </td>

                    <td className="px-4 py-3 font-semibold">
                      {row.classId}
                    </td>

                    <td className="px-4 py-3">
                      <input
                        type="text"
                        aria-label={`Name for student ${row.classId}`}
                        value={row.name}
                        onChange={(event) =>
                          updateName(row.classId, event.target.value)
                        }
                        maxLength={150}
                        placeholder="Add student name"
                        disabled={blocked}
                        className={inputClass}
                      />
                    </td>
                  </tr>
                ))}

                {visibleRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-10 text-center text-slate-500"
                    >
                      No students match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="text-xl font-bold">Take attendance</h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Choose the course. Your student list will be saved before
            the attendance page opens.
          </p>

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-semibold">
              Course and semester
            </span>

            <select
              value={courseId}
              onChange={(event) => setCourseId(event.target.value)}
              disabled={blocked || availableCourses.length === 0}
              className={inputClass}
            >
              {availableCourses.length === 0 ? (
                <option value="">No courses for this batch yet</option>
              ) : (
                availableCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name} · {course.semester} · Section{" "}
                    {course.section}
                  </option>
                ))
              )}
            </select>
          </label>

          <button
            type="button"
            onClick={takeAttendance}
            disabled={
              blocked || !courseId || namedCount === 0
            }
            className="mt-4 rounded-lg bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save and take attendance
          </button>

          <p className="mt-4 text-sm leading-6 text-slate-500">
            Blank names are excluded from attendance until you fill
            them in. Previously saved attendance uses its original
            student list.
          </p>
        </section>

        <p
          aria-live="polite"
          className="mt-5 text-sm text-slate-500"
        >
          {dirty ? "You have unsaved name changes." : ""}
        </p>

        <footer className="mt-8 pb-6 text-center text-sm text-slate-500">
          Student lists are saved in this browser.
        </footer>
      </div>
    </main>
  );
}