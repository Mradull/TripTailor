// TripDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import CursorTrail from "../components/CursorTrail"; 

const getIconForLine = (line) => {
  const l = line.toLowerCase();
  if (l.includes("food") || l.includes("restaurant") || l.includes("dinner")) return "🍽️";
  if (l.includes("museum") || l.includes("history")) return "🏛️";
  if (l.includes("nature") || l.includes("park")) return "🌳";
  if (l.includes("hike") || l.includes("trail")) return "🧶";
  if (l.includes("relax") || l.includes("spa")) return "💆";
  if (l.includes("shopping") || l.includes("market")) return "🛙";
  if (l.includes("nightlife") || l.includes("bar") || l.includes("club")) return "🌃";
  if (l.includes("beach") || l.includes("sea") || l.includes("coast")) return "🏖️";
  return "📍";
};

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

  // Push the last day
  if (currentDay.length > 0) {
    days.push({
      day: dayCounter,
      content: currentDay.join("\n"),
    });
  }

  return days;
};


const TripDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [itinerary, setItinerary] = useState([]);

  useEffect(() => {
    const fetchTrip = async () => {
      const { data, error } = await supabase.from("itineraries").select("*").eq("id", id).single();
      if (error) {
        console.error("Failed to fetch trip", error);
      } else {
        setTrip(data);
        setItinerary(parseItinerary(data.itinerary));
        console.log("Raw itinerary:", data.itinerary);

      }
    };

    fetchTrip();
  }, [id]);

  if (!trip) {
    return <div className="text-center py-20">Loading trip details...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
        <CursorTrail />
      <Navbar />

      <div className="flex-1 px-6 md:px-20 py-10 bg-gradient-to-br from-blue-50 to-purple-100">
        <div className="w-full h-60 rounded-xl mb-8 overflow-hidden">
          <img
            src={`https://source.unsplash.com/1600x600/?${trip.city},travel`}
            alt="City banner"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-md p-6 mb-10">
          <h1 className="text-4xl font-bold text-blue-800">
            {trip.city} ({trip.days} days)
          </h1>
          <p className="text-gray-600 mt-2">
            Budget: <strong>{trip.budget}</strong> • Activities: {trip.activities?.join(", ")}
          </p>
        </div>

        {itinerary.map((day) => (
          <motion.div
            key={day.day}
            className="relative pl-6 border-l-4 border-blue-500 bg-white rounded-xl shadow-md p-6 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: day.day * 0.1 }}
          >
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Day {day.day}</h2>
            <ul className="space-y-3 text-gray-700">
              {day.content
                .split("\n")
                .filter((line) => line.trim() !== "")
                .map((line, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-xl">{getIconForLine(line)}</span>
                    <span className="text-base leading-relaxed">
                      {line.replace(/^[-*•]/, "").trim()}
                    </span>
                  </li>
                ))}
            </ul>
          </motion.div>
        ))}

        <div className="flex flex-wrap justify-center gap-4 mt-12">
          <button
            onClick={() => navigate(`/plan-trip?regenerate=${trip.id}`)}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow hover:from-green-600 hover:to-green-700 transition"
          >
            Regenerate Trip
          </button>

          <button
            onClick={() => navigator.clipboard.writeText(`${window.location.origin}/trip/public/${trip.id}`)}
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            Copy Shareable Link
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TripDetailPage;
