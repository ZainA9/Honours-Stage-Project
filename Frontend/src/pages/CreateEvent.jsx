import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

export default function CreateEvent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    categories: [],
    capacity: '',
    maxTicketsPerUser: '',
    isPublic: 'true',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const categoryList = [
    { value: 'Technology', label: 'Technology' },
    { value: 'Music', label: 'Music' },
    { value: 'Food', label: 'Food' },
    { value: 'Arts', label: 'Arts' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Education', label: 'Education' },
  ];
  const handleChange = (e) => {
    const { name, value, type, selectedOptions } = e.target;

    if (type === 'select-multiple') {
      const selected = Array.from(selectedOptions).map(option => option.value);
      setFormData(prev => ({ ...prev, [name]: selected }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const token = localStorage.getItem('token');

      const payload = {
        ...formData,
        capacity: Number(formData.capacity),
        maxTicketsPerUser: Number(formData.maxTicketsPerUser),
        isPublic: formData.isPublic === 'true',
      };

      const response = await axios.post('http://localhost:5154/api/events', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccessMsg('Event created successfully!');
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error('Error creating event:', error);
      setErrorMsg('Something went wrong.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Create New Event</h2>

        {errorMsg && <p className="text-red-500 text-sm mb-4">{errorMsg}</p>}
        {successMsg && <p className="text-green-500 text-sm mb-4">{successMsg}</p>}

        {/* Name */}
        <label className="block font-medium text-gray-700 mb-1">Event Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange}
          className="mb-4 w-full p-2 border rounded" required />

        {/* Description */}
        <label className="block font-medium text-gray-700 mb-1">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange}
          className="mb-4 w-full p-2 border rounded" required />

        {/* Date */}
        <label className="block font-medium text-gray-700 mb-1">Date</label>
        <input type="date" name="date" value={formData.date} onChange={handleChange}
          className="mb-4 w-full p-2 border rounded" required />

        {/* Location */}
        <label className="block font-medium text-gray-700 mb-1">Location</label>
        <input type="text" name="location" value={formData.location} onChange={handleChange}
          className="mb-4 w-full p-2 border rounded" required />

        {/* Categories */}
        <label className="block text-gray-700 text-sm font-bold mb-2">
             Categories
        </label>
        <Select
          isMulti
          name="categories"
          options={categoryOptions}
          className="basic-multi-select mb-4"
          classNamePrefix="select"
          value={categoryOptions.filter(opt => formData.categories.includes(opt.value))}
          onChange={(selectedOptions) => {
            const selectedValues = selectedOptions.map(opt => opt.value);
            setFormData(prev => ({ ...prev, categories: selectedValues }));
          }}
        />  

        {/* Capacity */}
        <label className="block font-medium text-gray-700 mb-1">Capacity</label>
        <input type="number" name="capacity" value={formData.capacity} onChange={handleChange}
          className="mb-4 w-full p-2 border rounded" required />

        {/* Max Tickets Per User */}
        <label className="block font-medium text-gray-700 mb-1">Max Tickets Per User</label>
        <input type="number" name="maxTicketsPerUser" value={formData.maxTicketsPerUser} onChange={handleChange}
          className="mb-4 w-full p-2 border rounded" required />

        {/* Is Public */}
        <label className="block font-medium text-gray-700 mb-1">Is Public?</label>
        <select name="isPublic" value={formData.isPublic} onChange={handleChange}
          className="mb-6 w-full p-2 border rounded">
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>

        <button type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded">
          Create Event
        </button>
      </form>
    </div>
  );
}
