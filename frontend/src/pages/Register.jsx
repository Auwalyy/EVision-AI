import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, User, Mail, Lock, Briefcase, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ROLES = [
  { value: 'government', label: 'Government Official' },
  { value: 'investor', label: 'EV Infrastructure Investor' },
  { value: 'operator', label: 'Charging Operator' },
  { value: 'planner', label: 'Urban Planner' },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullname: '', email: '', password: '', role: 'investor' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm({ ...form, [key]: e.target.value }),
  });

  return (
    <div className="min-h-screen bg-ev-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
          <h2 className="text-white text-xl font-semibold mb-1">Create your account</h2>
          <p className="text-ev-gray text-sm mb-6">Join the EV infrastructure planning platform</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
              <AlertCircle size={16} className="text-red-400 shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handle} className="space-y-4">
            <div>
              <label className="text-ev-gray text-sm mb-1.5 block">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ev-gray" />
                <input type="text" {...field('fullname')} placeholder="John Adeyemi" required
                  className="w-full bg-ev-dark border border-ev-dark-border rounded-lg pl-9 pr-4 py-2.5 text-white placeholder:text-ev-gray/50 focus:border-ev-blue outline-none text-sm" />
              </div>
            </div>

            <div>
              <label className="text-ev-gray text-sm mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ev-gray" />
                <input type="email" {...field('email')} placeholder="you@example.com" required
                  className="w-full bg-ev-dark border border-ev-dark-border rounded-lg pl-9 pr-4 py-2.5 text-white placeholder:text-ev-gray/50 focus:border-ev-blue outline-none text-sm" />
              </div>
            </div>

            <div>
              <label className="text-ev-gray text-sm mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ev-gray" />
                <input type="password" {...field('password')} placeholder="Min. 6 characters" required minLength={6}
                  className="w-full bg-ev-dark border border-ev-dark-border rounded-lg pl-9 pr-4 py-2.5 text-white placeholder:text-ev-gray/50 focus:border-ev-blue outline-none text-sm" />
              </div>
            </div>

            <div>
              <label className="text-ev-gray text-sm mb-1.5 block">Role</label>
              <div className="relative">
                <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ev-gray" />
                <select {...field('role')}
                  className="w-full bg-ev-dark border border-ev-dark-border rounded-lg pl-9 pr-4 py-2.5 text-white focus:border-ev-blue outline-none text-sm appearance-none">
                  {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-ev-gray text-sm text-center mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-ev-blue hover:underline">Sign in</Link>
          </p>
        </div>

        <p className="text-ev-gray/40 text-xs text-center mt-6">
          Powered by Arthurite Integrated · ONE WITH AI Hackathon 2026
        </p>
      </div>
    </div>
  );
}
