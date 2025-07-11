import {Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import DestinationsPage from './pages/DestinationsPage';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import PlanTripPage from './pages/PlanTripPage';
import MyTripsPage from './pages/MyTripsPage';
import TripDetailPage from './pages/TripDetailPage';
import PublicTripPage from './pages/PublicTripPage';

function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/trip-planner"
          element={
            <PrivateRoute>
              <PlanTripPage />
            </PrivateRoute>
          }
        />
        <Route path="/my-trips" element={<MyTripsPage />} />
        <Route path="/trip/:id" element={<TripDetailPage />} />
        <Route path="/trip/public/:id" element={<PublicTripPage />} />


      </Routes>
  );
}

export default App;
