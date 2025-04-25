import React from 'react';

const DEFAULT_IMAGE   = '/images/event-fallback.jpg';
const CATEGORY_IMAGES = {
  Technology: '/images/technology.jpg',
  Music:      '/images/music.jpg',
  Food:       '/images/food.jpg',
  Arts:       '/images/arts.jpg',
  Sports:     '/images/sports.jpg',
  Education:  '/images/education.jpg',
};

export default function MyEventCard({ event, onEdit, onDelete }) {
  const { id, name, location, date, categories, imageUrl } = event;
  const category = categories?.[0] || 'General';

  // event.imageUrl → local category image → fallback
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
