import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CursorTrail from "../components/CursorTrail";

const getIconForLine = (line) => {
  const l = line.toLowerCase();
  if (l.includes("food") || l.includes("restaurant") || l.includes("dinner")) return "🍽️";
  if (l.includes("museum") || l.includes("history")) return "🏛️";
  if (l.includes("nature") || l.includes("park")) return "🌳";
  if (l.includes("hike") || l.includes("trail")) return "🥾";
  if (l.includes("relax") || l.includes("spa")) return "💆";
  if (l.includes("shopping") || l.includes("market")) return "🛍️";
  if (l.includes("nightlife") || l.includes("bar") || l.includes("club")) return "🌃";
  if (l.includes("beach") || l.includes("sea") || l.includes("coast")) return "🏖️";
  return "📍";
};

const TripPublicPage = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const mainContentRef = useRef(null);

  useEffect(() => {
    const fetchTrip = async () => {
      const { data, error } = await supabase
        .from("itineraries")
        .select("*")
        .eq("public_id", id)
        .eq("is_public", true)
        .single();

      if (!error) setTrip(data);
      else console.error("Error fetching public trip:", error);

      setLoading(false);
    };

    fetchTrip();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      if (!mainContentRef.current) return;

      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;

      const scrollableDistance = documentHeight - windowHeight;
      const triggerPoint = scrollableDistance * 0.8;

      if (scrollTop > triggerPoint) {
        const curtainProgress = (scrollTop - triggerPoint) / (scrollableDistance - triggerPoint);
        setScrollProgress(Math.min(Math.max(curtainProgress, 0), 1));
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const parseItinerary = (text) => {
    const lines = text.split("\n").filter(Boolean);
    const days = [];
    let currentDay = [];
    let dayCounter = 1;

    lines.forEach((line) => {
      if (line.toLowerCase().startsWith("- activity 1")) {
        if (currentDay.length > 0) {
          days.push({
            day: dayCounter++,
            content: currentDay.join("\n"),
          });
          currentDay = [];
        }
      }
      currentDay.push(line);
    });

    if (currentDay.length > 0) {
      days.push({
        day: dayCounter,
        content: currentDay.join("\n"),
      });
    }

    return days;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Trip not found or is private.
      </div>
    );
  }

  const parsed = parseItinerary(trip.itinerary);
  const mainContentTransform = `translateY(${-100 * scrollProgress}vh)`;
  const footerOpacity = scrollProgress;

  return (
    <div className="relative w-screen overflow-x-hidden bg-gradient-to-br from-yellow-50 to-pink-100">
      <CursorTrail />

      {/* CURTAIN FOOTER */}
      <div
        className="fixed inset-0 z-0 bg-[#FFFDDB] flex items-center justify-center"
        style={{ opacity: footerOpacity }}
      >
        <Footer />
      </div>
        <Navbar />

      {/* MAIN CONTENT */}
      <div
        ref={mainContentRef}
        className="relative z-10 transition-transform duration-300 ease-out"
        style={{ transform: mainContentTransform }}
      >
      

        <main className="flex-1 px-4 md:px-10 py-10 w-full mt-16">
          <div className="text-center mb-10 w-full">
            <h1 className="text-5xl font-bold text-pink-800">
              {trip.city} ({trip.days} days)
            </h1>
            <p className="text-gray-700 mt-4 text-lg">
              Budget: <strong>{trip.budget}</strong> • Activities: {trip.activities?.join(", ")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 w-full">
            {parsed.map((day) => (
              <div
                key={day.day}
                className="border border-gray-200 rounded-xl p-6 bg-white shadow-md"
              >
                <h2 className="text-2xl font-bold text-pink-700 mb-4">Day {day.day}</h2>
                <ul className="space-y-3 text-gray-800">
                  {day.content
                    .split("\n")
                    .filter((line) => line.trim() !== "")
                    .map((line, idx) => (
                      <li
                        key={idx}
                        className="flex gap-3 items-start text-base leading-relaxed"
                      >
                        <span className="text-xl">{getIconForLine(line)}</span>
                        <span>{line.replace(/^[-*•]/, "").trim()}</span>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </main>

        {/* Spacer to allow scroll */}
        <div className="h-[20vh]" />
      </div>
    </div>
  );
};

export default TripPublicPage;
