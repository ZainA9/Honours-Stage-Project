import React, { useState } from 'react';
import axios from 'axios';

export default function CreateEvent() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    date: '',
    category: '',
  });

  const categories = ['Technology', 'Music', 'Food', 'Arts', 'Sports', 'Education'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5154/api/events', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Event created successfully!');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Create a New Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Event Name" required
          className="w-full border rounded px-3 py-2" onChange={handleChange} />

        <textarea name="description" placeholder="Event Description" required
          className="w-full border rounded px-3 py-2" onChange={handleChange}></textarea>

        <input type="text" name="location" placeholder="Location" required
          className="w-full border rounded px-3 py-2" onChange={handleChange} />

        <input type="date" name="date" required
          className="w-full border rounded px-3 py-2" onChange={handleChange} />

        <select name="category" required className="w-full border rounded px-3 py-2" onChange={handleChange}>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <button type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
          Create Event
        </button>
      </form>
    </div>
  );
}
