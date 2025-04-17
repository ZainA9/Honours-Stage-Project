import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import Footer from '../components/Footer';
import MapView from '../components/MapView';

export default function Explore() {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    date: '',
  });
  const [userCoords, setUserCoords] = useState(null);

  // Fetch user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true }
    );
  }, []);

  // Fetch filtered events
  const fetchEvents = async () => {
    try {
      const query = new URLSearchParams();
      if (filters.category) query.append('category', filters.category);
      if (filters.location) query.append('location', filters.location);
      if (filters.date) query.append('date', filters.date);

      const response = await axios.get(`http://localhost:5154/api/events/search?${query.toString()}`);
      setEvents(response.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Dummy coordinates for each event (📍 replace with real lat/lng if stored)
  const eventCoords = userCoords
  ? events.map((e, i) => ({
      lat: userCoords.lat + 0.01 * i,
      lng: userCoords.lng + 0.01 * i,
    }))
  : [];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      <div className="px-10 py-8">
        <h2 className="text-3xl font-bold mb-6">Explore Events</h2>

        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="bg-white rounded-lg shadow p-4 space-y-4 h-fit lg:sticky lg:top-28 self-start">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleChange}
                className="w-full mt-1 border rounded px-3 py-2"
              >
                <option value="">All Categories</option>
                <option value="Technology">Technology</option>
                <option value="Music">Music</option>
                <option value="Food">Food</option>
                <option value="Arts">Arts</option>
                <option value="Sports">Sports</option>
                <option value="Education">Education</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleChange}
                placeholder="e.g. London"
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleChange}
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>

            <button
              onClick={() => setFilters({ category: '', location: '', date: '' })}
              className="text-sm text-indigo-600 hover:underline mt-2"
            >
              Clear Filters
            </button>
          </aside>

          {/* Main Content */}
          <div className="flex flex-col gap-12">
            {/* Map Section */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-xl font-semibold mb-4">Map View</h3>
              <MapView userCoords={userCoords} eventCoords={eventCoords} />
            </div>

            {/* Events Grid */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Events</h3>
              {events.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center mt-10">No events found.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
