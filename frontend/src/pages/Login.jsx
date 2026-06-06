import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(form.email, form.password);
      navigate(res.user?.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err?.error || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ev-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-11 h-11 bg-ev-blue rounded-xl flex items-center justify-center">
            <Zap size={24} className="text-white" fill="white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-2xl leading-none">EVision AI</h1>
            <p className="text-ev-gray text-xs mt-0.5">Nigeria EV Infrastructure Platform</p>
          </div>
        </div>

        <div className="card">
          <h2 className="text-white text-xl font-semibold mb-1">Welcome back</h2>
          <p className="text-ev-gray text-sm mb-6">Sign in to your account</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
              <AlertCircle size={16} className="text-red-400 shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handle} className="space-y-4">
            <div>
              <label className="text-ev-gray text-sm mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ev-gray" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-ev-dark border border-ev-dark-border rounded-lg pl-9 pr-4 py-2.5 text-white placeholder:text-ev-gray/50 focus:border-ev-blue outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-ev-gray text-sm mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ev-gray" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="w-full bg-ev-dark border border-ev-dark-border rounded-lg pl-9 pr-4 py-2.5 text-white placeholder:text-ev-gray/50 focus:border-ev-blue outline-none text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-2.5"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-ev-gray text-sm text-center mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-ev-blue hover:underline">Register</Link>
          </p>
        </div>

        <p className="text-ev-gray/40 text-xs text-center mt-6">
          Powered by Arthurite Integrated · ONE WITH AI Hackathon 2025
        </p>
      </div>
    </div>
  );
}
