import React, { useState } from 'react';

export default function Signup({ onSignupSuccess, switchToLogin }) {
  const [facultyName, setFacultyName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!facultyName || !phone || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/faculty/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ facultyName, phone, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        onSignupSuccess();
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch {
      setError('Network error');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow text-black">
      <h2 className="text-2xl font-bold mb-4">Faculty Signup</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSignup}>
        <div className="mb-4">
          <label htmlFor="facultyName" className="block mb-1 font-medium text-black">Faculty Name</label>
          <input
            type="text"
            id="facultyName"
            className="w-full border px-3 py-2 rounded text-black"
            value={facultyName}
            onChange={e => setFacultyName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block mb-1 font-medium text-black">Phone</label>
          <input
            type="tel"
            id="phone"
            className="w-full border px-3 py-2 rounded text-black"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 font-medium text-black">Email</label>
          <input
            type="email"
            id="email"
            className="w-full border px-3 py-2 rounded text-black"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-1 font-medium text-black">Password</label>
          <input
            type="password"
            id="password"
            className="w-full border px-3 py-2 rounded text-black"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block mb-1 font-medium text-black">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            className="w-full border px-3 py-2 rounded text-black"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
          >
            Sign Up
          </button>
        </div>
      </form>
      <p className="mt-4 text-center text-black">
        Already have an account?{' '}
        <button
          onClick={switchToLogin}
          className="text-blue-600 hover:underline"
          type="button"
        >
          Log In
        </button>
      </p>
    </div>
  );
}
