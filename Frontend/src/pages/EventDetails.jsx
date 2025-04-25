import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import Footer from '../components/Footer';

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [tickets, setTickets] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');
  const [showModal, setShowModal] = useState(false);

  const isLoggedIn = !!localStorage.getItem('token');

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

  useEffect(() => {
    if (event?.categories?.length > 0) {
      const category = event.categories[0];
      axios
        .get(`http://localhost:5154/api/events/search?category=${category}`)
        .then(res => {
          const filtered = res.data.filter(e => e.id !== id);
          setRelatedEvents(filtered);
        })
        .catch(err => console.error('Error fetching related events:', err));
    }
  }, [event, id]);

  const handleCheckout = () => {
    setShowModal(true);
  };

  const handleRSVP = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5154/api/events/${id}/rsvp`,
        tickets,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      alert('RSVP confirmed! Check your email for confirmation.');
      setShowModal(false);
      setTickets(1);
    } catch (error) {
      alert(error?.response?.data?.message || 'RSVP failed.');
    }
  };

  if (!event) return <p className="text-center mt-20">Loading event details...</p>;

  const maxTickets = event.maxTicketsPerUser > 0 ? event.maxTicketsPerUser : 10;

  const DEFAULT_IMAGE = '/images/event-fallback.jpg';
  const CATEGORY_IMAGES = {
    Technology: '/images/technology.jpg',
    Music:      '/images/music.jpg',
    Food:       '/images/food.jpg',
    Arts:       '/images/arts.jpg',
    Sports:     '/images/sports.jpg',
    Education:  '/images/education.jpg',
  };
  const eventImage = event.imageUrl || CATEGORY_IMAGES[event.categories?.[0]] || DEFAULT_IMAGE;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Event Content */}
        <div className="flex flex-col md:flex-row gap-10 p-10">
          {/* Event Info */}
          <div className="flex-1 bg-white rounded-xl shadow p-6">
          <img src={eventImage} alt={event.name} className="w-full h-60 object-cover rounded mb-4" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = DEFAULT_IMAGE;}}/>
            <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
            <p className="text-gray-700 mb-4">{event.description}</p>
            <p className="text-gray-500 text-sm mb-1">📍 {event.location}</p>
            <p className="text-gray-500 text-sm mb-1">📅 {new Date(event.date).toLocaleDateString()}</p>
            <p className="text-gray-500 text-sm">🎟 Max Tickets per Person: {maxTickets}</p>
            <div className="mt-4">
              <span className="text-sm font-semibold text-indigo-600">
                Categories: {event.categories?.join(', ')}
              </span>
            </div>
          </div>

          {/* RSVP Box */}
          <div className="w-full md:w-1/3 bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Reserve Tickets</h2>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Tickets</span>
              <div className="flex items-center gap-2">
                <button
                  className="px-2 py-1 border rounded text-lg"
                  onClick={() => setTickets(prev => Math.max(1, prev - 1))}
                >-</button>
                <span>{tickets}</span>
                <button
                  className="px-2 py-1 border rounded text-lg"
                  onClick={() => {
                    if (tickets >= maxTickets) {
                      setErrorMsg(`Max tickets allowed: ${maxTickets}`);
                    } else {
                      setTickets(prev => prev + 1);
                      setErrorMsg('');
                    }
                  }}
                >+</button>
              </div>
            </div>
            {errorMsg && <p className="text-sm text-red-500 mb-4">{errorMsg}</p>}
            <button
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        </div>

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <section className="px-10 pb-20">
            <h3 className="text-2xl font-bold mb-6">You May Also Like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* RSVP Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] md:w-[500px] shadow-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-500 text-xl font-bold"
            >
              &times;
            </button>

            {isLoggedIn ? (
              <>
                <h3 className="text-lg font-bold mb-2">Order Summary</h3>
                <p className="text-gray-700">Event: {event.name}</p>
                <p className="text-gray-700">Location: {event.location}</p>
                <p className="text-gray-700">Tickets: {tickets}</p>
                <button
                  onClick={handleRSVP}
                  className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
                >
                  Confirm RSVP
                </button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold mb-2 text-red-600">Please Log In</h3>
                <p className="text-gray-600 mb-4">You must be logged in to complete this action.</p>
                <div className="flex justify-between">
                  <a href="/login" className="text-indigo-600 hover:underline">Log In</a>
                  <a href="/signup" className="text-indigo-600 hover:underline">Sign Up</a>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
