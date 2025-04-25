import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // ✅ Add this line

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [passwordHash, setPasswordHash] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const { setToken } = useContext(AuthContext); // ✅ Pull from AuthContext

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      // 🔹 Register the user
      await axios.post('http://localhost:5154/api/auth/register', {
        fullName,
        email,
        passwordHash, // sending plain password (misnamed as passwordHash)
      });

      // 🔐 Immediately log them in
      const loginResponse = await axios.post('http://localhost:5154/api/auth/login', {
        email,
        password: passwordHash, // 🔥 This is the fix (next section explains this)
      });

      setToken(loginResponse.data.token); // ✅ Store token globally
      navigate('/'); // ➡️ Redirect to home
    } catch (error) {
      console.error('Signup/Login error:', error);
      setErrorMsg(error.response?.data || 'Something went wrong.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-md rounded px-8 py-6 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        {errorMsg && <p className="text-red-500 text-sm mb-4">{errorMsg}</p>}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
          <input
            type="text"
            className="shadow border rounded w-full py-2 px-3 text-gray-700"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            className="shadow border rounded w-full py-2 px-3 text-gray-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input
            type="password"
            className="shadow border rounded w-full py-2 px-3 text-gray-700"
            value={passwordHash}
            onChange={(e) => setPasswordHash(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Sign Up
        </button>
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
