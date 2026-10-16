import {
  readCourses,
  writeCourses,
} from "./classtrack";

import type { Course } from "./classtrack";

import {
  referenceCourses,
  schedule,
  teacherName,
  timeSlots,
} from "./cse-schedule";

export type UniversityCourse = Course & {
  batch?: string;
  semesterNumber?: number | null;
};

const confirmedTeachers: Record<string, string> = {
  SR: "Saidur Rahman",
  RKD: "Ramen Kumar Das",
  PB: "Poly Bhoumik",
  SQ: "Sabrina Qadir",
};

function getTeacherNames(): Record<string, string> {
  try {
    const raw = localStorage.getItem(
      "classtrack-teacher-names-v1"
    );

    const value: unknown = raw ? JSON.parse(raw) : {};

    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.values(value).every(
        (name) =>
          typeof name === "string" &&
          name.trim().length > 0
      )
    ) {
      return {
        ...confirmedTeachers,
        ...(value as Record<string, string>),
      };
    }
  } catch {
    // Keep confirmed names if saved names cannot be read.
  }

  return confirmedTeachers;
}

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const previousCourseIds: Record<string, string> = {
  "Software Engineering": "software-engineering",
  "Computer Networking": "computer-networking",
  "Theory of Computation": "theory-of-computation",
  "Embedded System Programming":
    "embedded-system-programming",
};

export function universityCourseId(
  batch: string,
  section: string,
  semester: number | null,
  name: string
) {
  return [
    "diit",
    batch,
    section.toLowerCase() || "unsectioned",
    semester
      ? `semester-${semester}`
      : "routine-oct-2026",
    slug(name),
  ].join("-");
}

export function loadUniversityCourses(): UniversityCourse[] {
  const existing = readCourses() as UniversityCourse[];

  const result: UniversityCourse[] = existing.map(
    (course) => ({ ...course })
  );

  const savedNames = getTeacherNames();

  function fullName(initials: string) {
    return savedNames[initials] || teacherName(initials);
  }

  let changed = false;

  // Preserve existing IDs and their attendance history.
  for (const name of Object.keys(previousCourseIds)) {
    const course = result.find(
      (item) => item.id === previousCourseIds[name]
    );

    if (course && !course.batch) {
      course.batch = "22";
      course.semesterNumber = 6;
      changed = true;
    }
  }

  const grouped = new Map<
    string,
    (typeof schedule)[number][]
  >();

  for (const entry of schedule) {
    const id = universityCourseId(
      entry.batch,
      entry.section,
      entry.semester,
      entry.course
    );

    const entries = grouped.get(id) || [];

    entries.push(entry);
    grouped.set(id, entries);
  }

  for (const [id, entries] of grouped) {
    if (result.some((course) => course.id === id)) {
      continue;
    }

    const first = entries[0];

    const teachers = Array.from(
      new Set(
        entries.map((entry) => fullName(entry.teacher))
      )
    );

    const rooms = Array.from(
      new Set(entries.map((entry) => entry.room))
    );

    const times = Array.from(
      new Set(
        entries.map((entry) => timeSlots[entry.slot])
      )
    );

    result.push({
      id,
      batch: first.batch,
      semesterNumber: first.semester,
      name: first.course,
      code: "",
      semester: first.semester
        ? `${first.semester}th Semester`
        : "Semester not specified",
      teacher: teachers.join(" / "),
      section: first.section || "Not specified",
      room: rooms.join(" / "),
      time:
        times.length === 1
          ? times[0]
          : "See class schedule",
      schedule: entries
        .map(
          (entry) =>
            `${entry.day}: ${timeSlots[entry.slot]} · Room ${entry.room} · ${fullName(entry.teacher)}`
        )
        .join("\n"),
      students: [],
    });

    changed = true;
  }

  for (const reference of referenceCourses) {
    const id =
      reference.batch === "22" &&
      reference.semester === 6
        ? previousCourseIds[reference.name] ||
          reference.id
        : reference.id;

    if (result.some((course) => course.id === id)) {
      continue;
    }

    result.push({
      id,
      batch: reference.batch,
      semesterNumber: reference.semester,
      name: reference.name,
      code: reference.code,
      semester: `${reference.semester}th Semester`,
      teacher: fullName(reference.teacher),
      section: "Not specified",
      room: "Not supplied",
      time: "Not supplied",
      schedule: "Weekly class schedule not supplied.",
      students: [],
    });

    changed = true;
  }

  if (changed) {
    writeCourses(result);
  }

  return result;
}