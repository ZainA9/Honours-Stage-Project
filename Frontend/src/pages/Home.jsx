// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';    // ← import useNavigate
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import Footer from '../components/Footer';
import {
  Calendar,
  Search,
  Laptop,
  Music2,
  Utensils,
  Paintbrush2,
  Dumbbell,
  GraduationCap,
} from 'lucide-react';
import axios from 'axios';

export default function Home() {
  const navigate = useNavigate();                         // ← init navigate
  const isLoggedIn = !!localStorage.getItem('token');
  const [events, setEvents] = useState([]);

  // New state for the hero search inputs
  const [searchLocation, setSearchLocation] = useState('');
  const [searchDate, setSearchDate] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5154/api/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  // Handler for the “Search Events” button
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchLocation) params.set('location', searchLocation);
    if (searchDate)     params.set('date', searchDate);
    navigate(`/explore?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <header className="text-center py-14 bg-gray-50">
        <h2 className="text-4xl font-bold mb-4">
          Discover Amazing Events Near You
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Find and join exciting events happening in your area or plan your next
          adventure with our event discovery platform.
        </p>

        <div className="flex flex-wrap justify-center items-center mt-8 bg-white rounded-lg shadow p-4 max-w-4xl mx-auto gap-3">
          {/* Location input */}
          <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md w-60">
            <Search className="text-gray-400 mr-2" size={18} />
            <input
              type="text"
              placeholder="Location"
              value={searchLocation}                   // ← controlled
              onChange={e => setSearchLocation(e.target.value)}
              className="bg-transparent focus:outline-none w-full"
            />
          </div>

          {/* Date picker */}
          <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md w-60">
            <Calendar className="text-gray-400 mr-2" size={18} />
            <input
              type="date"
              value={searchDate}                       // ← controlled
              onChange={e => setSearchDate(e.target.value)}
              className="bg-transparent focus:outline-none w-full"
            />
          </div>

          {/* Search button */}
          <button
            onClick={handleSearch}                     // ← navigate on click
            className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700"
          >
            Search Events
          </button>
        </div>
      </header>

      {/* Popular Events (Dynamic) */}
      <section className="py-12 px-8">
        <h3 className="text-2xl font-bold mb-6">Popular Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.length > 0 ? (
            events.map((event, index) => (
              <EventCard key={index} event={event} />
            ))
          ) : (
            <p className="text-gray-500">No events found.</p>
          )}
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-12 px-8 bg-gray-50">
        <h3 className="text-2xl font-bold mb-6">Browse by Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
          {[
            { name: 'Technology', icon: <Laptop size={28} className="mx-auto mb-1 text-indigo-600" /> },
            { name: 'Music',      icon: <Music2 size={28} className="mx-auto mb-1 text-indigo-600" /> },
            { name: 'Food',       icon: <Utensils size={28} className="mx-auto mb-1 text-indigo-600" /> },
            { name: 'Arts',       icon: <Paintbrush2 size={28} className="mx-auto mb-1 text-indigo-600" /> },
            { name: 'Sports',     icon: <Dumbbell size={28} className="mx-auto mb-1 text-indigo-600" /> },
            { name: 'Education',  icon: <GraduationCap size={28} className="mx-auto mb-1 text-indigo-600" /> },
          ].map(cat => (
            <Link
              key={cat.name}
              to={`/explore?category=${encodeURIComponent(cat.name)}`}
              className="bg-white rounded-lg shadow p-6 hover:bg-indigo-50 cursor-pointer"
            >
              {cat.icon}
              <span className="text-indigo-600 font-semibold">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
