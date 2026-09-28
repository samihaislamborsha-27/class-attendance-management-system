"use client";

import { FormEvent, useState } from "react";

type AddCourseModelProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddCourse: (course: {
    name: string;
    code: string;
    semester: string;
  }) => void;
};

export default function AddCourseModel({
  isOpen,
  onClose,
  onAddCourse,
}: AddCourseModelProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [semester, setSemester] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim() || !code.trim() || !semester.trim()) {
      return;
    }

    onAddCourse({
      name: name.trim(),
      code: code.trim(),
      semester: semester.trim(),
    });

    setName("");
    setCode("");
    setSemester("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              New Course
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Add a course
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter the course information below.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-600 hover:bg-slate-200"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="courseName"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Course Name
            </label>

            <input
              id="courseName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Example: Web Development"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div>
            <label
              htmlFor="courseCode"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Course Code
            </label>

            <input
              id="courseCode"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Example: CSE-401"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div>
            <label
              htmlFor="semester"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Semester
            </label>

            <input
              id="semester"
              type="text"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              placeholder="Example: Fall 2026"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Add Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}