"use client";

import { useState } from "react";
import Link from "next/link";
import AddCourseModel from "../components/AddCourseModel";

type Course = {
  id: string;
  code: string;
  name: string;
  section: string;
  students: number;
  attendance: number;
  room: string;
  time: string;
  semester?: string;
};

const initialCourses: Course[] = [
  {
    id: "software-engineering",
    code: "SWE",
    name: "Software Engineering",
    section: "A",
    students: 40,
    attendance: 0,
    room: "701",
    time: "11:40 AM",
    semester: "6th Semester",
  },
  {
    id: "computer-networking",
    code: "CN",
    name: "Computer Networking",
    section: "A",
    students: 40,
    attendance: 0,
    room: "701",
    time: "12:50 PM",
    semester: "6th Semester",
  },
  {
    id: "theory-of-computation",
    code: "TOC",
    name: "Theory of Computation",
    section: "A",
    students: 40,
    attendance: 0,
    room: "701",
    time: "11:40 AM",
    semester: "6th Semester",
  },
  {
    id: "embedded-system-programming",
    code: "ESP",
    name: "Embedded System Programming",
    section: "A",
    students: 40,
    attendance: 0,
    room: "701",
    time: "11:40 AM",
    semester: "6th Semester",
  },
];

export default function DashboardPage() {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);

  const handleAddCourse = (newCourse: {
    name: string;
    code: string;
    semester: string;
  }) => {
    const course: Course = {
      id: `${newCourse.code.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      name: newCourse.name,
      code: newCourse.code,
      semester: newCourse.semester,
      section: "A",
      students: 0,
      attendance: 0,
      room: "TBA",
      time: "TBA",
    };

    setCourses((currentCourses) => [...currentCourses, course]);
  };

  const totalStudents = courses.reduce(
    (total, course) => total + course.students,
    0
  );

  const averageAttendance =
    courses.length > 0
      ? Math.round(
          courses.reduce(
            (total, course) => total + course.attendance,
            0
          ) / courses.length
        )
      : 0;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                ClassTrack
              </h1>

              <p className="text-xs text-slate-500">
                Daffodil Institute of IT
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">Teacher Panel</p>

              <p className="text-xs text-slate-500">
                Academic Dashboard
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
              T
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* TOP */}
        <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold text-blue-600">
              TEACHER DASHBOARD
            </p>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back, Teacher.
            </h2>

            <p className="mt-3 max-w-2xl text-slate-600">
              Manage your classes, record attendance and review student
              attendance from one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddCourseOpen(true)}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            + Add Course
          </button>
        </section>

        {/* STATS */}
        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-medium text-slate-500">
              Total Courses
            </p>

            <p className="mt-3 text-3xl font-bold">
              {courses.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-medium text-slate-500">
              Total Students
            </p>

            <p className="mt-3 text-3xl font-bold">
              {totalStudents}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-medium text-slate-500">
              Semester
            </p>

            <p className="mt-3 text-2xl font-bold">
              6th
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-medium text-slate-500">
              Avg. Attendance
            </p>

            <p className="mt-3 text-3xl font-bold text-blue-600">
              {averageAttendance}%
            </p>
          </div>
        </section>

        {/* COURSES */}
        <section className="mt-12">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600">
                YOUR CLASSES
              </p>

              <h3 className="mt-1 text-2xl font-bold">
                Current Courses
              </h3>
            </div>

            <p className="hidden text-sm text-slate-500 sm:block">
              6th Semester · 2026
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {courses.map((course) => (
              <article
                key={course.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="border-b border-slate-100 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-sm font-semibold text-blue-600">
                        {course.code}
                      </span>

                      <h4 className="mt-2 text-xl font-bold">
                        {course.name}
                      </h4>

                      {course.semester && (
                        <p className="mt-1 text-sm text-slate-500">
                          {course.semester}
                        </p>
                      )}
                    </div>

                    <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      Section {course.section}
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Students</p>
                      <p className="mt-1 font-semibold">
                        {course.students}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500">Attendance</p>
                      <p className="mt-1 font-semibold text-green-600">
                        {course.attendance}%
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500">Room</p>
                      <p className="mt-1 font-semibold">
                        {course.room}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500">Class Time</p>
                      <p className="mt-1 font-semibold">
                        {course.time}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 p-4">
                  <Link
                    href={`/attendance?course=${course.id}`}
                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Take Attendance
                  </Link>

                  <Link
                    href={`/course/${course.id}`}
                    className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold transition hover:bg-slate-50"
                  >
                    View
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* NEXT CLASS */}
        <section className="mt-12 rounded-2xl bg-slate-900 p-7 text-white sm:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold text-blue-300">
                NEXT CLASS
              </p>

              <h3 className="mt-2 text-2xl font-bold">
                Software Engineering — Section A
              </h3>

              <p className="mt-2 text-sm text-slate-300">
                11:40 AM · Room 701
              </p>
            </div>

            <Link
              href="/attendance?course=software-engineering"
              className="rounded-xl bg-white px-5 py-3 text-center text-sm font-bold text-slate-900 transition hover:bg-slate-100"
            >
              Start Attendance
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-14 border-t border-slate-200 py-6 text-center text-sm text-slate-500">
          ClassTrack · Daffodil Institute of IT · Class Attendance Management
          System
        </footer>
      </div>

      {/* ADD COURSE MODAL */}
      <AddCourseModel
        isOpen={isAddCourseOpen}
        onClose={() => setIsAddCourseOpen(false)}
        onAddCourse={handleAddCourse}
      />
    </main>
  );
}