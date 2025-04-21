import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MyEventCard from '../components/MyEventCard';
import { useNavigate } from 'react-router-dom';



export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  // For edit modal:
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEvent, setCurrentEvent]   = useState(null);
  const [formData, setFormData]           = useState({
    name: '', 
    description: '', 
    location: '', 
    date: '', 
    categories: '',   // was array, now string
    capacity: 0, 
    isPublic: false,
  });

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, eventId: null });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5154/api/events/myevents', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(res.data);
      } catch {
        setError('Failed to fetch events.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Open edit modal
  const handleEditEvent = (event) => {
    setCurrentEvent(event);
    setFormData({
      name: event.name,
      description: event.description,
      location: event.location,
      date: event.date.slice(0,10),
      categories: event.categories.join(', '),
      capacity: event.capacity,
      isPublic: event.isPublic,
    });
    setShowEditModal(true);
  };

  // Save edits
  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...currentEvent,
        name: formData.name,
        description: formData.description,
        location: formData.location,
        date: formData.date,
        categories: formData.categories.split(',').map(c=>c.trim()),
        capacity: Number(formData.capacity),
        isPublic: formData.isPublic,
      };
      await axios.put(`http://localhost:5154/api/events/${currentEvent.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Functional update
      setEvents(evts => evts.map(e =>
        e.id === currentEvent.id ? payload : e
      ));
      setShowEditModal(false);
    } catch (err) {
      console.error('Error updating event:', err);
      alert('Failed to save changes.');
    }
  };

  // Delete event
  const handleDeleteEvent = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5154/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Functional update
      setEvents(evts => evts.filter(e => e.id !== eventId));
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  if (loading) return <p>Loading…</p>;
  if (error)   return <p>{error}</p>;

  return (
    <>
      {/* Full‑width header area */}
      <div className="w-full bg-white py-4 px-8 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          ← Back
        </button>
      </div>
  
      {/* Main content centered below */}
      <div className="max-w-3xl mx-auto p-8">
        <h2 className="text-3xl font-bold mb-8 text-center">My Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {events.map(event => (
            <MyEventCard
              key={event.id}
              event={event}
              onEdit={() => handleEditEvent(event)}
              onDelete={() => setDeleteConfirm({ show: true, eventId: event.id })}
            />
          ))}
        </div>
  
        {/* Delete Confirmation Modal */}
        {deleteConfirm.show && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-[90%] md:w-[400px] shadow-lg relative">
              <button
                onClick={() => setDeleteConfirm({ show: false, eventId: null })}
                className="absolute top-2 right-3 text-gray-500 text-xl"
              >
                &times;
              </button>
              <h3 className="text-lg font-bold mb-4 text-red-600">Delete Event?</h3>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this event? This cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() => setDeleteConfirm({ show: false, eventId: null })}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                  onClick={async () => {
                    await handleDeleteEvent(deleteConfirm.eventId);
                    setDeleteConfirm({ show: false, eventId: null });
                  }}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
  
        {/* Edit Event Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-[90%] md:w-[500px] relative">
              <button
                onClick={() => setShowEditModal(false)}
                className="absolute top-2 right-3 text-gray-500 text-xl"
              >
                &times;
              </button>
              <h3 className="text-lg font-bold mb-4">Edit Event</h3>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Name"
                className="w-full border p-2 rounded mb-3"
              />
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description"
                className="w-full border p-2 rounded mb-3"
              />
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                placeholder="Location"
                className="w-full border p-2 rounded mb-3"
              />
              <input
                type="date"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="w-full border p-2 rounded mb-3"
              />
              <input
                type="text"
                value={formData.categories}
                onChange={e => setFormData({ ...formData, categories: e.target.value })}
                placeholder="Categories (comma-separated)"
                className="w-full border p-2 rounded mb-3"
              />
              <input
                type="number"
                value={formData.capacity}
                onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                placeholder="Capacity"
                className="w-full border p-2 rounded mb-3"
              />
              <label className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={e => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="mr-2"
                />
                Public Event
              </label>
              <button
                onClick={handleSaveEdit}
                className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
  
}