import React from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const isLoggedIn = !!localStorage.getItem('token'); // ✅ Check login status

  return (
    <nav className="flex items-center justify-between py-4 px-10 border-b">
      <div className="flex items-center gap-12">
        <h1 className="text-2xl font-bold text-indigo-600">EventFinder</h1>
        <div className="flex gap-6 text-[16px] font-medium text-gray-600">
          <Link to="/explore" className="hover:text-indigo-600">Explore</Link>
          <Link to="/categories" className="hover:text-indigo-600">Categories</Link>
          <Link to="/create-event" className="hover:text-indigo-600">Create Event</Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <button className="text-gray-500 hover:text-indigo-600">
              <Bell />
            </button>
            <img
              className="w-9 h-9 rounded-full object-cover"
              src="https://placehold.co/40x40"
              alt="Avatar"
            />
          </>
        ) : (
          <>
            <Link to="/signup" className="text-gray-600 hover:text-indigo-600">Sign Up</Link>
            <Link to="/login" className="bg-indigo-600 text-white px-4 py-1.5 rounded-md hover:bg-indigo-700">
              Log In
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
