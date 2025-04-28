import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section
        className="flex items-center justify-center text-center text-white h-[90vh] bg-cover bg-center"
        style={{ backgroundImage: `url('/backtravel.jpg')` }}
      >
        <div className="bg-black bg-opacity-0 p-10 rounded-xl">
          <h1 className="text-5xl mb-4">Crafting Your Perfect Journey,<br/>one itinerary at a time.</h1>
          <button className="px-6 py-3 bg-[#1E3A8A] hover:bg-[#1E40AF] rounded-full text-white text-lg font-semibold">
            Plan Your Trip
          </button>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16 px-8 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#1E3A8A]">Featured Destinations</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <img src="/paris.jpg" alt="Paris" className="rounded-xl shadow-lg hover:scale-105 transition" />
          <img src="/tokyo.jpg" alt="Tokyo" className="rounded-xl shadow-lg hover:scale-105 transition" />
          <img src="/bali.jpg" alt="Bali" className="rounded-xl shadow-lg hover:scale-105 transition" />
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default LandingPage;
