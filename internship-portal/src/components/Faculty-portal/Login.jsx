import React, { useState } from 'react';
import { Mail, GraduationCap } from 'lucide-react';

export default function Login({ onLoginSuccess, switchToSignup }) {
  const [facultyEmail, setFacultyEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!facultyEmail.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/faculty/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: facultyEmail.trim(), password }),
      });
      const data = await response.json();
      if (response.ok) {
        onLoginSuccess(facultyEmail.trim());
      } else {
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('Network error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Faculty Portal</h1>
          <p className="text-gray-600">Intern Application Management System</p>
        </div>
        
        <div className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="facultyEmail" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="facultyEmail"
                type="email"
                value={facultyEmail}
                onChange={(e) => setFacultyEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
          
          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Enter your password"
              required
            />
          </div>
          
          {/* Error Message */}
          {error && <p className="text-red-600 mb-4">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Sign In
          </button>
        </div>
      <p className="mt-4 text-center text-black">
        Don't have an account?{' '}
        <button
          onClick={switchToSignup}
          className="text-blue-600 hover:underline"
          type="button"
        >
          Sign Up
        </button>
      </p>
      </form>
    </div>
  );
}