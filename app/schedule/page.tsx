"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  days,
  referenceCourses,
  schedule,
  teacherName,
  timeSlots,
} from "../lib/cse-schedule";

const TEACHER_NAMES_KEY = "classtrack-teacher-names-v1";

const confirmedNames: Record<string, string> = {
  SR: "Saidur Rahman",
  RKD: "Ramen Kumar Das",
  PB: "Poly Bhoumik",
  SQ: "Sabrina Qadir",
};

function readTeacherNames(): Record<string, string> {
  const raw = localStorage.getItem(TEACHER_NAMES_KEY);

  if (!raw) return {};

  const value: unknown = JSON.parse(raw);

  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    !Object.values(value).every(
      (name) => typeof name === "string" && name.trim().length > 0
    )
  ) {
    throw new Error("Invalid saved teacher names.");
  }

  return value as Record<string, string>;
}

export default function SchedulePage() {
  const [batch, setBatch] = useState("22");
  const [section, setSection] = useState("all");
  const [day, setDay] = useState("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState("routine");

  const [savedTeacherNames, setSavedTeacherNames] =
    useState<Record<string, string>>(confirmedNames);

  const [teacherDrafts, setTeacherDrafts] = useState<
    Record<string, string>
  >({});

  const [teacherNamesReady, setTeacherNamesReady] = useState(false);
  const [teacherNamesError, setTeacherNamesError] = useState("");
  const [teacherMessage, setTeacherMessage] = useState("");

  useEffect(() => {
    function loadTeacherNames() {
      try {
        const stored = readTeacherNames();

        setSavedTeacherNames({
          ...confirmedNames,
          ...stored,
        });

        setTeacherNamesReady(true);
        setTeacherNamesError("");
      } catch {
        setTeacherNamesReady(false);
        setTeacherNamesError(
          "Saved teacher names could not be loaded. Saving is disabled to protect existing names."
        );
      }
    }

    function handleStorage(event: StorageEvent) {
      if (event.key === TEACHER_NAMES_KEY || event.key === null) {
        loadTeacherNames();
      }
    }

    const timer = window.setTimeout(loadTeacherNames, 0);

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", loadTeacherNames);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", loadTeacherNames);
    };
  }, []);

  function displayTeacherName(initials: string) {
    return savedTeacherNames[initials] || teacherName(initials);
  }

  function saveTeacherName(initials: string) {
    if (!teacherNamesReady) return;

    const name = (teacherDrafts[initials] || "").trim();

    if (!name) {
      setTeacherNamesError("Please enter the teacher’s full name.");
      return;
    }

    if (name.toUpperCase() === initials.toUpperCase()) {
      setTeacherNamesError(
        "Please enter the full name instead of repeating the initials."
      );
      return;
    }

    try {
      const latest = readTeacherNames();

      const next = {
        ...confirmedNames,
        ...latest,
        [initials]: name,
      };

      localStorage.setItem(TEACHER_NAMES_KEY, JSON.stringify(next));

      setSavedTeacherNames(next);

      setTeacherDrafts((current) => {
        const updated = { ...current };
        delete updated[initials];
        return updated;
      });

      setTeacherNamesError("");
      setTeacherMessage(`${initials}: ${name} saved successfully.`);

      window.alert("Teacher name saved successfully!");
    } catch {
      setTeacherMessage("");
      setTeacherNamesError(
        "Could not save the teacher name. Browser storage may be unavailable."
      );
    }
  }

  function startEditing(initials: string) {
    setTeacherDrafts((current) => ({
      ...current,
      [initials]: displayTeacherName(initials),
    }));

    setTeacherMessage("");
  }

  function cancelEditing(initials: string) {
    setTeacherDrafts((current) => {
      const updated = { ...current };
      delete updated[initials];
      return updated;
    });
  }

  function changeBatch(nextBatch: string) {
    setBatch(nextBatch);
    setSection("all");
    setDay("all");
    setSearch("");
    setView(nextBatch === "21" ? "reference" : "routine");
    setTeacherMessage("");
  }

  const sections = Array.from(
    new Set(
      schedule
        .filter((entry) => entry.batch === batch)
        .map((entry) => entry.section)
        .filter(Boolean)
    )
  ).sort();

  const query = search.trim().toLowerCase();

  const filteredSchedule = schedule.filter((entry) => {
    const searchable =
      `${entry.course} ${entry.teacher} ${displayTeacherName(entry.teacher)} ${entry.room}`
        .toLowerCase();

    return (
      entry.batch === batch &&
      (section === "all" || entry.section === section) &&
      (day === "all" || entry.day === day) &&
      searchable.includes(query)
    );
  });

  const filteredReferences = referenceCourses.filter(
    (course) =>
      course.batch === batch &&
      `${course.name} ${course.code} ${course.teacher} ${displayTeacherName(course.teacher)}`
        .toLowerCase()
        .includes(query)
  );

  const courseCount = new Set(
    filteredSchedule.map(
      (entry) => `${entry.section}:${entry.course}`
    )
  ).size;

  const teacherCount = new Set(
    filteredSchedule.map((entry) => entry.teacher)
  ).size;

  const teacherInitials = Array.from(
    new Set([
      ...schedule
        .filter((entry) => entry.batch === batch)
        .map((entry) => entry.teacher),

      ...referenceCourses
        .filter((course) => course.batch === batch)
        .map((course) => course.teacher),
    ])
  ).sort();

  const hasReferenceCourses = referenceCourses.some(
    (course) => course.batch === batch
  );

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5">
          <Link
            href="/"
            className="text-2xl font-bold text-blue-800"
          >
            Class
            <span className="text-green-700">Track</span>
          </Link>

          <Link
            href="/dashboard"
            className="font-semibold text-blue-700 hover:text-blue-900"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10">
        <p className="font-semibold text-green-700">
          DAFFODIL INSTITUTE OF IT
        </p>

        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          CSE class schedules
        </h1>

        <p className="mt-3 text-slate-600">
          Browse courses, teachers, rooms and weekly class times.
        </p>

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
              {["21", "22", "23", "24", "25", "26"].map(
                (item) => (
                  <option key={item} value={item}>
                    Batch {item}
                  </option>
                )
              )}
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
              disabled={
                view !== "routine" || sections.length === 0
              }
              className={`${inputClass} disabled:bg-slate-100`}
            >
              <option value="all">
                {sections.length
                  ? "All sections"
                  : "Not specified"}
              </option>

              {sections.map((item) => (
                <option key={item} value={item}>
                  Section {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-2 block font-semibold">
              Day
            </span>

            <select
              value={day}
              onChange={(event) => setDay(event.target.value)}
              disabled={view !== "routine"}
              className={`${inputClass} disabled:bg-slate-100`}
            >
              <option value="all">All days</option>

              {days.map((item) => (
                <option key={item} value={item}>
                  {item}
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
              placeholder="Course or teacher"
              className={inputClass}
            />
          </label>
        </section>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            aria-pressed={view === "routine"}
            onClick={() => setView("routine")}
            className={`rounded-xl px-5 py-3 font-semibold ${
              view === "routine"
                ? "bg-blue-700 text-white"
                : "border border-slate-300 bg-white text-blue-800"
            }`}
          >
            October weekly routine
          </button>

          {hasReferenceCourses && (
            <button
              type="button"
              aria-pressed={view === "reference"}
              onClick={() => setView("reference")}
              className={`rounded-xl px-5 py-3 font-semibold ${
                view === "reference"
                  ? "bg-green-700 text-white"
                  : "border border-slate-300 bg-white text-green-800"
              }`}
            >
              {batch === "22"
                ? "Previous: 6th semester"
                : "8th-semester courses"}
            </button>
          )}

          <a
            href="#teachers"
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-blue-800 hover:bg-blue-50"
          >
            Teacher names
          </a>
        </div>

        {view === "routine" ? (
          <>
            <p className="mt-5 text-sm text-slate-500">
              Routine effective 5 October 2026
              {batch === "22" ? " · 7th semester" : ""}
              {["23", "24", "25", "26"].includes(batch)
                ? " · Semester number not supplied"
                : ""}
            </p>

            <section className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ["Courses / sections", courseCount],
                ["Weekly classes", filteredSchedule.length],
                ["Teachers", teacherCount],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6"
                >
                  <p className="text-sm text-slate-500">
                    {label}
                  </p>

                  <p className="mt-2 text-2xl font-bold text-blue-800">
                    {value}
                  </p>
                </div>
              ))}
            </section>

            {filteredSchedule.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-600">
                {batch === "21"
                  ? "The 21st batch’s weekly class routine has not been supplied."
                  : "No classes match these filters."}
              </div>
            ) : (
              <div className="mt-8 space-y-8">
                {days.map((currentDay) => {
                  const entries = filteredSchedule
                    .filter(
                      (entry) => entry.day === currentDay
                    )
                    .sort(
                      (a, b) =>
                        a.slot - b.slot ||
                        a.section.localeCompare(b.section) ||
                        a.room.localeCompare(b.room)
                    );

                  if (entries.length === 0) return null;

                  return (
                    <section key={currentDay}>
                      <div className="mb-4 flex flex-wrap items-center gap-3">
                        <span className="h-6 w-1 rounded-full bg-green-600" />

                        <h2 className="text-2xl font-bold">
                          {currentDay}
                        </h2>

                        <span className="text-sm text-slate-500">
                          {entries.length} classes
                        </span>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        {entries.map((entry) => {
                          const fullName =
                            displayTeacherName(entry.teacher);

                          return (
                            <article
                              key={entry.id}
                              className="rounded-2xl border border-slate-200 bg-white p-5"
                            >
                              <p className="font-semibold text-blue-700">
                                {timeSlots[entry.slot]}
                              </p>

                              <h3 className="mt-3 text-lg font-bold">
                                {entry.course}
                              </h3>

                              <p className="mt-2 text-slate-600">
                                {fullName}
                                {fullName !== entry.teacher
                                  ? ` (${entry.teacher})`
                                  : ""}
                              </p>

                              <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-4 text-sm">
                                <span className="font-semibold text-green-800">
                                  Batch {entry.batch}
                                  {entry.section
                                    ? ` · Section ${entry.section}`
                                    : ""}
                                </span>

                                <span className="text-slate-500">
                                  Room {entry.room}
                                </span>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <section className="mt-8">
            <h2 className="text-2xl font-bold">
              Batch {batch} ·{" "}
              {batch === "22" ? "6th" : "8th"} semester
            </h2>

            <p className="mt-3 text-slate-600">
              {batch === "22"
                ? "Previous-semester course reference. Existing attendance records remain in the attendance system."
                : "Course details from the supplied examination notice. Weekly class times have not been supplied."}
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {filteredReferences.map((course) => {
                const fullName =
                  displayTeacherName(course.teacher);

                return (
                  <article
                    key={course.id}
                    className="rounded-2xl border border-slate-200 bg-white p-6"
                  >
                    <h3 className="text-xl font-bold">
                      {course.name}
                    </h3>

                    <p className="mt-3 text-green-800">
                      {fullName}
                      {fullName !== course.teacher
                        ? ` (${course.teacher})`
                        : ""}
                    </p>

                    <p className="mt-3 text-sm text-slate-500">
                      Official course code:{" "}
                      {course.code || "Not supplied"}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      Weekly schedule: Not entered
                    </p>
                  </article>
                );
              })}
            </div>

            {filteredReferences.length === 0 && (
              <p className="mt-5 text-slate-500">
                No courses match your search.
              </p>
            )}
          </section>
        )}

        <section
          id="teachers"
          className="mt-12 scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-6"
        >
          <h2 className="text-xl font-bold">
            Teachers · Batch {batch}
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Add a teacher’s full name or edit an existing name.
          </p>

          {teacherNamesError && (
            <p
              role="alert"
              className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {teacherNamesError}
            </p>
          )}

          {teacherMessage && (
            <p
              role="status"
              className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-800"
            >
              {teacherMessage}
            </p>
          )}

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teacherInitials.map((initials) => {
              const currentName =
                displayTeacherName(initials);

              const hasName = currentName !== initials;

              const isEditing =
                teacherDrafts[initials] !== undefined;

              return (
                <div
                  key={initials}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="font-bold text-blue-800">
                    {initials}
                  </p>

                  {hasName && !isEditing ? (
                    <>
                      <p className="mt-2 font-medium text-slate-800">
                        {currentName}
                      </p>

                      <button
                        type="button"
                        disabled={!teacherNamesReady}
                        onClick={() => startEditing(initials)}
                        className="mt-3 text-sm font-semibold text-blue-700 hover:underline disabled:opacity-50"
                      >
                        Edit name
                      </button>
                    </>
                  ) : (
                    <form
                      className="mt-3"
                      onSubmit={(event) => {
                        event.preventDefault();
                        saveTeacherName(initials);
                      }}
                    >
                      <label
                        htmlFor={`teacher-name-${initials}`}
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        {hasName ? "Full name" : "Add full name"}
                      </label>

                      <input
                        id={`teacher-name-${initials}`}
                        type="text"
                        required
                        maxLength={100}
                        disabled={!teacherNamesReady}
                        value={teacherDrafts[initials] || ""}
                        onChange={(event) => {
                          const value = event.target.value;

                          setTeacherDrafts((current) => ({
                            ...current,
                            [initials]: value,
                          }));

                          setTeacherMessage("");
                        }}
                        placeholder="Enter teacher's full name"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
                      />

                      <div className="mt-3 flex gap-3">
                        <button
                          type="submit"
                          disabled={!teacherNamesReady}
                          className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50"
                        >
                          Save
                        </button>

                        {isEditing && (
                          <button
                            type="button"
                            onClick={() =>
                              cancelEditing(initials)
                            }
                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  )}
                </div>
              );
            })}
          </div>

          <p className="mt-5 text-sm text-slate-500">
            Saved names apply across all batches on this schedule
            page. Stored in this browser only.
          </p>
        </section>

        <footer className="mt-10 text-center text-sm text-slate-500">
          ClassTrack · Daffodil Institute of IT · CSE
        </footer>
      </div>
    </main>
  );
}