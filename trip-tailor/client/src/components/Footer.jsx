function Footer() {
  return (
    <div className="relative w-full h-screen bg-[#Fefce8] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-yellow-50 to-pink-100 opacity-90 z-0"></div>

      <div className="relative z-10 w-full h-full flex flex-col justify-center items-center text-center px-4">
        <h2 className="text-5xl font-bold text-black mb-6">Thanks for Visiting TripTailor</h2>
        <p className="text-xl text-black mb-8">Plan your next adventure with us!</p>

        <div className="grid md:grid-cols-3 gap-8 mt-12 text-black max-w-6xl w-full">
          <div>
            <h3 className="text-2xl font-semibold mb-4">Contact Us</h3>
            <p className="text-lg">mradul.kapoor2004@gmail.com</p>
            <p className="text-lg">+91 8081000546</p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-4">Follow Us</h3>
            <div className="flex flex-col gap-2 text-lg">
              <a href="https://instagram.com/mradulkapoooor" target="_blank" rel="noopener noreferrer" className="hover:underline">
                Instagram
              </a>
              <a href="https://linkedin.com/in/mradul-kapoor-75142b247/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                LinkedIn
              </a>
              <a href="https://github.com/mradull" target="_blank" rel="noopener noreferrer" className="hover:underline">
                GitHub
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-4">Newsletter</h3>
            <p className="text-lg">Subscribe for travel tips & deals</p>
            {/* Optional: Add email input and subscribe button here */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
