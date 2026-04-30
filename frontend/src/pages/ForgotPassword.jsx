import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(`${BACKEND_URL}/api/auth/forgot-password`, { email }, { timeout: 60000 });
      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a3a6b] to-[#0f2244] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <img
            src="https://customer-assets.emergentagent.com/job_sanskar-dham/artifacts/ed94r76r_VSD_PNG_LOGO.png"
            alt="VSD Logo"
            className="h-16 w-auto mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-[#1a3a6b]">Forgot Password</h1>
          <p className="text-gray-500 text-sm mt-2">Enter your admin email to receive a reset link</p>
        </div>

        {submitted ? (
          <div className="text-center">
            <div className="text-5xl mb-4">📧</div>
            <h2 className="text-lg font-bold text-green-600 mb-2">Check Your Email</h2>
            <p className="text-gray-600 text-sm mb-6">
              If <strong>{email}</strong> is registered, you'll receive a password reset link shortly.
              Check your spam folder if you don't see it.
            </p>
            <button
              onClick={() => navigate('/admin/login')}
              className="w-full bg-[#1a3a6b] hover:bg-[#0f2244] text-white font-bold py-3 rounded-lg transition-colors"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a3a6b] focus:border-transparent outline-none"
                placeholder="vsddombivli@gmail.com"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a3a6b] hover:bg-[#0f2244] disabled:bg-gray-300 text-white font-bold py-3 rounded-lg transition-colors"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            {loading && (
              <p className="text-xs text-gray-400 text-center mt-2">
                Server is waking up... please wait up to 30 seconds
              </p>
            )}
            <button
              type="button"
              onClick={() => navigate('/admin/login')}
              className="w-full text-gray-500 hover:text-[#1a3a6b] text-sm py-2 transition-colors"
            >
              ← Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
