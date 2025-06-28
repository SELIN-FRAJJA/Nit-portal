import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginForm({ 
  loginForm, 
  setLoginForm,
  handleLogin,
  showPassword,
  setShowPassword,
  loginError
}) {
  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            required
            value={loginForm.email}
            onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="admin@university.edu"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
              placeholder="Enter admin password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {loginError && (
            <p className="text-red-600 text-sm mt-2">{loginError}</p>
          )}
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-blue-900 to-blue-900 text-white py-3 rounded-lg font-medium hover:from-blue-800 hover:to-indigo-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};