import { useLocation } from 'react-router-dom';
import { Bell, RefreshCw } from 'lucide-react';
import { generateRecommendations } from '../../utils/api';
import { useState } from 'react';

const titles = {
  '/': 'Dashboard',
  '/map': 'Interactive Map',
  '/recommendations': 'AI Recommendations',
  '/insights': 'AI Insights',
  '/analytics': 'Analytics',
  '/profile': 'My Profile',
  '/planning': 'National Planning',
  '/investment': 'Investment Hub',
  '/stations': 'Station Manager',
  '/cityplanning': 'City Planning',
  // admin paths
  '/admin': 'Admin Overview',
  '/admin/data': 'Data Management',
  '/admin/users': 'User Management',
  '/admin/engine': 'AI Engine Control',
  '/admin/system': 'System Health',
  '/admin/profile': 'My Profile',
};

export default function Header() {
  const { pathname } = useLocation();
  const [refreshing, setRefreshing] = useState(false);
  const [msg, setMsg] = useState('');

  const handleRefresh = async () => {
    setRefreshing(true);
    setMsg('');
    try {
      const res = await generateRecommendations();
      setMsg(res.message || 'Recommendations updated');
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      const detail = err?.error || err?.message || 'Refresh failed';
      setMsg(detail);
      setTimeout(() => setMsg(''), 4000);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <header className="h-16 bg-ev-dark-card border-b border-ev-dark-border flex items-center justify-between px-6">
      <div>
        <h2 className="text-white font-semibold text-lg">{titles[pathname] || 'EVision AI'}</h2>
        <p className="text-ev-gray text-xs">AI-Powered EV Infrastructure Planning for Nigeria</p>
      </div>
      <div className="flex items-center gap-3">
        {msg && <span className="text-xs text-ev-blue">{msg}</span>}
        <button onClick={handleRefresh} disabled={refreshing} className="btn-secondary text-sm py-1.5">
          <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Generating...' : 'Refresh AI'}
        </button>
        <button className="w-9 h-9 rounded-lg bg-ev-dark-border flex items-center justify-center hover:bg-slate-600 transition-colors">
          <Bell size={16} className="text-ev-gray" />
        </button>
      </div>
    </header>
  );
}
