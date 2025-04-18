import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    interests: '',
  });
  const [message, setMessage] = useState('');

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5154/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
        setFormData({
          fullName: res.data.fullName,
          email: res.data.email,
          password: '',
          interests: (res.data.interests || []).join(', '),
        });
      } catch (err) {
        console.error(err);
        setMessage('Failed to load profile.');
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Special case for interests
    if (name === "interests") {
      setFormData((prev) => ({
        ...prev,
        interests: value.split(',').map(i => i.trim()), // Converts to array
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...formData,
        interests: formData.interests,
      };

      const res = await axios.put('http://localhost:5154/api/users/me', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage(res.data.message || 'Profile updated successfully!');
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setMessage('Error updating profile.');
    }
  };

  if (!user) return <p className="text-center mt-20">Loading profile...</p>;

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-8 text-center">My Profile</h2>

      {message && <p className="text-sm text-center mb-4 text-indigo-600">{message}</p>}

      <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center">
        <img
          src="https://placehold.co/100x100"
          alt="avatar"
          className="rounded-full w-24 h-24 object-cover mb-4"
        />
        <h3 className="text-xl font-semibold mb-1">{user.fullName}</h3>
        <p className="text-gray-600 mb-2">{user.email}</p>

        {user.interests?.length > 0 && (
  <div className="flex flex-col items-center mt-2 mb-4">
    <p className="text-sm font-medium text-gray-600 mb-1">Interests:</p>
    <div className="flex flex-wrap justify-center gap-2">
      {user.interests.map((tag, i) => (
        <span
          key={i}
          className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm"
        >
          {tag}
        </span>
      ))}
    </div>
  </div>
)}


        <button
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-5 rounded"
          onClick={() => setShowModal(true)}
        >
          Edit Profile
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] md:w-[500px] shadow-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-500 text-xl font-bold"
            >
              &times;
            </button>

            <h3 className="text-lg font-bold mb-4">Edit Profile</h3>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full border p-2 rounded mb-3"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border p-2 rounded mb-3"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="New Password"
              className="w-full border p-2 rounded mb-3"
            />
            <input
              type="text"
              name="interests"
              value={Array.isArray(formData.interests) ? formData.interests.join(', ') : formData.interests}
              onChange={handleChange}
              placeholder="Interests (comma-separated)"
              className="w-full border p-2 rounded mb-3"
            />

            <button
              onClick={handleUpdate}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
