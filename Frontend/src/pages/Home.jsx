import React from 'react';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import {
  Calendar,
  Search,
  Laptop,
  Music2,
  Utensils,
  Paintbrush2,
  Dumbbell,
  GraduationCap
} from 'lucide-react';

export default function Home() {
  const isLoggedIn = false;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* 🔹 Navbar */}
      <Navbar isLoggedIn={isLoggedIn} />

      {/* 🔹 Hero Section */}
      <header className="text-center py-14 bg-gray-50">
        <h2 className="text-4xl font-bold mb-4">Discover Amazing Events Near You</h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Find and join exciting events happening in your area or plan your next adventure with our event discovery platform.
        </p>

        <div className="flex flex-wrap justify-center items-center mt-8 bg-white rounded-lg shadow p-4 max-w-4xl mx-auto gap-3">
          <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md w-60">
            <Search className="text-gray-400 mr-2" size={18} />
            <input type="text" placeholder="Location" className="bg-transparent focus:outline-none w-full" />
          </div>
          <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md w-60">
            <Calendar className="text-gray-400 mr-2" size={18} />
            <input type="date" className="bg-transparent focus:outline-none w-full" />
          </div>
          <button className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700">Search Events</button>
        </div>
      </header>

      {/* 🔹 Popular Events */}
      <section className="py-12 px-8">
        <h3 className="text-2xl font-bold mb-6">Popular Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Summer Music Festival',
              category: 'Music',
              date: 'Mar 15, 2025',
              location: 'Central Park, NY'
            },
            {
              title: 'Tech Innovation Summit',
              category: 'Tech',
              date: 'Apr 5, 2025',
              location: 'Convention Center, SF'
            },
            {
              title: 'International Food Fest',
              category: 'Food',
              date: 'May 20, 2025',
              location: 'Pier 39, San Francisco'
            }
          ].map((event, index) => (
            <EventCard
              key={index}
              title={event.title}
              category={event.category}
              date={event.date}
              location={event.location}
            />
          ))}
        </div>
      </section>

      {/* 🔹 Browse by Category */}
      <section className="py-12 px-8 bg-gray-50">
        <h3 className="text-2xl font-bold mb-6">Browse by Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
          {[
            { name: 'Technology', icon: <Laptop size={28} className="mx-auto mb-1 text-indigo-600" /> },
            { name: 'Music', icon: <Music2 size={28} className="mx-auto mb-1 text-indigo-600" /> },
            { name: 'Food', icon: <Utensils size={28} className="mx-auto mb-1 text-indigo-600" /> },
            { name: 'Arts', icon: <Paintbrush2 size={28} className="mx-auto mb-1 text-indigo-600" /> },
            { name: 'Sports', icon: <Dumbbell size={28} className="mx-auto mb-1 text-indigo-600" /> },
            { name: 'Education', icon: <GraduationCap size={28} className="mx-auto mb-1 text-indigo-600" /> }
          ].map((cat, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 hover:bg-indigo-50 cursor-pointer">
              {cat.icon}
              <span className="text-indigo-600 font-semibold">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 🔹 Footer */}
      <footer className="bg-gray-900 text-white py-12 px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold mb-3">EventFinder</h4>
            <p className="text-sm text-gray-400">Discover and join amazing events happening around you.</p>
          </div>
          <div>
            <h4 className="font-bold mb-3">Quick Links</h4>
            <ul className="text-sm space-y-2 text-gray-400">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">Follow Us</h4>
            <div className="flex gap-4 text-gray-400">
              <a href="#">Twitter</a>
              <a href="#">Instagram</a>
              <a href="#">Facebook</a>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-3">Newsletter</h4>
            <div className="flex">
              <input type="email" placeholder="Enter your email" className="px-3 py-2 rounded-l-md text-gray-800 focus:outline-none bg-white" />
              <button className="bg-indigo-600 px-3 py-2 rounded-r-md">Subscribe</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
