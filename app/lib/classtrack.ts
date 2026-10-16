export type Student = {
  id: string;
  name: string;
  roll: string;
};

export type Course = {
  id: string;
  code: string;
  name: string;
  semester: string;
  teacher: string;
  section: string;
  room: string;
  time: string;
  schedule: string;
  students: Student[];
};

export type Status = "present" | "absent";

export type AttendanceRecord = {
  courseId: string;
  date: string;
  students: Student[];
  marks: Record<string, Status>;
  updatedAt: string;
};

export type AttendanceRecords = Record<string, AttendanceRecord>;

export const COURSE_KEY = "classtrack-courses-v1";
export const ATTENDANCE_KEY = "classtrack-attendance-v1";

const sampleStudents: Student[] = [
  { id: "1", name: "Student 01", roll: "CSE-2201" },
  { id: "2", name: "Student 02", roll: "CSE-2202" },
  { id: "3", name: "Student 03", roll: "CSE-2203" },
  { id: "4", name: "Student 04", roll: "CSE-2204" },
  { id: "5", name: "Student 05", roll: "CSE-2205" },
];

const initialCourses: Course[] = [
  {
    id: "software-engineering",
    code: "SWE",
    name: "Software Engineering",
    semester: "6th Semester",
    teacher: "NJS",
    section: "A / C",
    room: "701",
    time: "11:40 AM",
    schedule: "Sunday, Monday, Tuesday & Thursday",
    students: sampleStudents,
  },
  {
    id: "computer-networking",
    code: "CN",
    name: "Computer Networking",
    semester: "6th Semester",
    teacher: "MMR",
    section: "A / C",
    room: "701 / 702",
    time: "12:50 PM",
    schedule: "Sunday, Monday, Tuesday & Thursday",
    students: sampleStudents,
  },
  {
    id: "theory-of-computation",
    code: "TOC",
    name: "Theory of Computation",
    semester: "6th Semester",
    teacher: "TCO",
    section: "A / C",
    room: "701 / 702",
    time: "11:40 AM",
    schedule: "Monday & Tuesday",
    students: sampleStudents,
  },
  {
    id: "embedded-system-programming",
    code: "ESP",
    name: "Embedded System Programming",
    semester: "6th Semester",
    teacher: "RKD",
    section: "A / C",
    room: "701 / 702",
    time: "11:40 AM",
    schedule: "Monday, Tuesday, Wednesday & Thursday",
    students: sampleStudents,
  },
];

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isStudent(value: unknown): value is Student {
  return (
    isObject(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.roll === "string"
  );
}

function isCourse(value: unknown): value is Course {
  if (!isObject(value)) return false;

  const keys = [
    "id", "code", "name", "semester", "teacher",
    "section", "room", "time", "schedule",
  ];

  return (
    keys.every((key) => typeof value[key] === "string") &&
    Array.isArray(value.students) &&
    value.students.every(isStudent)
  );
}

export function readCourses(): Course[] {
  const raw = localStorage.getItem(COURSE_KEY);

  if (!raw) {
    return initialCourses.map((course) => ({
      ...course,
      students: course.students.map((student) => ({ ...student })),
    }));
  }

  const value: unknown = JSON.parse(raw);

  if (
    !Array.isArray(value) ||
    !value.every(isCourse) ||
    new Set(value.map((course) => course.id)).size !== value.length
  ) {
    throw new Error("Saved courses could not be read.");
  }

  return value;
}

export function writeCourses(courses: Course[]) {
  localStorage.setItem(COURSE_KEY, JSON.stringify(courses));
}

export function readAttendance(): AttendanceRecords {
  const raw = localStorage.getItem(ATTENDANCE_KEY);
  if (!raw) return {};

  const value: unknown = JSON.parse(raw);

  if (!isObject(value)) {
    throw new Error("Saved attendance could not be read.");
  }

  for (const record of Object.values(value)) {
    if (
      !isObject(record) ||
      typeof record.courseId !== "string" ||
      typeof record.date !== "string" ||
      typeof record.updatedAt !== "string" ||
      !Array.isArray(record.students) ||
      !record.students.every(isStudent) ||
      !isObject(record.marks) ||
      !Object.values(record.marks).every(
        (status) => status === "present" || status === "absent"
      )
    ) {
      throw new Error("A saved attendance record is invalid.");
    }
  }

  return value as AttendanceRecords;
}

export function today() {
  const date = new Date();

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export function recordKey(courseId: string, date: string) {
  return `${courseId}:${date}`;
}

// Only saved, marked attendance contributes to percentages.
export function attendanceStats(
  records: AttendanceRecords,
  courseId?: string,
  studentId?: string
) {
  let present = 0;
  let absent = 0;

  for (const record of Object.values(records)) {
    if (courseId && record.courseId !== courseId) continue;

    const seen = new Set<string>();

    for (const student of record.students) {
      if (studentId && student.id !== studentId) continue;
      if (seen.has(student.id)) continue;
      seen.add(student.id);

      if (record.marks[student.id] === "present") present++;
      if (record.marks[student.id] === "absent") absent++;
    }
  }

  const total = present + absent;

  return {
    present,
    absent,
    total,
    percentage: total ? `${((present / total) * 100).toFixed(1)}%` : "—",
  };
}

export function errorText(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}