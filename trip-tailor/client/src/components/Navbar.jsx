import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';

function Navbar() {
  return (
    <AppBar position="sticky" color="transparent" elevation={4} sx={{ backgroundColor: 'white' }}>
      <Toolbar>
        <Container maxWidth="lg" className="flex justify-between items-center">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Typography variant="h4" color="#1E3A8A" fontWeight="bold">
              TripTailor
            </Typography>
          </Link>
          <div className="flex space-x-8">
            <Link to="/destinations" style={{ textDecoration: 'none' }}>
                <Button sx={{ color: '#4B5563', '&:hover': { color: '#1E40AF' } }}>
                    Destinations
                </Button>
            </Link>
            <Link to="/trip-planner" style={{ textDecoration: 'none' }}>
            <Button sx={{ color: '#4B5563', '&:hover': { color: '#1E40AF' } }}>
                Trip Planner
              </Button>
            </Link>
            <Link to="/about" style={{ textDecoration: 'none' }}>
            <Button sx={{ color: '#4B5563', '&:hover': { color: '#1E40AF' } }}>
                About
              </Button>
            </Link>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button variant="contained" color="primary" sx={{ borderRadius: '20px' }}>
                Login
              </Button>
            </Link>
          </div>
        </Container>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
