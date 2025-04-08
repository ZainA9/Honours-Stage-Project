import React from 'react';

const categoryImages = {
    Music: 'https://images.unsplash.com/photo-1497032205916-ac775f0649ae?auto=format&fit=crop&w=800&q=80',
    Tech: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    Food: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=800&q=80',
    Arts: 'https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1?auto=format&fit=crop&w=800&q=80',
    Sports: 'https://images.unsplash.com/photo-1599058917212-d750089bc07c?auto=format&fit=crop&w=800&q=80',
    Education: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80'
  };
export default function EventCard({ title, category, date, location }) {
  const image = categoryImages[category] || 'https://source.unsplash.com/featured/?event';

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <img src={image} alt={title} className="h-52 w-full object-cover" />
      <div className="p-4">
        <span className="inline-block text-sm bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full mb-2">{category}</span>
        <h4 className="font-semibold text-lg">{title}</h4>
        <p className="text-sm text-gray-500 my-2">📅 {date}</p>
        <p className="text-sm text-gray-500 mb-4">📍 {location}</p>
        <button className="text-indigo-600 font-semibold">Get Tickets</button>
      </div>
    </div>
  );
}
