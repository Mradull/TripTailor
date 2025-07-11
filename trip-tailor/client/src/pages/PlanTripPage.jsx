import { useState , useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CursorTrail from "../components/CursorTrail"; 
import { useSearchParams } from "react-router-dom";




// Mock components - replace with your actual imports
//const Navbar = () => <div className="h-16 bg-white shadow-sm"></div>;
//const Footer = () => <div className="h-20 bg-gray-50"></div>;



// Mock clients - replace with your actual implementations
const generateItinerary = async (prompt) => {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`, // Free anon key
        "HTTP-Referer": "http://localhost:5173", // or your production URL
        "X-Title": "TripTailor AI"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "No response";
  } catch (err) {
    console.error("AI error:", err);
    return "Error generating itinerary";
  }
};

// API endpoints for fetching places
const GEONAMES_API_BASE = 'https://secure.geonames.org/searchJSON';
const GEONAMES_USERNAME = 'mradull'; // Replace with your actual username from geonames



const fetchPlaces = async (query) => {
  if (!query || query.length < 2) return [];

  try {
    const response = await fetch(
      `${GEONAMES_API_BASE}?q=${encodeURIComponent(query)}&maxRows=10&featureClass=P&featureClass=A&orderby=relevance&username=${GEONAMES_USERNAME}`
    );

    if (!response.ok) throw new Error("GeoNames API failed");

    const data = await response.json();

    if (!data.geonames || data.geonames.length === 0) {
      throw new Error("No results from GeoNames");
    }

    return data.geonames.map((place) => ({
      name: `${place.name}, ${place.countryName}`,
      country: place.countryName,
      adminName: place.adminName1 || "",
      lat: place.lat,
      lng: place.lng,
      population: place.population || 0,
    }));
  } catch (error) {
    console.warn("Using fallback due to error or no results:", error.message);

    // Filter fallback only if query is at least 2 letters
    const fallbackCities = [
      { name: "Paris, France", country: "France" },
      { name: "Tokyo, Japan", country: "Japan" },
      { name: "New York, United States", country: "United States" },
      { name: "London, United Kingdom", country: "United Kingdom" },
      { name: "Rome, Italy", country: "Italy" },
      { name: "Bangkok, Thailand", country: "Thailand" },
      { name: "Barcelona, Spain", country: "Spain" },
      { name: "Amsterdam, Netherlands", country: "Netherlands" },
      { name: "Sydney, Australia", country: "Australia" },
      { name: "Dubai, United Arab Emirates", country: "United Arab Emirates" },
      { name: "Mumbai, India", country: "India" },
      { name: "Delhi, India", country: "India" },
      { name: "Bangalore, India", country: "India" },
      { name: "Chennai, India", country: "India" },
    ];

    // Basic fuzzy match
    return fallbackCities.filter((dest) =>
      dest.name.toLowerCase().includes(query.toLowerCase())
    );
  }
};

const activitiesList = [
  "Sightseeing",
  "Museums & Galleries",
  "Food Tours",
  "Adventure Sports",
  "Shopping",
  "Nightlife",
  "Beach Activities",
  "Cultural Experiences",
  "Nature & Wildlife",
  "Photography",
  "Wellness & Spa",
  "Local Markets"
];

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

const PlanTripPage = () => {
  const mainContentRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [travelDate, setTravelDate] = useState("");
  const [days, setDays] = useState(3);
  const [selectedBudget, setSelectedBudget] = useState("");
  const [travelCompanions, setTravelCompanions] = useState("");
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [foodPreference, setFoodPreference] = useState("");
  const [loading, setLoading] = useState(false);
  const [itineraryData, setItineraryData] = useState([]);
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const defaultCity = searchParams.get("city") || "";
  const [city, setCity] = useState(defaultCity);


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

const mainContentTransform = `translateY(${-100 * scrollProgress}vh)`;
const footerOpacity = scrollProgress;


  const searchPlaces = async (query) => {
    if (!query || query.length < 2) {
      setDestinations([]);
      return;
    }
    
    setLoadingPlaces(true);
    try {
      const places = await fetchPlaces(query);
      setDestinations(places);
    } catch (error) {
      console.error('Error searching places:', error);
      setDestinations([]);
    } finally {
      setLoadingPlaces(false);
    }
  };

    const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedSearch = debounce(searchPlaces, 500);

  const selectDestination = (destination) => {
    setCity(destination.name);
    setShowDropdown(false);
  };

  const incrementDays = () => {
    setDays((prev) => (prev < 30 ? prev + 1 : prev));
  };

  const decrementDays = () => {
    setDays((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const toggleActivity = (activity) => {
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((i) => i !== activity)
        : [...prev, activity]
    );
  };

  const parseItinerary = (text) => {
    const days = text.split(/Day \d+:?/i).slice(1);
    return days.map((dayText, idx) => ({
      day: idx + 1,
      content: dayText.trim(),
    }));
  };

  const saveToSupabase = async (city, days, activities, budget, fullText) => {
    if (!user) return;
    const { data , error } = await supabase.from("itineraries").insert([
      {
        user_id: user.id,
        city,
        days,
        activities,
        budget: selectedBudget,
        itinerary: fullText,
      },
    ]);

    console.log("Save response:", { data, error });
    if (error) {
  console.error("Supabase Save Error:", error);
  alert("Could not save itinerary to database.");
} else {
  alert("Itinerary saved successfully!");
}
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setItineraryData([]);

const prompt = `
You are an AI travel assistant. Create a ${days}-day itinerary for a trip to ${city}, starting from ${travelDate}. Travelers: ${travelCompanions}. Budget: ${selectedBudget}. Food: ${foodPreference}.
Activities of interest: ${selectedActivities.join(", ")}.

⚠️ STRICT FORMAT REQUIRED — no intro or summary, just this format:

Day 1:
- Activity 1: ...
- Activity 2: ...
- Activity 3: ...
Day 2:
- Activity 1: ...
- Activity 2: ...
...

Each day MUST begin with “Day X:”, and include 3-5 activities (morning, afternoon, evening). Do not skip days. Do not repeat “Activity 1” without a new Day heading.`;



    try {
      const text = await generateItinerary(prompt);
      const parsed = parseItinerary(text);
      setItineraryData(parsed);
    } catch (err) {
      console.error(err);
      alert("Failed to generate itinerary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-screen overflow-x-hidden bg-white">
      <CursorTrail />
      

      <div
      className="fixed inset-0 z-0 bg-[#FFFDDB] flex items-center justify-center"
      style={{ opacity: footerOpacity }}
      >
      <Footer />
    </div>
     <Navbar />

    <div
      ref={mainContentRef}
      className="relative z-10 transition-transform duration-300 ease-out"
      style={{ transform: mainContentTransform }}
    >
     
      <div className="flex-1 flex flex-col items-center justify-start px-4 md:px-8 py-12 w-full mt-16">
        {/* Header Section */}
        <div className="text-center mb-12 max-w-3xl w-full">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tell us your travel preferences
          </h1>
          <p className="text-lg text-gray-600">
            Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
          </p>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 w-full max-w-4xl mb-8 shadow-md">
           <div className="space-y-8">
            {/* Destination Input with Dropdown */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Where do you want to go?
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search destinations..."
                  className="w-full px-4 py-3 border  bg-white text-black border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  value={city}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCity(value);
                    setShowDropdown(true);
                    debouncedSearch(value);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  required
                />
                {showDropdown && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
                    {loadingPlaces ? (
                      <div className="px-4 py-3 text-center text-gray-500">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                          Searching places...
                        </div>
                      </div>
                    ) : destinations.length > 0 ? (
                      destinations.map((destination, idx) => (
                        <div
                          key={idx}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => selectDestination(destination)}
                        >
                          <div className="font-medium text-gray-900">{destination.name}</div>
                          <div className="text-sm text-gray-600">
                            {destination.adminName && `${destination.adminName}, `}{destination.country}
                            {destination.population && ` • Pop: ${destination.population.toLocaleString()}`}
                          </div>
                        </div>
                      ))
                    ) : city.length >= 2 ? (
                      <div className="px-4 py-3 text-center text-gray-500">
                        No places found. Try a different search term.
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            {/* Travel Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                When are you planning to travel?
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 border bg-white text-black border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                style={{
                colorScheme: "light", // Ensures visible icon in light theme
                WebkitAppearance: "none", // Optional - helps in some browsers
              }}
              value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {/* Days Counter */}
            <div>
              <label className="block text-lg font-medium text-gray-800 mb-6">
                How many days are you planning to travel?
              </label>
              <div className="flex items-center justify-between">
                <span className="text-base text-black">Days</span>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={decrementDays}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-gray-600">−</span>
                  </button>
                  <span className="text-lg font-medium text-gray-900 min-w-[2rem] text-center">
                    {days}
                  </span>
                  <button
                    type="button"
                    onClick={incrementDays}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-gray-600">+</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Budget Selection */}
            <div className="border-t border-gray-200 pt-8">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  What is Your Budget?
                </h3>
                <p className="text-sm text-gray-600">
                  The budget is exclusively allocated for activities and dining purposes.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedBudget("low")}
                  className={`p-6 border rounded-lg text-center transition-colors ${
                    selectedBudget === "low"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-center mb-3">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-base font-medium text-gray-900 mb-1">Low</div>
                  <div className="text-sm text-gray-600">0 - 1000 INR</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedBudget("medium")}
                  className={`p-6 border rounded-lg text-center transition-colors ${
                    selectedBudget === "medium"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-center mb-3">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-base font-medium text-gray-900 mb-1">Medium</div>
                  <div className="text-sm text-gray-600">1000 - 2500 INR</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedBudget("high")}
                  className={`p-6 border rounded-lg text-center transition-colors ${
                    selectedBudget === "high"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-center mb-3">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-base font-medium text-gray-900 mb-1">High</div>
                  <div className="text-sm text-gray-600">2500+ INR</div>
                </button>
              </div>
            </div>

            {/* Travel Companions */}
            <div className="border-t border-gray-200 pt-8">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Who do you plan to travel with?
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  type="button"
                  onClick={() => setTravelCompanions("solo")}
                  className={`p-6 border rounded-lg text-center transition-colors ${
                    travelCompanions === "solo"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-center mb-3">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-lg">🧑</span>
                    </div>
                  </div>
                  <div className="text-base font-medium text-gray-900">Solo</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTravelCompanions("couple")}
                  className={`p-6 border rounded-lg text-center transition-colors ${
                    travelCompanions === "couple"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-center mb-3">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-lg">💑</span>
                    </div>
                  </div>
                  <div className="text-base font-medium text-gray-900">Couple</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTravelCompanions("family")}
                  className={`p-6 border rounded-lg text-center transition-colors ${
                    travelCompanions === "family"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-center mb-3">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-lg">👨‍👩‍👧‍👦</span>
                    </div>
                  </div>
                  <div className="text-base font-medium text-gray-900">Family</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTravelCompanions("friends")}
                  className={`p-6 border rounded-lg text-center transition-colors ${
                    travelCompanions === "friends"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-center mb-3">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-lg">👥</span>
                    </div>
                  </div>
                  <div className="text-base font-medium text-gray-900">Friends</div>
                </button>
              </div>
            </div>

            {/* Activities Section */}
            <div className="border-t border-gray-200 pt-8">
              <label className="block text-lg font-medium text-gray-800 mb-6">
                What activities interest you?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {activitiesList.map((activity) => (
                  <button
                    key={activity}
                    onClick={() => toggleActivity(activity)}
                    className={`px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                      selectedActivities.includes(activity)
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {activity}
                  </button>
                ))}
              </div>
            </div>

            {/* Food Preference */}
            <div className="border-t border-gray-200 pt-8">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Food Preference
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFoodPreference("vegetarian")}
                  className={`p-6 border rounded-lg text-center transition-colors ${
                    foodPreference === "vegetarian"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-center mb-3">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-lg">🥗</span>
                    </div>
                  </div>
                  <div className="text-base font-medium text-gray-900">Vegetarian</div>
                </button>

                <button
                  type="button"
                  onClick={() => setFoodPreference("non-vegetarian")}
                  className={`p-6 border rounded-lg text-center transition-colors ${
                    foodPreference === "non-vegetarian"
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-center mb-3">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-lg">🍖</span>
                    </div>
                  </div>
                  <div className="text-base font-medium text-gray-900">Non-Vegetarian</div>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                onClick={handleSubmit}
                disabled={loading || !city.trim() || !travelDate || !selectedBudget || !travelCompanions || !foodPreference}
                className={`w-full py-3 px-6 rounded-lg font-medium text-base transition-colors ${
                  loading || !city.trim() || !travelDate || !selectedBudget || !travelCompanions || !foodPreference
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {loading ? "Generating itinerary..." : "Generate itinerary"}
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col justify-center items-center py-20 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-40"></div>
            <p className="text-blue-600 font-medium text-lg">Crafting your itinerary...</p>
          </div>
        )}


        {/* Itinerary Results */}
        {itineraryData.length > 0 && (
          <div className="w-full max-w-4xl space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your {days}-day itinerary for {city}
              </h2>
              <p className="text-gray-600">
                Here's your personalized travel plan for {travelCompanions} travelers
              </p>
            </div>

            {itineraryData.map((day) => (
                <motion.div
                  key={day.day}
                  className="bg-white border border-gray-200 rounded-lg p-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: day.day * 0.1 }}
                >
              <div key={day.day} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-3">
                    {day.day}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Day {day.day}
                  </h3>
                </div>

                <div className="space-y-3">
                  {day.content
                    .split("\n")
                    .filter((line) => line.trim() !== "")
                    .map((line, idx) => (
                      <div key={idx} className="flex items-start gap-3 py-2">
                        <span className="text-lg mt-0.5 flex-shrink-0">
                          {getIconForLine(line)}
                        </span>
                        <span className="text-gray-700 text-base leading-relaxed">
                          {line.trim().replace(/^[-*•]/, "").trim()}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
              </motion.div>
            ))}

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 pt-6">
              <button
                onClick={() => window.print()}
                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Print
              </button>
              <button
                onClick={() =>
                  saveToSupabase(
                    city,
                    days,
                    selectedActivities,
                    selectedBudget,
                    itineraryData.map((d) => d.content).join("\n")
                  )
                }
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Save itinerary
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="h-[20vh]"></div>
    </div>

    </div>
  );
};

export default PlanTripPage;