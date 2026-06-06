import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Map, Brain, ListChecks, BarChart2,
  Zap, UserCircle, Building2, TrendingUp, Radio, Globe,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

// Nav items visible to ALL regular users
const commonNav = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/map', icon: Map, label: 'Interactive Map' },
  { to: '/recommendations', icon: ListChecks, label: 'AI Recommendations' },
  { to: '/insights', icon: Brain, label: 'AI Insights' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics' },
];

// Extra nav per role
const roleExtras = {
  government: [{ to: '/planning', icon: Globe, label: 'National Planning' }],
  investor: [{ to: '/investment', icon: TrendingUp, label: 'Investment Hub' }],
  operator: [{ to: '/stations', icon: Radio, label: 'Station Manager' }],
  planner: [{ to: '/cityplanning', icon: Building2, label: 'City Planning' }],
};

const roleLabel = {
  government: 'Government Official',
  investor: 'EV Investor',
  operator: 'Station Operator',
  planner: 'Urban Planner',
};

const roleColor = {
  government: 'text-blue-400',
  investor: 'text-green-400',
  operator: 'text-purple-400',
  planner: 'text-amber-400',
};

const roleAccent = {
  government: 'bg-blue-500',
  investor: 'bg-green-500',
  operator: 'bg-purple-500',
  planner: 'bg-amber-500',
};

const roleActive = {
  government: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  investor:   'bg-green-500/10 text-green-400 border border-green-500/20',
  operator:   'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  planner:    'bg-amber-500/10 text-amber-400 border border-amber-500/20',
};

export default function UserSidebar() {
  const { user } = useAuth();
  const role = user?.role || 'investor';
  const extras = roleExtras[role] || [];
  const accentBg = roleAccent[role] || 'bg-ev-blue';
  const accentText = roleColor[role] || 'text-ev-blue';
  const activeClass = roleActive[role] || 'bg-ev-blue/10 text-ev-blue border border-ev-blue/20';

  return (
    <aside className="w-64 min-h-screen bg-ev-dark-card border-r border-ev-dark-border flex flex-col">
      <div className="p-6 border-b border-ev-dark-border">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 ${accentBg} rounded-lg flex items-center justify-center`}>
            <Zap size={20} className="text-white" fill="white" />
          </div>
          <div>
            <h1 className="font-bold text-white text-lg leading-none">EVision AI</h1>
            <p className={`text-xs mt-0.5 font-medium ${accentText}`}>{roleLabel[role]}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {[...commonNav, ...extras].map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                isActive
                  ? activeClass
                  : 'text-ev-gray hover:text-white hover:bg-ev-dark-border'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-ev-dark-border">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm ${
              isActive ? accentText : 'text-ev-gray hover:text-white'
            }`
          }
        >
          <UserCircle size={18} />
          <div className="min-w-0">
            <p className="font-medium truncate">{user?.fullname}</p>
            <p className={`text-xs truncate ${accentText}/70`}>{roleLabel[role]}</p>
          </div>
        </NavLink>
      </div>
    </aside>
  );
}
