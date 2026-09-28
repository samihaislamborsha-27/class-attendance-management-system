export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            ClassTrack
          </h2>
          <p className="text-xs text-slate-500">
            Daffodil Institute of IT
          </p>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          <a href="/" className="font-medium text-slate-900">
            Home
          </a>

          <a href="#features" className="text-slate-600">
            Features
          </a>

          <a href="#about" className="text-slate-600">
            About
          </a>
        </div>

        <button className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700">
          Teacher Login
        </button>
      </nav>
    </header>
  );
}