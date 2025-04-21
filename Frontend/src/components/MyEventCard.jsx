import React from 'react';
import { Link } from 'react-router-dom';

const categoryImages = {
  Technology: 'https://source.unsplash.com/featured/?technology,conference',
  Music:      'https://source.unsplash.com/featured/?music,concert',
  Food:       'https://source.unsplash.com/featured/?food,festival',
  Arts:       'https://source.unsplash.com/featured/?art,painting',
  Sports:     'https://source.unsplash.com/featured/?sports,fitness',
  Education:  'https://source.unsplash.com/featured/?education,classroom',
};

export default function MyEventCard({ event, onEdit, onDelete }) {
  const { id, name, location, date, categories } = event;
  const category = categories?.[0] || 'General';
  const image = categoryImages[category] || 'https://source.unsplash.com/featured/?event';

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <img
        src={image}
        alt={name}
        className="h-52 w-full object-cover"
      />
      <div className="p-4">
        <span className="inline-block text-sm bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full mb-2">
          {category}
        </span>
        <h4 className="font-semibold text-lg">{name}</h4>
        <p className="text-sm text-gray-500 my-2">📅 {new Date(date).toLocaleDateString()}</p>
        <p className="text-sm text-gray-500 mb-4">📍 {location}</p>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(id)}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit Event
          </button>
          <button
            onClick={() => onDelete(id)}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete Event
          </button>
        </div>
      </div>
    </div>
  );
}
