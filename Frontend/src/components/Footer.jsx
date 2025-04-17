// components/Footer.jsx
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-bold mb-3">EventFinder</h4>
          <p className="text-sm text-gray-400">
            Discover and join amazing events happening around you.
          </p>
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
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 py-2 rounded-l-md text-gray-800 focus:outline-none bg-white"
            />
            <button className="bg-indigo-600 px-3 py-2 rounded-r-md">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
