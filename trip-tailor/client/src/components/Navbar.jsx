import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { User2 } from 'lucide-react';
import logo from '../assets/triptailor.png';

function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <motion.div
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <AppBar
        position="fixed"
        color="transparent"
        elevation={4}
        sx={{ backgroundColor: 'white' }}
      >
        <Toolbar className="flex justify-between items-center w-full px-8 py-2">
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <img
              src={logo}
              alt="TripTailor"
              className="h-10 w-auto object-contain"
              style={{ maxHeight: '40px' }}
            />
          </Link>

          {/* Menu Links */}
          <div className="flex space-x-6 items-center">
            <Link to="/destinations" style={{ textDecoration: 'none' }}>
              <Button
                sx={{
                  color: isActive("/destinations") ? '#1E40AF' : '#4B5563',
                  fontWeight: isActive("/destinations") ? 700 : 500,
                  borderBottom: isActive("/destinations") ? '2px solid #1E40AF' : 'none',
                  borderRadius: 0,
                }}
              >
                Destinations
              </Button>
            </Link>
            <Link to="/trip-planner" style={{ textDecoration: 'none' }}>
              <Button
                sx={{
                  color: isActive("/trip-planner") ? '#1E40AF' : '#4B5563',
                  fontWeight: isActive("/trip-planner") ? 700 : 500,
                  borderBottom: isActive("/trip-planner") ? '2px solid #1E40AF' : 'none',
                  borderRadius: 0,
                }}
              >
                Trip Planner
              </Button>
            </Link>
            <Link to="/about" style={{ textDecoration: 'none' }}>
              <Button
                sx={{
                  color: isActive("/about") ? '#1E40AF' : '#4B5563',
                  fontWeight: isActive("/about") ? 700 : 500,
                  borderBottom: isActive("/about") ? '2px solid #1E40AF' : 'none',
                  borderRadius: 0,
                }}
              >
                About
              </Button>
            </Link>

            {!user ? (
              <Link to="/login">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all">
                  Login
                </button>
              </Link>
            ) : (
              <>
                <Link to="/my-trips" style={{ textDecoration: 'none' }}>
                  <Button
                    sx={{
                      color: isActive("/my-trips") ? '#1E40AF' : '#4B5563',
                      fontWeight: isActive("/my-trips") ? 700 : 500,
                      borderBottom: isActive("/my-trips") ? '2px solid #1E40AF' : 'none',
                      borderRadius: 0,
                    }}
                  >
                    My Trips
                  </Button>
                </Link>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <User2 className="h-4 w-4 text-gray-500" />
                  <span>{user.email}</span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: '#9CA3AF',
                    color: '#374151',
                    '&:hover': {
                      backgroundColor: '#F3F4F6',
                      borderColor: '#6B7280',
                    },
                  }}
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </motion.div>
  );
}

export default Navbar;
