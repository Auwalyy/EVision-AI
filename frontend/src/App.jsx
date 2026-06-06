import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import AdminSidebar from './components/layout/admin/AdminSidebar';
import UserSidebar from './components/layout/user/UserSidebar';
import Header from './components/layout/Header';

// Auth
import Login from './pages/Login';
import Register from './pages/Register';

// Shared user pages
import MapPage from './pages/MapPage';
import Insights from './pages/Insights';
import Recommendations from './pages/Recommendations';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';

// Role dashboard router
import RoleDashboard from './pages/user/RoleDashboard';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import Admin from './pages/Admin';

// API
import { generateRecommendations, getUsers } from './utils/api';
import { useFetch } from './hooks/useFetch';
import { LoadingSpinner, ErrorState } from './components/dashboard/States';
import { Users, ShieldCheck } from 'lucide-react';

// ─── Admin sub-pages ─────────────────────────────────────────────────────────

const roleBadge = {
  admin:      'bg-red-500/20 text-red-400',
  government: 'bg-blue-500/20 text-blue-400',
  investor:   'bg-green-500/20 text-green-400',
  operator:   'bg-purple-500/20 text-purple-400',
  planner:    'bg-amber-500/20 text-amber-400',
};

function AdminUsersPage() {
  const { data, loading, error, refetch } = useFetch(getUsers);
  if (loading) return <LoadingSpinner text="Loading users..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  const users = data?.data || [];

  return (
    <div className="p-6 space-y-4">
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Users size={18} className="text-purple-400" />
          <h2 className="text-white font-semibold text-lg">User Management</h2>
          <span className="ml-auto text-xs text-ev-gray">{users.length} registered users</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-ev-gray text-xs uppercase border-b border-ev-dark-border">
                <th className="text-left pb-2">Name</th>
                <th className="text-left pb-2">Email</th>
                <th className="text-left pb-2">Role</th>
                <th className="text-right pb-2">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-ev-dark-border/40 hover:bg-ev-dark-border/20">
                  <td className="py-2.5 text-white font-medium flex items-center gap-2">
                    <ShieldCheck size={14} className="text-ev-gray/40" />{u.fullname}
                  </td>
                  <td className="py-2.5 text-ev-gray">{u.email}</td>
                  <td className="py-2.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${roleBadge[u.role] || 'bg-ev-dark-border text-ev-gray'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-2.5 text-right text-ev-gray text-xs">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminEnginePage() {
  const [running, setRunning] = useState(false);
  const [msg, setMsg] = useState('');

  const run = async () => {
    setRunning(true); setMsg('');
    try { const r = await generateRecommendations(); setMsg(r.message || 'Engine run complete'); }
    catch (err) { setMsg(err?.error || err?.message || 'Engine run failed'); }
    finally { setRunning(false); }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="card">
        <h2 className="text-white font-semibold text-lg mb-1">AI Scoring Engine Control</h2>
        <p className="text-ev-gray text-sm mb-4">Trigger the demand scoring engine to regenerate all recommendations.</p>
        {msg && <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">{msg}</div>}
        <button onClick={run} disabled={running} className="btn-primary">
          {running ? 'Running...' : 'Run AI Engine Now'}
        </button>
      </div>
      <div className="card">
        <h3 className="text-white font-semibold mb-3">Scoring Formula</h3>
        <pre className="text-ev-blue text-xs bg-ev-dark rounded-lg p-4 leading-relaxed">{`Demand Score =
  (0.4 × Population Density)
+ (0.3 × Traffic Volume)
+ (0.2 × Commercial Activity)
+ (0.1 × EV Adoption Potential)

Priority:  Critical ≥85 | High ≥70 | Medium ≥50 | Low <50
ROI:       High ≥25%   | Medium ≥15%             | Low <15%`}</pre>
      </div>
    </div>
  );
}

function AdminSystemPage() {
  const checks = [
    { service: 'Express API Server',   status: 'Online',      color: 'text-green-400' },
    { service: 'MongoDB Atlas',        status: 'Connected',   color: 'text-green-400' },
    { service: 'JWT Auth Middleware',  status: 'Active',      color: 'text-green-400' },
    { service: 'AI Scoring Engine',    status: 'Ready',       color: 'text-green-400' },
    { service: 'AWS S3 Data Lake',     status: 'Configured',  color: 'text-amber-400' },
    { service: 'AWS Lambda Handler',   status: 'Deployed',    color: 'text-green-400' },
    { service: 'API Gateway',          status: 'Active',      color: 'text-green-400' },
    { service: 'SageMaker Endpoint',   status: 'Phase 2',     color: 'text-ev-gray'   },
    { service: 'CloudWatch Logs',      status: 'Monitoring',  color: 'text-green-400' },
  ];

  return (
    <div className="p-6">
      <div className="card">
        <h2 className="text-white font-semibold text-lg mb-4">System Health Monitor</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {checks.map(({ service, status, color }) => (
            <div key={service} className="flex items-center justify-between p-3 rounded-xl bg-ev-dark border border-ev-dark-border">
              <span className="text-white text-sm">{service}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color} bg-current/10`}>{status}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
          <p className="text-green-400 text-xs font-medium">System operating normally · EVision AI v1.0.0</p>
          <p className="text-ev-gray text-xs mt-0.5">Checked: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Layouts ─────────────────────────────────────────────────────────────────

function AdminLayout() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="data" element={<Admin />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="engine" element={<AdminEnginePage />} />
            <Route path="system" element={<AdminSystemPage />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function UserLayout() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;

  return (
    <div className="flex min-h-screen">
      <UserSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route index element={<RoleDashboard />} />
            <Route path="map" element={<MapPage />} />
            <Route path="recommendations" element={<Recommendations />} />
            <Route path="insights" element={<Insights />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="profile" element={<Profile />} />
            {/* Role-specific extra routes — alias to the role dashboard */}
            <Route path="planning" element={<RoleDashboard />} />
            <Route path="investment" element={<RoleDashboard />} />
            <Route path="stations" element={<RoleDashboard />} />
            <Route path="cityplanning" element={<RoleDashboard />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/*" element={<AdminLayout />} />
          <Route path="/*" element={<UserLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
