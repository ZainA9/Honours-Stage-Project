// src/components/EventCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const DEFAULT_IMAGE   = '/images/event-fallback.jpg';
const CATEGORY_IMAGES = {
  Technology: '/images/technology.jpg',
  Music:      '/images/music.jpg',
  Food:       '/images/food.jpg',
  Arts:       '/images/arts.jpg',
  Sports:     '/images/sports.jpg',
  Education:  '/images/education.jpg',
};

export default function EventCard({ event }) {
  const { id, name, location, date, categories, imageUrl } = event;
  const category = categories?.[0] || 'General';

  // Pick the image in order: event.imageUrl → local category → fallback
  const src =
    imageUrl ||
    CATEGORY_IMAGES[category] ||
    DEFAULT_IMAGE;

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <img
        src={src}
        alt={name}
        className="h-52 w-full object-cover"
        onError={e => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = DEFAULT_IMAGE;
        }}
      />
      <div className="p-4">
        <span className="inline-block text-sm bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full mb-2">
          {category}
        </span>
        <h4 className="font-semibold text-lg">{name}</h4>
        <p className="text-sm text-gray-500 my-2">
          📅 {new Date(date).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-500 mb-4">📍 {location}</p>
        <Link
          to={`/event/${id}`}
          className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Get Tickets
        </Link>
      </div>
    </div>
  );
}
