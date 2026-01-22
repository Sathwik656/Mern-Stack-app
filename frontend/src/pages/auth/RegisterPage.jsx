import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService.js';
import { BrainCircuit, Mail, Lock, ArrowRight, User } from 'lucide-react';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await authService.register(username, email, password);
      toast.success('Registration successful! Please login');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Failed to register. Please try again');
      toast.error(err.message || 'Failed to Register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* background */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:16px_16px] opacity-30" />

      <div className="relative w-full max-w-md px-6">
        <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-10 backdrop-blur-xl shadow-xl shadow-slate-200/50">
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/25">
              <BrainCircuit className="h-7 w-7 text-white" strokeWidth={2} />
            </div>

            <h1 className="text-2xl font-semibold text-slate-900">
              Create an account
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Start your AI-powered learning experience
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wide text-slate-600">
                Username
              </label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 flex items-center pl-4 transition-colors ${
                    focusedField === 'username'
                      ? 'text-emerald-500'
                      : 'text-slate-400'
                  }`}
                >
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="yourusername"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wide text-slate-600">
                Email
              </label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 flex items-center pl-4 transition-colors ${
                    focusedField === 'email'
                      ? 'text-emerald-500'
                      : 'text-slate-400'
                  }`}
                >
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wide text-slate-600">
                Password
              </label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 flex items-center pl-4 transition-colors ${
                    focusedField === 'password'
                      ? 'text-emerald-500'
                      : 'text-slate-400'
                  }`}
                >
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:from-emerald-600 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                      strokeWidth={2.5}
                    />
                  </>
                )}
              </span>

              {/* shimmer */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-emerald-500 hover:text-emerald-600"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Legal */}
        <p className="mt-6 text-center text-xs text-slate-400">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
