// src/pages/MyTripsPage.jsx
import { useEffect, useState ,useRef } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { v4 as uuidv4 } from "uuid";
import CursorTrail from "../components/CursorTrail"; 


const MyTripsPage = () => {
  const mainContentRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const { user } = useAuth();
  const navigate = useNavigate();




  useEffect(() => {
    if (user) fetchTrips();
  }, [user]);

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

  const fetchTrips = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("itineraries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching trips:", error);
    } else {
      setTrips(data);
    }
    setLoading(false);
  };

  const deleteTrip = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trip? This action cannot be undone.")) return;
    
    const { error } = await supabase.from("itineraries").delete().eq("id", id);
    if (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete trip. Please try again.");
    } else {
      setTrips((prev) => prev.filter((trip) => trip.id !== id));
    }
  };

const togglePublic = async (tripId, makePublic) => {
  const public_id = makePublic ? uuidv4() : null;

  console.log("👉 Toggling:", {
    tripId,
    is_public: makePublic,
    public_id,
  });


  const { data, error } = await supabase
    .from("itineraries")
    .update({ is_public: makePublic, public_id })
    .eq("id", tripId);

  if (error) {
    console.error("Error updating visibility:", error);
    alert("Failed to update trip visibility.");
  } else {
    console.log("✅ Supabase update success:", data);
    setTrips((prev) =>
      prev.map((t) =>
        t.id === tripId ? { ...t, is_public: makePublic, public_id } : t
      )
    );
  }
};

const copyShareLink = (trip) => {
  const link = `${window.location.origin}/trip/public/${trip.public_id}`;
  navigator.clipboard.writeText(link)
    .then(() => alert("Share link copied to clipboard!"))
    .catch(() => alert("Failed to copy link. Please try again."));
};


  // Filter and sort trips
  const filteredTrips = trips
    .filter(trip => 
      trip.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.itinerary?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === "oldest") return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === "city") return a.city.localeCompare(b.city);
      if (sortBy === "duration") return b.days - a.days;
      return 0;
    });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getBudgetColor = (budget) => {
    switch (budget) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getBudgetLabel = (budget) => {
    switch (budget) {
      case "low": return "Budget";
      case "medium": return "Mid-range";
      case "high": return "Luxury";
      default: return budget;
    }
  };
  const mainContentTransform = `translateY(${-100 * scrollProgress}vh)`;
  const footerOpacity = scrollProgress;


  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center ">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-40"></div>
            <p className="text-blue-600 font-medium text-lg">Loading your trips...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative w-screen overflow-x-hidden bg-gray-50">
        <CursorTrail />

        {/* CURTAIN FOOTER behind everything */}
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
            My Travel Adventures
          </h1>
          <p className="text-lg text-gray-600">
            Explore your personalized itineraries and relive your amazing journeys
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 w-full max-w-6xl mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full md:max-w-md">
              <div className="relative">
                <svg 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search trips by destination..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-4 items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="city">City A-Z</option>
                <option value="duration">Duration</option>
              </select>
              
              <button
                onClick={() => navigate("/trip-planner")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Plan New Trip
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full max-w-6xl">
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-2">{trips.length}</div>
            <div className="text-gray-600">Total Trips</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {trips.reduce((sum, trip) => sum + trip.days, 0)}
            </div>
            <div className="text-gray-600">Days Planned</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {trips.filter(trip => trip.is_public).length}
            </div>
            <div className="text-gray-600">Public Trips</div>
          </div>
        </div>

        {/* Trips Grid */}
        {filteredTrips.length === 0 ? (
          <div className="text-center py-20 w-full max-w-6xl">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchTerm ? "No trips found" : "No trips yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? "Try adjusting your search criteria" 
                : "Start planning your first adventure!"
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => navigate("/plan-trip")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Plan Your First Trip
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
            {filteredTrips.map((trip, index) => (
              <motion.div
                key={trip.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                {/* Trip Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{trip.city}</h3>
                      <p className="text-sm text-gray-500">
                        Created on {formatDate(trip.created_at)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBudgetColor(trip.budget)}`}>
                        {getBudgetLabel(trip.budget)}
                      </span>
                      {trip.is_public && (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          Public
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {trip.days} {trip.days === 1 ? 'day' : 'days'}
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {trip.activities?.length || 0} activities
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {trip.itinerary?.slice(0, 120)}...
                  </p>
                </div>

                {/* Trip Actions */}
                <div className="p-6 bg-gray-50">
                  <div className="flex flex-col gap-3">
                    {/* Primary Actions */}
                    <div className="flex gap-2">
                      <Link
                        to={`/trip/${trip.id}`}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => navigate(`/plan-trip?regenerate=${trip.id}`)}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        Regenerate
                      </button>
                    </div>

                    {/* Secondary Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-3">
                        {trip.is_public && (
                          <button
                            onClick={() => copyShareLink(trip)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                            </svg>
                            Share
                          </button>
                        )}
                        <button
                          onClick={() => deleteTrip(trip.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>

                      {/* Privacy Toggle */}
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={trip.is_public}
                          onChange={() => togglePublic(trip.id, !trip.is_public)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">
                          {trip.is_public ? "Public" : "Private"}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        </div>
      <div className="h-[20vh]"></div>  
    </div>
    </div>
  );
};

export default MyTripsPage;