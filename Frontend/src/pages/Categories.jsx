// src/pages/Categories.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Laptop,
  Music2,
  Utensils,
  Paintbrush2,
  Dumbbell,
  GraduationCap,
} from 'lucide-react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const categoryData = [
  { name: 'Technology', icon: <Laptop size={40} className="text-indigo-600" /> },
  { name: 'Music',      icon: <Music2 size={40} className="text-indigo-600" /> },
  { name: 'Food',       icon: <Utensils size={40} className="text-indigo-600" /> },
  { name: 'Arts',       icon: <Paintbrush2 size={40} className="text-indigo-600" /> },
  { name: 'Sports',     icon: <Dumbbell size={40} className="text-indigo-600" /> },
  { name: 'Education',  icon: <GraduationCap size={40} className="text-indigo-600" /> },
];

export default function Categories() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Browse Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {categoryData.map(cat => (
            <Link
              key={cat.name}
              to={`/explore?category=${encodeURIComponent(cat.name)}`}
              className="bg-white rounded-lg shadow p-6 flex flex-col items-center hover:shadow-lg transition"
            >
              {cat.icon}
              <span className="mt-2 text-lg font-medium text-gray-700">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
