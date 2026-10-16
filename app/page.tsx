import Image from "next/image";
import Link from "next/link";

const features = [
  {
    number: "01",
    title: "Manage your courses",
    description:
      "Keep your courses organized and open the attendance sheet for each class.",
  },
  {
    number: "02",
    title: "Record daily attendance",
    description:
      "Mark students present or absent, review saved sessions, and export records.",
  },
  {
    number: "03",
    title: "Review student attendance",
    description:
      "Open your dashboard to review saved records and student attendance percentages.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-green-100 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <Link href="/" className="shrink-0">
            <p className="text-2xl font-bold tracking-tight text-blue-800">
              Class<span className="text-green-700">Track</span>
            </p>

            <p className="mt-1 text-xs text-slate-600 sm:text-sm">
              Daffodil Institute of IT
            </p>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="/" className="font-medium text-blue-800">
              Home
            </Link>

            <a
              href="#features"
              className="text-slate-600 hover:text-green-700"
            >
              Features
            </a>

            <a
              href="#about"
              className="text-slate-600 hover:text-green-700"
            >
              About
            </a>
          </div>

          <Link
            href="/login"
            className="rounded-xl bg-blue-800 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-900 sm:px-6"
          >
            Teacher Login
          </Link>
        </nav>
      </header>

      <section className="bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:min-h-[650px] lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-green-700">
              Class attendance management
            </p>

            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Every class matters.
              <span className="mt-2 block text-blue-800">
                Every student counts.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              A simpler way to manage courses, record daily attendance,
              and follow your students’ attendance throughout the semester.
            </p>

            <a
              href="#features"
              className="mt-8 inline-flex rounded-xl bg-green-700 px-6 py-3.5 font-semibold text-white transition hover:bg-green-800"
            >
              Explore Features
            </a>

            <div className="mt-10 flex flex-wrap gap-7 border-t border-green-200 pt-6">
              <div>
                <p className="font-bold text-blue-800">Daily records</p>
                <p className="mt-1 text-sm text-slate-600">
                  Present and absent
                </p>
              </div>

              <div>
                <p className="font-bold text-green-700">Student overview</p>
                <p className="mt-1 text-sm text-slate-600">
                  Attendance progress
                </p>
              </div>

              <div>
                <p className="font-bold text-blue-800">CSV export</p>
                <p className="mt-1 text-sm text-slate-600">
                  Download saved records
                </p>
              </div>
            </div>
          </div>

          <figure className="mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-green-100 bg-white p-5 shadow-sm">
            <Image
              src="/diit-logo.jpg"
              alt="Daffodil Institute of IT logo"
              width={1536}
              height={1536}
              priority
              sizes="(max-width: 1023px) 90vw, 448px"
              className="h-auto w-full object-contain"
            />

            <figcaption className="pb-4 text-center font-semibold text-blue-800">
              Daffodil Institute of IT
            </figcaption>
          </figure>
        </div>
      </section>

      <section
        id="features"
        className="mx-auto max-w-7xl scroll-mt-6 px-5 py-16 sm:px-8"
      >
        <p className="text-sm font-bold uppercase tracking-widest text-green-700">
          Features
        </p>

        <h2 className="mt-3 text-3xl font-bold text-blue-950">
          Your classroom, better organized.
        </h2>

        <div className="mt-9 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.number}
              className="rounded-2xl border border-slate-200 bg-white p-7"
            >
              <p className="text-2xl font-bold text-green-700">
                {feature.number}
              </p>

              <h3 className="mt-4 text-xl font-bold text-blue-900">
                {feature.title}
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="bg-blue-950 px-5 py-12 text-white">
        <div className="mx-auto max-w-7xl sm:px-3">
          <p className="font-semibold text-green-300">About ClassTrack</p>

          <h2 className="mt-3 text-2xl font-bold">
            Built for everyday academic attendance.
          </h2>

          <p className="mt-4 max-w-2xl leading-7 text-blue-100">
            ClassTrack is an academic project for Daffodil Institute of IT,
            designed to help teachers organize classes and review attendance.
          </p>
        </div>
      </section>

      <footer className="px-5 py-6 text-center text-sm text-slate-600">
        ClassTrack · Daffodil Institute of IT
      </footer>
    </main>
  );
}