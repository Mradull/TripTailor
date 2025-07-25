import { useState } from "react";
import { MapPin, Mail, Lock, Globe, Calendar, DollarSign, Star, Loader2 ,Eye, EyeOff } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";


const LoginPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Add this to state
  const navigate = useNavigate();



const handleAuth = async (e) => {
  e.preventDefault();

  if (isRegistering) {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert("Error: " + error.message);
    else alert("Check your email to confirm sign up.");
  } else {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert("Login error: " + error.message);
    } else {
      alert("Login successful!");
      navigate("/"); // or "/trip-planner"
    }
  }
};


  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert("Google login successful!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-yellow-50 to-pink-100">
      {/* Navbar */}
      <Navbar/>

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-10 py-10 w-full mt-16">
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            
            {/* Hero Section */}
            <div className="text-center lg:text-left space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  {isRegistering ? "Start Your Journey" : "Welcome Back"}
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  {isRegistering 
                    ? "Create your account to access our AI-powered travel planning platform and discover your next adventure" 
                    : "Sign in to continue planning your perfect trip with personalized recommendations and seamless booking"
                  }
                </p>
              </div>
              
              {/* Features Preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="group bg-white/70 rounded-2xl p-6 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-gray-200">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Smart Planning</h3>
                  <p className="text-sm text-gray-600">AI-powered itinerary generation tailored to your preferences and budget</p>
                </div>
                <div className="group bg-white/70 rounded-2xl p-6 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-gray-200">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Budget Optimization</h3>
                  <p className="text-sm text-gray-600">Smart recommendations to maximize your travel experience within budget</p>
                </div>
                <div className="group bg-white/70 rounded-2xl p-6 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-gray-200">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                    <Star className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Curated Experiences</h3>
                  <p className="text-sm text-gray-600">Discover hidden gems and popular destinations with insider recommendations</p>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="w-full max-w-md mx-auto lg:mx-0">
              {/* Form Card */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    {isRegistering ? (
                      <Calendar className="h-8 w-8 text-white" />
                    ) : (
                      <Globe className="h-8 w-8 text-white" />
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {isRegistering ? "Create Account" : "Sign In"}
                  </h2>
                  <p className="text-gray-600">
                    {isRegistering 
                      ? "Join thousands of travelers worldwide" 
                      : "Continue your travel planning journey"
                    }
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Email Input */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      placeholder="Email address"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-100 text-gray-900 placeholder-gray-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* Password Input with toggle */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-100 text-gray-900 placeholder-gray-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>


                  {/* Submit Button */}
                  <button
                    onClick={handleAuth}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                        {isRegistering ? "Creating Account..." : "Signing In..."}
                      </div>
                    ) : (
                      <span>
                        {isRegistering ? "Create Account" : "Sign In"}
                      </span>
                    )}
                  </button>
                </div>

                {/* Divider */}
                <div className="my-6 flex items-center">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="px-4 text-gray-500 text-sm font-medium">or</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                {/* Google Login Button */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full border-2 border-gray-300 py-3 rounded-xl font-semibold text-white-700 hover:bg-gray-50 hover:border-gray-400 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </div>
                </button>

                {/* Toggle Auth Mode */}
                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    {isRegistering ? "Already have an account?" : "New to TravelPlan?"}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="mt-2 text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-all duration-300"
                  >
                    {isRegistering ? "Sign in here" : "Create account here"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default LoginPage;