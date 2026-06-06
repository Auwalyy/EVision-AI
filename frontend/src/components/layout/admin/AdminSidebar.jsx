import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Database, Users, Activity, RefreshCw, Zap, UserCircle, Settings } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Admin Overview', end: true },
  { to: '/admin/data', icon: Database, label: 'Data Management' },
  { to: '/admin/users', icon: Users, label: 'User Management' },
  { to: '/admin/engine', icon: RefreshCw, label: 'AI Engine' },
  { to: '/admin/system', icon: Activity, label: 'System Health' },
];

export default function AdminSidebar() {
  const { user } = useAuth();
  return (
    <aside className="w-64 min-h-screen bg-ev-dark-card border-r border-red-500/20 flex flex-col">
      <div className="p-6 border-b border-red-500/20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-red-500 rounded-lg flex items-center justify-center">
            <Settings size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white text-lg leading-none">EVision AI</h1>
            <p className="text-red-400 text-xs mt-0.5 font-medium">Admin Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                isActive
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                  : 'text-ev-gray hover:text-white hover:bg-ev-dark-border'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-red-500/20">
        <NavLink
          to="/admin/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm ${
              isActive ? 'text-red-400' : 'text-ev-gray hover:text-white'
            }`
          }
        >
          <UserCircle size={18} />
          <div className="min-w-0">
            <p className="font-medium truncate">{user?.fullname}</p>
            <p className="text-xs text-red-400/70 truncate">Administrator</p>
          </div>
        </NavLink>
      </div>
    </aside>
  );
}
