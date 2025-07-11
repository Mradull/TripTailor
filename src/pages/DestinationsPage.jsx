import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CursorTrail from "../components/CursorTrail";
import { motion } from "framer-motion";

// Sample destinations
const destinations = [
  {
    name: "Paris",
    image: "/paris.jpg",
    desc: "The city of lights and romance.",
    tags: ["city", "culture"]
  },
  {
    name: "Bali",
    image: "/bali.jpg",
    desc: "Tropical paradise with beaches and temples.",
    tags: ["beach", "nature"]
  },
  {
    name: "Tokyo",
    image: "/tokyo.jpg",
    desc: "Tech and tradition collide.",
    tags: ["city", "culture"]
  },
  {
    name: "Swiss Alps",
    image: "/swissalps.jpg",
    desc: "Snow, hiking, and scenic mountains.",
    tags: ["nature", "adventure"]
  },
  {
    name: "Goa",
    image: "/goa.jpg",
    desc: "Indian beaches and parties.",
    tags: ["beach", "party"]
  },
  {
    name: "Banff",
    image: "/banff.jpg",
    desc: "Lakes, trails, and alpine air.",
    tags: ["nature", "adventure"]
  },
];

const filters = ["all", "beach", "city", "nature", "adventure", "culture"];

const DestinationsPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [scrollProgress, setScrollProgress] = useState(0);
  const mainContentRef = useRef(null);
  const navigate = useNavigate();

  const filteredDestinations =
    activeFilter === "all"
      ? destinations
      : destinations.filter((d) => d.tags.includes(activeFilter));

  // Curtain footer effect
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

  return (
    <div className="relative w-screen overflow-x-hidden bg-gray-50">
      <CursorTrail />

      {/* CURTAIN FOOTER */}
      <div
        className="fixed inset-0 z-0 bg-[#FFFDDB] flex items-center justify-center"
        style={{ opacity: footerOpacity }}
      >
        <Footer />
      </div>

      {/* MAIN CONTENT */}
      <div
        ref={mainContentRef}
        className="relative z-10 transition-transform duration-300 ease-out"
        style={{ transform: mainContentTransform }}
      >
        <Navbar />

        <div className="pt-24 pb-10 px-6 md:px-12 max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-blue-700 text-center mb-4">Explore Destinations</h1>
          <p className="text-center text-gray-600 mb-10">
            Choose a vibe or browse all destinations.
          </p>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {filters.map((filter) => (
              <button
                key={filter}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                  activeFilter === filter
                    ? "bg-blue-600 text-white border-blue-600"
                    : "text-gray-700 bg-white border-gray-300 hover:bg-gray-100"
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          {/* Destination Cards with Animation */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((dest, idx) => (
              <motion.div
  key={idx}
  whileHover={{ scale: 1.02 }}
  className="relative group bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl"
>
  <img
    src={dest.image}
    alt={dest.name}
    className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
  />

  {/* Overlay Reveal */}
  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5">
    <h2 className="text-white text-2xl font-bold">{dest.name}</h2>
    <p className="text-gray-200 text-sm mt-1">{dest.desc}</p>
    <div className="flex flex-wrap gap-2 mt-2">
      {dest.tags.map((tag) => (
        <span
          key={tag}
          className="bg-white bg-opacity-20 px-3 py-1 text-xs rounded-full text-gray-100 border border-white/30"
        >
          {tag}
        </span>
      ))}
    </div>
    <button
      onClick={() =>
        navigate(`/trip-planner?city=${encodeURIComponent(dest.name)}`)
      }
      className="mt-4 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition w-full"
    >
      Explore
    </button>
  </div>
</motion.div>
            ))}
          </div>
        </div>

        <div className="h-[20vh]" />
      </div>
    </div>
  );
};

export default DestinationsPage;
