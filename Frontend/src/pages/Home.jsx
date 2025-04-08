import React from "react";
import { Search, Calendar, Bell } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen font-sans bg-white text-gray-800">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-10 py-4 border-b shadow-sm">
        <h1 className="text-2xl font-bold text-indigo-600">EventFinder</h1>

        <div className="flex gap-6">
          <a href="#" className="hover:text-indigo-600">Explore</a>
          <a href="#" className="hover:text-indigo-600">Categories</a>
          <a href="#" className="hover:text-indigo-600">Create Event</a>
        </div>

        <div className="flex items-center gap-4">
          {/* If logged in */}
          <button className="text-gray-600 hover:text-indigo-600">
            <Bell />
          </button>
          <img
            src="https://placehold.co/32x32"
            alt="User"
            className="w-8 h-8 rounded-full"
          />
          {/* If NOT logged in, show buttons instead */}
          {/* <button className="text-indigo-600 font-semibold">Login</button>
          <button className="bg-indigo-600 text-white px-3 py-1 rounded-md">Sign Up</button> */}
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="text-center py-14 bg-gray-50 px-4">
        <h2 className="text-4xl font-bold mb-4">Discover Amazing Events Near You</h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Find and join exciting events happening in your area or plan your next adventure with our event discovery platform.
        </p>

        {/* Search Bar */}
        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center items-center bg-white p-4 rounded-xl shadow max-w-4xl mx-auto">
          <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md w-full md:w-1/3">
            <Search className="text-gray-400 mr-2" size={18} />
            <input type="text" placeholder="Location" className="bg-transparent w-full focus:outline-none" />
          </div>
          <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md w-full md:w-1/3">
            <Calendar className="text-gray-400 mr-2" size={18} />
            <input type="date" className="bg-transparent w-full focus:outline-none" />
          </div>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-md w-full md:w-auto">Search Events</button>
        </div>
      </header>

      {/* POPULAR EVENTS */}
      <section className="py-12 px-6 md:px-12">
        <h3 className="text-2xl font-bold mb-6">Popular Events</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {["Summer Festival", "Tech Expo", "Food Carnival"].map((event, index) => (
            <div key={index} className="bg-white rounded-xl shadow hover:shadow-lg transition">
              <img
                src={`https://placehold.co/600x300?text=${encodeURIComponent(event)}`}
                className="rounded-t-xl w-full h-52 object-cover"
                alt={event}
              />
              <div className="p-4">
                <span className="text-sm bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full inline-block mb-2">
                  {event.includes("Tech") ? "Tech" : event.includes("Food") ? "Food" : "Music"}
                </span>
                <h4 className="font-semibold text-lg">{event}</h4>
                <p className="text-sm text-gray-500 mt-1">📅 May 2025</p>
                <p className="text-sm text-gray-500">📍 Central Park, NY</p>
                <button className="mt-3 text-indigo-600 font-semibold">View Event</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-12 px-6 md:px-12 bg-gray-50">
        <h3 className="text-2xl font-bold mb-6">Browse by Category</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          {["Music", "Tech", "Food", "Sports", "Art", "Education"].map((cat) => (
            <div key={cat} className="bg-white rounded-lg shadow hover:bg-indigo-50 p-6 cursor-pointer">
              <span className="text-indigo-600 font-semibold">{cat}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12 px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold mb-3">EventFinder</h4>
            <p className="text-sm text-gray-400">
              Discover and join amazing events happening around you.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">FAQs</a></li>
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
              <input
                type="email"
                placeholder="Enter your email"
                className="px-3 py-2 rounded-l-md text-gray-800 focus:outline-none"
              />
              <button className="bg-indigo-600 px-4 py-2 rounded-r-md">Subscribe</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
