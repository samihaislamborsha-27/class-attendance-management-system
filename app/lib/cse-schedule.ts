export const teachers: Record<string, string> = {
  SR: "Saidur Rahman",
  RKD: "Ramen Kumar Das",
  PB: "Poly Bhoumik",
  MFO: "Mubtasim Fuad Opee",
  PRM: "Parvezur Rahman Mahin",
  NJS: "Nushrat Jahan Sarker",
  TCO: "Tanjila Chowdhury Orpe",
  TS: "Tanzum Sultana",
  MS: "Moumita Shib",
  MMR: "Md. Mushfiqur Rahaman",
};

export function teacherName(initials: string) {
  return teachers[initials] || initials;
}

export const days = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
] as const;

export type Day = (typeof days)[number];

export const timeSlots = [
  "09:00 AM – 10:10 AM",
  "10:10 AM – 11:20 AM",
  "11:40 AM – 12:50 PM",
  "12:50 PM – 02:00 PM",
  "02:30 PM – 03:40 PM",
];

export type ScheduleEntry = {
  id: string;
  batch: string;
  section: string;
  semester: number | null;
  course: string;
  teacher: string;
  day: Day;
  slot: number;
  room: string;
};

type Row = [
  day: Day,
  group: string,
  slot: number,
  room: string,
  course: string,
  teacher: string
];

// Slot numbers refer to timeSlots above, starting from 0.
// Unknown semester numbers are intentionally left unset.
// Course codes are not inferred from teacher or subject abbreviations.
const rows: Row[] = [
  // SATURDAY
  ["Saturday", "25A", 2, "701", "History of the Emergence of BD", "MHB"],
  ["Saturday", "25A", 3, "701", "Statistics and Probability", "MIH"],
  ["Saturday", "25B", 2, "702", "Statistics and Probability", "AYE"],
  ["Saturday", "25B", 3, "702", "Linear Algebra", "MAK"],
  ["Saturday", "23B", 0, "704", "Data and Telecommunications", "SR"],
  ["Saturday", "23C", 0, "706", "Peripheral and Interfacing", "AYE"],
  ["Saturday", "23C", 1, "713", "Peripheral and Interfacing Lab", "AYE"],
  ["Saturday", "25A", 4, "713", "Digital Systems Lab", "SR"],
  ["Saturday", "23B", 1, "714", "Data and Telecommunications Lab", "SR"],
  ["Saturday", "23C", 2, "714", "Data and Telecommunications Lab", "SR"],

  // SUNDAY
  ["Sunday", "23C", 2, "603", "Economics", "IMK"],
  ["Sunday", "25A", 2, "701", "Discrete Mathematics", "NJS"],
  ["Sunday", "25A", 3, "701", "Digital Systems Design", "MMR"],
  ["Sunday", "25A", 4, "701", "Statistics and Probability", "MIH"],
  ["Sunday", "25B", 2, "702", "Digital Systems Design", "MMR"],
  ["Sunday", "25B", 3, "702", "History of the Emergence of BD", "SQ"],
  ["Sunday", "25B", 4, "702", "Discrete Mathematics", "TCO"],
  ["Sunday", "23B", 0, "704", "Economics", "SJN"],
  ["Sunday", "23B", 1, "704", "Data and Telecommunications", "SR"],
  ["Sunday", "23B", 2, "704", "Operating System", "MFO"],
  ["Sunday", "26A", 4, "704", "Calculus", "MZH"],
  ["Sunday", "23C", 0, "706", "Data and Telecommunications", "RKD"],
  ["Sunday", "23C", 1, "706", "Operating System", "PRM"],
  ["Sunday", "26B", 2, "706", "Physics", "PRM"],
  ["Sunday", "26B", 3, "706", "Calculus", "MIH"],
  ["Sunday", "26B", 4, "706", "Electrical and Electronic Circuit", "SR"],
  ["Sunday", "26A", 2, "714", "Structured Programming Language", "PB"],
  ["Sunday", "26A", 3, "714", "Structured Programming Language Lab", "PB"],

  // MONDAY
  ["Monday", "23B", 2, "603", "Peripheral and Interfacing", "NJS"],
  ["Monday", "25B", 3, "603", "Statistics and Probability", "AYE"],
  ["Monday", "25B", 4, "603", "Digital Systems Design", "MMR"],
  ["Monday", "24C", 0, "701", "Ordinary Differential Equation", "MIH"],
  ["Monday", "24C", 1, "701", "Fundamental of Business Studies", "SI"],
  ["Monday", "24C", 2, "701", "Computer Architecture", "MFO"],
  ["Monday", "25A", 3, "701", "Linear Algebra", "TAT"],
  ["Monday", "25A", 4, "701", "Discrete Mathematics", "NJS"],
  ["Monday", "24A", 0, "702", "Computer Architecture", "PRM"],
  ["Monday", "24A", 1, "702", "Ordinary Differential Equation", "TAT"],
  ["Monday", "24A", 2, "702", "Fundamental of Business Studies", "SI"],
  ["Monday", "22", 0, "704", "Compiler Design and Construction", "TCO"],
  ["Monday", "22", 1, "704", "E-Commerce and Web Engineering", "NJS"],
  ["Monday", "26A", 2, "704", "Calculus", "MZH"],
  ["Monday", "26A", 3, "704", "Electrical and Electronic Circuit", "RKD"],
  ["Monday", "26A", 4, "704", "English", "SQ"],
  ["Monday", "23C", 0, "706", "Peripheral and Interfacing", "AYE"],
  ["Monday", "23C", 1, "706", "Operating System", "PRM"],
  ["Monday", "26B", 2, "706", "English", "FP"],
  ["Monday", "26B", 3, "706", "Calculus", "MIH"],
  ["Monday", "25B", 2, "713", "Digital Systems Lab", "SR"],
  ["Monday", "26B", 4, "713", "Electrical and Electronic Circuit Lab", "SR"],
  ["Monday", "23B", 0, "714", "Operating System Lab", "MFO"],
  ["Monday", "23B", 1, "714", "Operating System", "MFO"],
  ["Monday", "23C", 2, "714", "Operating System Lab", "PRM"],
  ["Monday", "22", 2, "715", "Compiler Design Lab", "TCO"],

  // TUESDAY
  ["Tuesday", "25B", 2, "603", "Linear Algebra", "MAK"],
  ["Tuesday", "24C", 0, "701", "Computer Architecture", "MFO"],
  ["Tuesday", "24C", 1, "701", "Data Structure", "PB"],
  ["Tuesday", "25A", 2, "701", "Linear Algebra", "TAT"],
  ["Tuesday", "25A", 3, "701", "Digital Systems Design", "MMR"],
  ["Tuesday", "25A", 4, "701", "History of the Emergence of BD", "MHB"],
  ["Tuesday", "24A", 1, "702", "Ordinary Differential Equation", "TAT"],
  ["Tuesday", "24A", 2, "702", "Computer Architecture", "PRM"],
  ["Tuesday", "25B", 3, "702", "Discrete Mathematics", "TCO"],
  ["Tuesday", "25B", 4, "702", "History of the Emergence of BD", "SQ"],
  ["Tuesday", "23B", 0, "704", "Peripheral and Interfacing", "NJS"],
  ["Tuesday", "23B", 1, "704", "Economics", "SJN"],
  ["Tuesday", "26A", 2, "704", "Electrical and Electronic Circuit", "RKD"],
  ["Tuesday", "26A", 3, "704", "Physics", "MFO"],
  ["Tuesday", "26A", 4, "704", "Electrical and Electronic Circuit Lab", "SR"],
  ["Tuesday", "23C", 0, "706", "Data and Telecommunications", "RKD"],
  ["Tuesday", "23C", 1, "706", "Economics", "IMK"],
  ["Tuesday", "26B", 2, "706", "Structured Programming Language", "MMR"],
  ["Tuesday", "26B", 3, "706", "Electrical and Electronic Circuit", "SR"],
  ["Tuesday", "26B", 4, "706", "Physics", "PRM"],
  ["Tuesday", "23B", 2, "713", "Peripheral and Interfacing Lab", "NJS"],
  ["Tuesday", "22", 0, "714", "Computer Graphics Lab", "MMR"],
  ["Tuesday", "22", 1, "714", "E-Commerce and Web Engineering Lab", "TS"],
  ["Tuesday", "24C", 2, "714", "Data Structure Lab", "PB"],
  ["Tuesday", "24A", 0, "715", "Object Oriented Programming", "TCO"],
  ["Tuesday", "22", 2, "715", "Computer Graphics", "TS"],

  // WEDNESDAY
  ["Wednesday", "22", 1, "603", "Artificial Intelligence", "MS"],
  ["Wednesday", "22", 2, "603", "Computer Graphics", "TS"],
  ["Wednesday", "24C", 2, "701", "Ordinary Differential Equation", "MIH"],
  ["Wednesday", "24A", 0, "702", "Data Structure Lab", "PB"],
  ["Wednesday", "24A", 1, "702", "Data Structure", "PB"],
  ["Wednesday", "26A", 2, "704", "English", "SQ"],
  ["Wednesday", "26A", 3, "704", "Structured Programming Language", "PB"],
  ["Wednesday", "26A", 4, "704", "Physics", "MFO"],
  ["Wednesday", "26B", 2, "706", "English", "FP"],
  ["Wednesday", "26B", 3, "706", "Structured Programming Language", "MMR"],
  ["Wednesday", "24C", 0, "714", "Object Oriented Programming Lab", "TCO"],
  ["Wednesday", "24C", 1, "714", "Object Oriented Programming", "TCO"],
  ["Wednesday", "24A", 2, "714", "Object Oriented Programming", "TCO"],
  ["Wednesday", "26B", 4, "714", "Structured Programming Language Lab", "MMR"],
  ["Wednesday", "22", 0, "715", "Artificial Intelligence Lab", "MS"],

  // THURSDAY
  ["Thursday", "24C", 0, "701", "Data Structure", "PB"],
  ["Thursday", "24C", 1, "701", "Fundamental of Business Studies", "SI"],
  ["Thursday", "24A", 1, "702", "Data Structure", "PB"],
  ["Thursday", "24A", 2, "702", "Fundamental of Business Studies", "SI"],
  ["Thursday", "22", 0, "704", "E-Commerce and Web Engineering", "NJS"],
  ["Thursday", "22", 1, "704", "Compiler Design and Construction", "TCO"],
  ["Thursday", "22", 2, "704", "Artificial Intelligence", "MS"],
  ["Thursday", "24A", 0, "714", "Object Oriented Programming", "TCO"],
  ["Thursday", "24C", 2, "714", "Object Oriented Programming", "TCO"],
];

export const schedule: ScheduleEntry[] = rows.map(
  ([day, group, slot, room, course, teacher], index) => ({
    id: `routine-${index + 1}`,
    batch: group.match(/^\d+/)?.[0] || group,
    section: group.replace(/^\d+/, ""),
    semester: group === "22" ? 7 : null,
    course,
    teacher,
    day,
    slot,
    room,
  })
);

export type CourseReference = {
  id: string;
  batch: string;
  semester: number;
  name: string;
  code: string;
  teacher: string;
};

// Reference courses are separate from the October weekly routine.
// No exam times are treated as weekly class times.
export const referenceCourses: CourseReference[] = [
  {
    id: "22-6-software-engineering",
    batch: "22",
    semester: 6,
    name: "Software Engineering",
    code: "",
    teacher: "NJS",
  },
  {
    id: "22-6-computer-networking",
    batch: "22",
    semester: 6,
    name: "Computer Networking",
    code: "",
    teacher: "MMR",
  },
  {
    id: "22-6-theory-of-computation",
    batch: "22",
    semester: 6,
    name: "Theory of Computation",
    code: "",
    teacher: "TCO",
  },
  {
    id: "22-6-embedded-system-programming",
    batch: "22",
    semester: 6,
    name: "Embedded System Programming",
    code: "",
    teacher: "RKD",
  },
  {
    id: "21-8-network-security",
    batch: "21",
    semester: 8,
    name: "Network and Information Security",
    code: "540219",
    teacher: "MFO",
  },
  {
    id: "21-8-information-system-management",
    batch: "21",
    semester: 8,
    name: "Information System Management",
    code: "540221",
    teacher: "NJS",
  },
  {
    id: "21-8-digital-image-processing",
    batch: "21",
    semester: 8,
    name: "Digital Image Processing",
    code: "540229",
    teacher: "PRM",
  },
];