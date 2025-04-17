import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Explore() {
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (location) params.location = location;
      if (date) params.date = date;
      if (category) params.category = category;

      const response = await axios.get('http://localhost:5154/api/events/search', { params });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(); // On mount
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      <div className="flex flex-col lg:flex-row px-10 pt-8 gap-6">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-1/4 bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Filter Events</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Location */}
            <div>
              <label className="block text-sm font-medium">Location</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded"
                placeholder="e.g. Manchester"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium">Date</label>
              <input
                type="date"
                className="w-full border px-3 py-2 rounded"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium">Category</label>
              <select
                className="w-full border px-3 py-2 rounded"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
            >
              Search
            </button>
          </form>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Map Placeholder */}
          <div className="mb-8 bg-white p-4 rounded shadow h-[300px] flex items-center justify-center text-gray-500">
            🗺️ Google Maps integration coming soon...
          </div>

          {/* Event Results */}
          <h2 className="text-2xl font-bold mb-4">Events</h2>

          {loading ? (
            <p>Loading...</p>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No events found for the selected filters.</p>
          )}
        </main>
      </div>
          <Footer />
    </div>
  );
}
