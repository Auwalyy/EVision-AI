import { useState } from 'react';
import { User, Mail, Briefcase, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const ROLES = [
  { value: 'government', label: 'Government Official' },
  { value: 'investor', label: 'EV Infrastructure Investor' },
  { value: 'operator', label: 'Charging Operator' },
  { value: 'planner', label: 'Urban Planner' },
  { value: 'admin', label: 'Admin' },
];

const roleBadge = {
  government: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  investor: 'bg-green-500/10 text-green-400 border-green-500/20',
  operator: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  planner: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  admin: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const [form, setForm] = useState({ fullname: user?.fullname || '', role: user?.role || 'investor' });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaveError('');
    try {
      const res = await api.put('/auth/profile', form);
      updateUser({ fullname: res.data.fullname, role: res.data.role });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSaveError(err?.error || 'Update failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="card flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-ev-blue/20 flex items-center justify-center shrink-0">
          <User size={32} className="text-ev-blue" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-bold text-xl truncate">{user?.fullname}</h2>
          <p className="text-ev-gray text-sm">{user?.email}</p>
          <span className={`inline-block mt-1.5 text-xs px-2.5 py-0.5 rounded-full border font-medium capitalize ${roleBadge[user?.role] || roleBadge.investor}`}>
            {ROLES.find((r) => r.value === user?.role)?.label || user?.role}
          </span>
        </div>
        <button onClick={logout} className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">
          Sign Out
        </button>
      </div>

      {/* Edit Form */}
      <div className="card">
        <h3 className="text-white font-semibold mb-4">Edit Profile</h3>

        {saveError && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
            <AlertCircle size={16} className="text-red-400 shrink-0" />
            <p className="text-red-400 text-sm">{saveError}</p>
          </div>
        )}

        {saved && (
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-4">
            <CheckCircle size={16} className="text-green-400" />
            <p className="text-green-400 text-sm">Profile updated successfully</p>
          </div>
        )}

        <form onSubmit={handle} className="space-y-4">
          <div>
            <label className="text-ev-gray text-sm mb-1.5 block">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ev-gray" />
              <input
                type="text"
                value={form.fullname}
                onChange={(e) => setForm({ ...form, fullname: e.target.value })}
                required
                className="w-full bg-ev-dark border border-ev-dark-border rounded-lg pl-9 pr-4 py-2.5 text-white focus:border-ev-blue outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-ev-gray text-sm mb-1.5 block">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ev-gray" />
              <input
                type="email"
                value={user?.email}
                disabled
                className="w-full bg-ev-dark/50 border border-ev-dark-border rounded-lg pl-9 pr-4 py-2.5 text-ev-gray outline-none text-sm cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="text-ev-gray text-sm mb-1.5 block">Role</label>
            <div className="relative">
              <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ev-gray" />
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full bg-ev-dark border border-ev-dark-border rounded-lg pl-9 pr-4 py-2.5 text-white focus:border-ev-blue outline-none text-sm appearance-none"
              >
                {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary py-2.5">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Platform Access Info */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Shield size={16} className="text-ev-blue" />
          <h3 className="text-white font-semibold">Platform Access</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            { label: 'Dashboard', access: true },
            { label: 'Interactive Map', access: true },
            { label: 'AI Insights', access: true },
            { label: 'Recommendations', access: true },
            { label: 'Analytics', access: true },
            { label: 'Admin Panel', access: user?.role === 'admin' },
          ].map(({ label, access }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${access ? 'bg-green-400' : 'bg-ev-gray/30'}`} />
              <span className={access ? 'text-white' : 'text-ev-gray/50'}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
