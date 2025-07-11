import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CursorTrail from "../components/CursorTrail"; 




function LandingPage() {
  const mainContentRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const navigate = useNavigate();

  
  useEffect(() => {
    const handleScroll = () => {
      // Only trigger the curtain effect near the end of the page
      if (!mainContentRef.current) return;
      
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      
      // Calculate how far we are into the final portion of the page
      // We'll start the effect when we're in the last 20% of the scrollable content
      const scrollableDistance = documentHeight - windowHeight;
      const triggerPoint = scrollableDistance * 0.8; // Start at 80% of scroll
      
      if (scrollTop > triggerPoint) {
        // Calculate progress from 0 to 1 for the final 20% of scroll
        const curtainProgress = (scrollTop - triggerPoint) / (scrollableDistance - triggerPoint);
        setScrollProgress(Math.min(Math.max(curtainProgress, 0), 1));
      } else {
        setScrollProgress(0);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    // Run once to initialize
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Calculate transform value for the main content curtain effect
  const mainContentTransform = `translateY(${-100 * scrollProgress}vh)`;
  // Calculate opacity for the footer
  const footerOpacity = scrollProgress;
  
  return (
    <div className="relative w-screen overflow-x-hidden">
      <CursorTrail />
      {/* Fixed full-screen footer that sits behind everything */}
      <div 
        className="fixed inset-0 z-0 bg-[#FFFDDB] flex items-center justify-center"
        style={{ opacity: footerOpacity }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <Footer />
        </div>
      </div>
      
      {/* Main content that slides up like a curtain */}
      <div 
        ref={mainContentRef} 
        className="relative z-10 bg-white transition-transform duration-300 ease-out"
        style={{ transform: mainContentTransform }}
      >
        <Navbar />
        
        {/* Hero Section */}
        <section
          className="flex items-center justify-center text-center text-white h-[100vh] bg-cover bg-center w-full"
          style={{ backgroundImage: `url('/backtravel.jpg')` }}
        >
          <div className="p-10 rounded-xl">
            <h1 className="text-5xl mb-4">Crafting Your Perfect Journey,<br />one itinerary at a time.</h1>
            <button onClick={() => navigate('/trip-planner')} 
            className="px-6 py-3 bg-[#1E3A8A] hover:bg-[#1E40AF] text-white rounded-full text-lg font-semibold">
              Plan Your Trip
            </button>
          </div>
        </section>

        {/* Featured Destinations */}

<section className="py-16 px-8 bg-gray-50 w-full">
  <h2 className="text-3xl font-bold text-center mb-12 text-[#1E3A8A]">Featured Destinations</h2>
  <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
    {[
      { name: "Paris", image: "/paris.jpg", desc: "The city of lights and romance." },
      { name: "Tokyo", image: "/tokyo.jpg", desc: "Tech meets tradition in this bustling city." },
      { name: "Bali", image: "/bali.jpg", desc: "Tropical beaches and tranquil temples." },
    ].map((dest, idx) => (
      <div
        key={idx}
        className="relative group rounded-xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition duration-300"
      >
        <img
          src={dest.image}
          alt={dest.name}
          className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition duration-500 flex flex-col justify-end p-5">
          <h3 className="text-white text-xl font-bold">{dest.name}</h3>
          <p className="text-sm text-gray-200 mt-1 mb-4">{dest.desc}</p>
          <button
            onClick={() =>
              navigate(`/trip-planner?city=${encodeURIComponent(dest.name)}`)
            }
            className="self-start bg-white text-blue-600 text-sm font-semibold px-4 py-2 rounded-full hover:bg-gray-100 transition"
          >
            Explore
          </button>
        </div>
      </div>
    ))}
  </div>
</section>



        {/* Testimonials */}
        <section className="py-16 px-8 bg-white w-full">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#1E3A8A]">What Our Travelers Say</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-6 bg-gray-50 rounded-xl shadow-lg">
              <p className="text-gray-700 italic mb-4">"TripTailor made our honeymoon absolutely perfect! Every detail was carefully planned and we didn't have to worry about a thing."</p>
              <p className="text-[#1E3A8A] font-semibold">- Sarah & Michael</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl shadow-lg">
              <p className="text-gray-700 italic mb-4">"As a solo traveler, I felt safe and had an amazing experience thanks to the thoughtful itinerary created by TripTailor's team."</p>
              <p className="text-[#1E3A8A] font-semibold">- James L.</p>
            </div>
          </div>
        </section>
        
        {/* Our Services */}
        <section className="py-16 px-8 bg-gray-50 w-full">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#1E3A8A]">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="p-6 bg-white rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-3 text-[#1E3A8A]">Custom Itineraries</h3>
              <p className="text-gray-700">Tailor-made travel plans created just for you.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-3 text-[#1E3A8A]">Local Guides</h3>
              <p className="text-gray-700">Connect with experienced local guides at your destination.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-3 text-[#1E3A8A]">Exclusive Access</h3>
              <p className="text-gray-700">Skip the lines with our VIP access to popular attractions.</p>
            </div>
          </div>
        </section>
        
        {/* Spacer to ensure we have enough scroll room to fully reveal the footer */}
        
      </div>
    </div>
  );
}

export default LandingPage;