import React from 'react';
import { Bell } from 'lucide-react';

export default function Navbar({ isLoggedIn }) {
  return (
    <nav className="flex items-center justify-between py-4 px-10 border-b">
      <div className="flex items-center gap-12">
        <h1 className="text-2xl font-bold text-indigo-600">EventFinder</h1>
        <div className="flex gap-6 text-[16px] font-medium text-gray-600">
          <a href="#" className="hover:text-indigo-600">Explore</a>
          <a href="#" className="hover:text-indigo-600">Categories</a>
          <a href="#" className="hover:text-indigo-600">Create Event</a>
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
            <a href="#" className="text-gray-600 hover:text-indigo-600">Sign Up</a>
            <a href="#" className="bg-indigo-600 text-white px-4 py-1.5 rounded-md hover:bg-indigo-700">
              Log In
            </a>
          </>
        )}
      </div>
    </nav>
  );
}
