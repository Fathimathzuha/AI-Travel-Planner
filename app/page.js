"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("");
  const [travelWith, setTravelWith] = useState("");
  const [purpose, setPurpose] = useState("");
  const [budget, setBudget] = useState("");
  const [interests, setInterests] = useState([]);
  const [preferences, setPreferences] = useState("");
  const [itinerary, setItinerary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const interestOptions = [
    "🍜 Food",
    "🌿 Nature",
    "🏛️ History & Culture",
    "🧗 Adventure",
    "🛍️ Shopping",
    "🧘 Relaxation",
    "🏖️ Beaches",
    "🌃 Nightlife",
    "📸 Photography",
    "🖼️ Museums",
    "🦁 Wildlife",
    "🥾 Hiking",
    "🚣 Water Sports",
    "🏰 Architecture",
    "🧺 Local Markets",
    "👨‍👩‍👧 Family Activities",
    "🕌 Spiritual Places",
    "💎 Hidden Gems",
  ];

  const toggleInterest = (interest) => {
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    );
  };

  const handleGenerateTrip = async () => {
    if (
      !destination.trim() ||
      !days ||
      !travelWith ||
      !purpose ||
      !budget
    ) {
      setError("Please fill in all required fields before continuing.");
      return;
    }

    if (
      !Number.isInteger(Number(days)) ||
      Number(days) < 1 ||
      Number(days) > 30
    ) {
      setError("Please choose a trip duration between 1 and 30 days.");
      return;
    }

    setLoading(true);
    setError("");
    setItinerary("");
    setCopied(false);

    try {
      const response = await fetch("/api/generate-trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination: destination.trim(),
          days,
          travelWith,
          purpose,
          budget,
          interests,
          preferences,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to generate your trip.");
      }

      setItinerary(data.itinerary);
    } catch (err) {
      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(itinerary);
      setCopied(true);
    } catch {
      setError(
        "Unable to copy automatically. Please select and copy the itinerary."
      );
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  const labelClass =
    "block text-sm font-semibold text-slate-700";

  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f8ff] text-slate-800">
      {/* Navigation */}
      <nav className="border-b border-white/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="#" className="flex items-center gap-2.5">
            <span className="text-3xl">✈️</span>
            <span className="text-lg font-extrabold tracking-tight text-slate-900">
              AI Travel <span className="text-blue-600">Planner</span>
            </span>
          </a>

          <span className="hidden rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 sm:inline-flex">
            ✨ Powered by AI
          </span>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-blue-100 via-white to-violet-100">
        <div className="pointer-events-none absolute -right-20 -top-24 -z-10 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-0 -z-10 h-80 w-80 rounded-full bg-violet-300/30 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-widest text-blue-700 shadow-sm">
              <span>✦</span> Your next adventure awaits
            </span>

            <h1 className="mt-6 max-w-2xl text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Your journey,
              <span className="block bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                your way.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Tell us what you love, where you want to go, and your
              budget. Let AI turn your travel dreams into a personalized
              itinerary.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {[
                "🧭 Personalized plans",
                "⚡ Quick recommendations",
                "💙 Travel with confidence",
              ].map((feature) => (
                <span
                  key={feature}
                  className="rounded-full border border-white bg-white/80 px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm sm:text-sm"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Decorative travel card */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -right-3 -top-4 h-24 w-24 rounded-full bg-yellow-200/70 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white p-3 shadow-2xl shadow-blue-900/10">
              <div className="relative flex min-h-64 flex-col justify-between overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-700 p-6 text-white sm:min-h-72">
                <div className="absolute -right-8 top-8 h-44 w-44 rounded-full border border-white/20" />
                <div className="absolute -right-1 top-16 h-32 w-32 rounded-full border border-white/20" />
                <div className="absolute -bottom-10 -left-8 h-40 w-64 -rotate-12 rounded-[50%] bg-emerald-300/50" />
                <div className="absolute -bottom-16 left-20 h-40 w-72 -rotate-6 rounded-[50%] bg-emerald-500/60" />

                <div className="relative">
                  <span className="rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                    YOUR NEXT DESTINATION
                  </span>
                  <h2 className="mt-5 text-3xl font-extrabold sm:text-4xl">
                    The world is
                    <br />
                    waiting for you.
                  </h2>
                  <p className="mt-2 text-sm text-blue-50">
                    Discover more. Plan smarter.
                  </p>
                </div>

                <div className="relative mt-10 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-blue-100">Make every moment</p>
                    <p className="text-lg font-bold">An adventure ✨</p>
                  </div>
                  <span className="text-5xl drop-shadow-lg">🌍</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 px-3 py-4">
                <div>
                  <p className="font-bold text-slate-900">
                    Your next great escape
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Made for your travel style
                  </p>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-2 text-lg">
                  🧳
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section
        id="trip-form"
        className="mx-auto -mt-2 max-w-7xl px-4 pb-12 sm:px-8 sm:pb-16"
      >
        <div className="rounded-3xl border border-white bg-white p-5 shadow-xl shadow-blue-900/5 sm:p-8 lg:p-10">
          <div className="mb-8 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
              🧭
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                Let's plan your trip
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                A few details will help us create a trip that feels
                just right for you.
              </p>
            </div>
          </div>

          <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-6">
            {/* Destination */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label htmlFor="destination" className={labelClass}>
                📍 Where do you want to go? *
              </label>
              <input
                id="destination"
                type="text"
                placeholder="e.g. Goa, Paris, Tokyo"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Days */}
            <div className="sm:col-span-1 lg:col-span-3">
              <label htmlFor="days" className={labelClass}>
                🗓️ Number of days *
              </label>
              <select
                id="days"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className={inputClass}
              >
                <option value="">Select trip duration</option>
                {Array.from({ length: 30 }, (_, i) => i + 1).map(
                  (day) => (
                    <option key={day} value={day}>
                      {day} {day === 1 ? "day" : "days"}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Travel group */}
            <div className="sm:col-span-1 lg:col-span-2">
              <label htmlFor="travelWith" className={labelClass}>
                👥 Travelling with *
              </label>
              <select
                id="travelWith"
                value={travelWith}
                onChange={(e) => setTravelWith(e.target.value)}
                className={inputClass}
              >
                <option value="">Choose your group</option>
                <option value="Solo">Solo</option>
                <option value="Partner">Partner</option>
                <option value="Family">Family</option>
                <option value="Friends">Friends</option>
              </select>
            </div>

            {/* Purpose */}
            <div className="sm:col-span-1 lg:col-span-2">
              <label htmlFor="purpose" className={labelClass}>
                🎯 Purpose of trip *
              </label>
              <select
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className={inputClass}
              >
                <option value="">Choose a purpose</option>
                <option value="Vacation">Vacation</option>
                <option value="Adventure">Adventure</option>
                <option value="Business">Business</option>
                <option value="Honeymoon">Honeymoon</option>
                <option value="Relaxation">Relaxation</option>
              </select>
            </div>

            {/* Budget */}
            <div className="sm:col-span-2 lg:col-span-2">
              <label htmlFor="budget" className={labelClass}>
                💰 Approximate budget *
              </label>
              <select
                id="budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className={inputClass}
              >
                <option value="">Choose your budget</option>
                <option value="Budget">Budget-friendly</option>
                <option value="Moderate">Moderate</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>

            {/* Interests */}
            <div className="sm:col-span-2 lg:col-span-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className={labelClass}>
                  ✨ What are you interested in?
                </label>
                <span className="text-xs text-slate-500">
                  {interests.length} selected
                </span>
              </div>

              <p className="mb-4 mt-1 text-sm text-slate-500">
                Choose as many as you like.
              </p>

              <div className="flex flex-wrap gap-2.5">
                {interestOptions.map((item) => {
                  const selected = interests.includes(item);

                  return (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleInterest(item)}
                      className={`rounded-full border px-3.5 py-2.5 text-sm font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 ${
                        selected
                          ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/20"
                          : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                      }`}
                    >
                      {item}
                      {selected && <span className="ml-1">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preferences */}
            <div className="sm:col-span-2 lg:col-span-6">
              <label htmlFor="preferences" className={labelClass}>
                💬 Any specific preferences?
                <span className="ml-2 font-normal text-slate-400">
                  Optional
                </span>
              </label>
              <textarea
                id="preferences"
                rows={4}
                placeholder="e.g. vegetarian food, family-friendly places, less walking, peaceful locations..."
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                className={`${inputClass} resize-y`}
              />
              <p className="mt-2 text-xs text-slate-400">
                Tell us what would make your trip special.
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
            >
              <strong>Something needs attention.</strong>
              <p className="mt-1">{error}</p>
              <button
              type="button"
              onClick={handleGenerateTrip}
              disabled={loading}
              className="mt-3 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Retrying..." : "Try Again"}
              </button>
            </div>          
          )}

          {/* Generate */}
          <div className="mt-8 border-t border-slate-100 pt-6">
            <button
              onClick={handleGenerateTrip}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 font-bold text-white shadow-lg shadow-blue-600/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/25 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 sm:ml-auto sm:w-auto sm:min-w-64"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Creating your trip...
                </>
              ) : (
                <>
                  <span className="text-lg">✦</span>
                  Generate My Trip
                  <span aria-hidden="true">→</span>
                </>
              )}
            </button>
            <p className="mt-3 text-center text-xs text-slate-400 sm:text-right">
              * Required fields · Personalized with AI
            </p>
          </div>
        </div>

        {/* Benefits */}
        {!itinerary && !loading && (
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: "🎯",
                title: "Made for you",
                description:
                  "Recommendations shaped around your interests and budget.",
              },
              {
                icon: "⏱️",
                title: "Save planning time",
                description:
                  "Get a day-by-day starting plan in just a few moments.",
              },
              {
                icon: "🌍",
                title: "Explore more",
                description:
                  "Discover activities and experiences for your destination.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-white bg-white/80 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <span className="text-2xl">{feature.icon}</span>
                <h3 className="mt-3 font-bold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Itinerary result */}
        {itinerary && (
          <section
            id="itinerary-result"
            className="mt-10 scroll-mt-6 overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-xl shadow-blue-900/5"
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-7 text-white sm:px-9">
              <p className="text-sm font-semibold text-blue-100">
                YOUR PERSONALIZED TRAVEL PLAN
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold sm:text-3xl">
                    Your adventure starts here
                  </h2>
                  <p className="mt-2 text-sm text-blue-100">
                    {destination} · {days} {Number(days) === 1 ? "day" : "days"}
                  </p>
                </div>

                <button
                  onClick={handleCopy}
                  className="rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
                >
                  {copied ? "✓ Copied!" : "▣ Copy itinerary"}
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-8 lg:p-10">
              <div className="max-w-none text-sm leading-7 text-slate-600 sm:text-base [&_h1]:mb-4 [&_h1]:mt-7 [&_h1]:text-3xl [&_h1]:font-extrabold [&_h1]:leading-tight [&_h1]:text-slate-900 [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:border-b [&_h2]:border-blue-100 [&_h2]:pb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-blue-900 [&_p]:mb-4 [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_li]:pl-1 [&_strong]:font-bold [&_strong]:text-slate-900 [&_hr]:my-7 [&_hr]:border-slate-200">
                <ReactMarkdown>{itinerary}</ReactMarkdown>
              </div>

              <div className="mt-10 rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
                <p className="font-bold text-slate-900">
                  ✨ Ready for your next adventure?
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  You can adjust your preferences above and generate a new
                  itinerary whenever you want.
                </p>
                <button
                  onClick={() => {
                    setItinerary("");
                    setError("");
                    setCopied(false);
                    document
                      .getElementById("trip-form")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="mt-4 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                >
                  Plan another trip ↑
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="py-8 text-center text-xs text-slate-400">
          <p className="font-semibold text-slate-500">
            ✈️ AI Travel Planner
          </p>
          <p className="mt-2">
            Made to help you plan smarter and explore further.
          </p>
          <p className="mt-1">
            AI recommendations may need verification before travel.
          </p>
        </footer>
      </section>
    </main>
  );
}

