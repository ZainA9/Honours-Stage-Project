import React from 'react';

const categoryImages = {
  Technology: 'https://source.unsplash.com/featured/?technology,conference',
  Music: 'https://source.unsplash.com/featured/?music,concert',
  Food: 'https://source.unsplash.com/featured/?food,festival',
  Arts: 'https://source.unsplash.com/featured/?art,painting',
  Sports: 'https://source.unsplash.com/featured/?sports,fitness',
  Education: 'https://source.unsplash.com/featured/?education,classroom',
};

export default function EventCard({ event }) {
  const imageUrl = categoryImages[event.categories?.[0]] || 'https://source.unsplash.com/featured/?event';

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <img src={imageUrl} alt={event.name} className="h-52 w-full object-cover" />
      <div className="p-4">
        <span className="inline-block text-sm bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full mb-2">
          {event.categories?.[0]}
        </span>
        <h4 className="font-semibold text-lg">{event.name}</h4>
        <p className="text-sm text-gray-500 my-2">📅 {new Date(event.date).toLocaleDateString()}</p>
        <p className="text-sm text-gray-500 mb-4">📍 {event.location}</p>
        <button className="text-indigo-600 font-semibold">Get Tickets</button>
      </div>
    </div>
  );
}
