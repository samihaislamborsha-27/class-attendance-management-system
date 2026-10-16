"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

const SESSION_KEY = "classtrack-demo-session";

type Profile = {
  name: string;
  phone: string;
  department: string;
  designation: string;
  teacherId: string;
  photo: string;
};

const emptyProfile: Profile = {
  name: "",
  phone: "",
  department: "",
  designation: "",
  teacherId: "",
  photo: "",
};

const fields = [
  { key: "name", label: "Full name", placeholder: "Your full name" },
  { key: "phone", label: "Phone", placeholder: "Optional" },
  {
    key: "department",
    label: "Department",
    placeholder: "e.g. CSE",
  },
  {
    key: "designation",
    label: "Designation",
    placeholder: "e.g. Lecturer",
  },
  { key: "teacherId", label: "Teacher ID", placeholder: "Optional" },
] as const;

function getEmail(): string {
  const raw = localStorage.getItem(SESSION_KEY);
  const session = raw ? JSON.parse(raw) : null;

  return typeof session?.email === "string"
    ? session.email.trim()
    : "";
}

function profileKey(email: string) {
  return `classtrack-profile-v1:${email.toLowerCase()}`;
}

function validPhoto(value: unknown): value is string {
  return (
    typeof value === "string" &&
    (value === "" ||
      /^data:image\/(jpeg|png|webp);base64,/.test(value))
  );
}

export default function ProfilePage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [ready, setReady] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [readingPhoto, setReadingPhoto] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const currentEmail = getEmail();

        if (!currentEmail) {
          router.replace("/login");
          return;
        }

        setEmail(currentEmail);

        const raw = localStorage.getItem(profileKey(currentEmail));

        if (raw) {
          const saved = JSON.parse(raw);

          if (
            !saved ||
            typeof saved !== "object" ||
            Array.isArray(saved)
          ) {
            throw new Error("Invalid profile");
          }

          const loaded = { ...emptyProfile };

          for (const { key } of fields) {
            if (typeof saved[key] !== "string") {
              throw new Error("Invalid profile field");
            }

            loaded[key] = saved[key];
          }

          // Older profiles have no photo field.
          if (saved.photo !== undefined) {
            if (!validPhoto(saved.photo)) {
              throw new Error("Invalid photo");
            }

            loaded.photo = saved.photo;
          }

          setProfile(loaded);
        }
      } catch {
        setBlocked(true);
        setError(
          "Could not read your saved profile. Saving is disabled to protect it."
        );
      } finally {
        setReady(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [router]);

  function updateField(key: keyof Profile, value: string) {
    setProfile((current) => ({ ...current, [key]: value }));
    setError("");
    setMessage("");
  }

  function choosePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    setError("");
    setMessage("");

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Choose a JPG, PNG, or WebP picture.");
      return;
    }

    if (file.size > 500 * 1024) {
      setError("Choose a picture smaller than 500 KB.");
      return;
    }

    setReadingPhoto(true);

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (validPhoto(result)) {
        setProfile((current) => ({ ...current, photo: result }));
        setMessage("Picture selected. Click Save Profile to keep it.");
      } else {
        setError("Could not read this picture.");
      }

      setReadingPhoto(false);
    };

    reader.onerror = () => {
      setReadingPhoto(false);
      setError("Could not read this picture. Please try another.");
    };

    reader.onabort = () => setReadingPhoto(false);
    reader.readAsDataURL(file);
  }

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (blocked || readingPhoto) return;

    setError("");
    setMessage("");

    if (!profile.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    try {
      const currentEmail = getEmail();

      if (
        !currentEmail ||
        currentEmail.toLowerCase() !== email.toLowerCase()
      ) {
        router.replace("/login");
        return;
      }

      const cleaned: Profile = {
        name: profile.name.trim(),
        phone: profile.phone.trim(),
        department: profile.department.trim(),
        designation: profile.designation.trim(),
        teacherId: profile.teacherId.trim(),
        photo: profile.photo,
      };

      localStorage.setItem(
        profileKey(currentEmail),
        JSON.stringify(cleaned)
      );

      setProfile(cleaned);
      setMessage("Profile saved successfully.");

      // Show the popup only after storage succeeds.
      window.alert("Profile saved successfully!");
    } catch {
      setError(
        "Could not save. Browser storage may be full or unavailable. Try a smaller picture."
      );
    }
  }

  const initials =
    profile.name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "T";

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100";

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        Loading profile…
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-green-50 via-white to-blue-50 px-5 py-10 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="text-2xl font-bold text-blue-800">
            Class<span className="text-green-700">Track</span>
          </Link>

          <Link href="/dashboard" className="font-semibold text-blue-800">
            ← Dashboard
          </Link>
        </header>

        <section className="mt-8 overflow-hidden rounded-2xl border border-green-100 bg-white shadow-sm">
          <div className="flex items-center gap-5 bg-green-50 p-6 sm:p-8">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-blue-800 text-2xl font-bold text-white shadow-sm">
              {profile.photo ? (
                <Image
                  src={profile.photo}
                  alt="Your profile picture"
                  width={96}
                  height={96}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-blue-950">
                My Profile
              </h1>
              <p className="mt-2 break-all text-sm text-slate-600">
                {email}
              </p>
            </div>
          </div>

          <form onSubmit={saveProfile} className="p-6 sm:p-8">
            <fieldset disabled={blocked || !email}>
              <legend className="sr-only">Profile information</legend>

              <div className="mb-7 border-b border-slate-200 pb-6">
                <label
                  htmlFor="photo"
                  className="mb-3 block font-semibold"
                >
                  Profile picture
                </label>

                <input
                  id="photo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={choosePhoto}
                  disabled={readingPhoto}
                  className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-3 file:font-semibold file:text-blue-800"
                />

                <p className="mt-2 text-sm text-slate-500">
                  JPG, PNG, or WebP · Maximum 500 KB
                </p>

                {readingPhoto && (
                  <p role="status" className="mt-2 text-blue-700">
                    Loading picture…
                  </p>
                )}

                {profile.photo && (
                  <button
                    type="button"
                    disabled={readingPhoto}
                    onClick={() => {
                      updateField("photo", "");
                      setMessage(
                        "Picture removed from preview. Click Save Profile to keep this change."
                      );
                    }}
                    className="mt-3 text-sm font-semibold text-red-700"
                  >
                    Remove picture
                  </button>
                )}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {fields.map(({ key, label, placeholder }) => (
                  <div
                    key={key}
                    className={key === "name" ? "sm:col-span-2" : ""}
                  >
                    <label
                      htmlFor={key}
                      className="mb-2 block font-medium"
                    >
                      {label}
                    </label>

                    <input
                      id={key}
                      type={key === "phone" ? "tel" : "text"}
                      required={key === "name"}
                      maxLength={key === "phone" ? 30 : 100}
                      autoComplete={
                        key === "name"
                          ? "name"
                          : key === "phone"
                            ? "tel"
                            : undefined
                      }
                      value={profile[key]}
                      onChange={(event) =>
                        updateField(key, event.target.value)
                      }
                      placeholder={placeholder}
                      className={inputClass}
                    />
                  </div>
                ))}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block font-medium"
                  >
                    Sign-in email
                  </label>
                  <input
                    id="email"
                    readOnly
                    value={email}
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="institute"
                    className="mb-2 block font-medium"
                  >
                    Institute
                  </label>
                  <input
                    id="institute"
                    readOnly
                    value="Daffodil Institute of IT"
                    className={inputClass}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={readingPhoto}
                className="mt-7 w-full rounded-xl bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800 disabled:opacity-50 sm:w-auto"
              >
                {readingPhoto ? "Loading picture…" : "Save Profile"}
              </button>
            </fieldset>

            {message && (
              <p role="status" className="mt-4 text-green-700">
                {message}
              </p>
            )}

            {error && (
              <p role="alert" className="mt-4 text-red-700">
                {error}
              </p>
            )}

            <p className="mt-5 text-sm text-slate-500">
              Saved in this browser only.
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}