import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CursorTrail from "../components/CursorTrail";

const AboutPage = () => {
  const mainContentRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

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

      <Navbar />

      {/* MAIN CONTENT */}
      <div
        ref={mainContentRef}
        className="relative z-10 transition-transform duration-300 ease-out"
        style={{ transform: mainContentTransform }}
      >
        <section className="py-24 px-4 md:px-12 max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-blue-600 mb-6 text-center">About TripTailor</h1>
          <p className="text-lg text-gray-700 text-center max-w-2xl mx-auto mb-12">
            TripTailor is your intelligent travel assistant that crafts personalized itineraries based on your interests, travel style, and budget. Whether you’re traveling solo, as a couple, or with family – we help make your trip effortless and unforgettable.
          </p>

          {/* Sections */}
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">How It Works</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Enter your destination, travel dates, budget, and interests</li>
                <li>Our AI analyzes your input and generates a custom itinerary</li>
                <li>Save, view, edit, or regenerate plans from your dashboard</li>
                <li>Explore recommended places, food, and experiences</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tech Stack</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li><strong>Frontend:</strong> React.js + Tailwind CSS</li>
                <li><strong>Backend/Auth:</strong> Supabase</li>
                <li><strong>AI:</strong> OpenAI / Gemini API for itinerary generation</li>
                <li><strong>Other:</strong> Framer Motion, Lucide Icons, Lottie, etc.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">About the Developer</h2>
              <p className="text-gray-600">
                Hi! 👋 I’m Mradul Kapoor, a passionate full-stack developer with a love for merging beautiful UI with intelligent backend logic. This project was built to simplify how travelers plan their adventures using the power of AI.
              </p>
              <p className="text-gray-600 mt-2">
                Feel free to connect or collaborate! I’m open to new ideas, feedback, or just a chat about travel and tech.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Vision</h2>
              <p className="text-gray-600">
                The future of travel planning is smart, automated, and personalized. TripTailor aims to reduce planning stress and maximize discovery — so you can focus on creating memories, not spreadsheets.
              </p>
            </div>
          </div>
        </section>

        <div className="h-[20vh]" />
      </div>
    </div>
  );
};

export default AboutPage;
