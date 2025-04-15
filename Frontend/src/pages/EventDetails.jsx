import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function EventDetails() {
  const { id } = useParams(); 
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState(1);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5154/api/events/${id}`);
        setEvent(response.data);
      } catch (err) {
        console.error('Failed to fetch event:', err);
      }
    };

    fetchEvent();
  }, [id]);

  if (!event) return <p className="text-center mt-20">Loading event details...</p>;

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8">
      {/*Event Info */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
        <p className="text-gray-600 mb-2">{event.description}</p>
        <p className="text-sm text-gray-500 mb-1">📍 {event.location}</p>
        <p className="text-sm text-gray-500 mb-1">📅 {new Date(event.date).toLocaleDateString()}</p>
        <p className="text-sm text-gray-500 mb-4">
          Categories: {event.categories?.join(', ')}
        </p>
      </div>

      {/*RSVP Box */}
      <div className="w-full md:w-1/3 bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Reserve Tickets</h2>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium">Tickets</span>
          <div className="flex items-center gap-2">
            <button
              className="px-2 py-1 border rounded text-lg"
              onClick={() => setTickets((prev) => Math.max(1, prev - 1))}
            >
              -
            </button>
            <span>{tickets}</span>
            <button
              className="px-2 py-1 border rounded text-lg"
              onClick={() => setTickets((prev) => prev + 1)}
            >
              +
            </button>
          </div>
        </div>

        <button
          className="w-full bg-indigo-600 text-white font-semibold py-2 rounded hover:bg-indigo-700"
          onClick={() => alert('Checkout logic coming soon')}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
