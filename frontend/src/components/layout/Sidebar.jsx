import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Brain, Settings, Zap } from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/map', icon: Map, label: 'Map' },
  { to: '/insights', icon: Brain, label: 'AI Insights' },
  { to: '/admin', icon: Settings, label: 'Admin' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-ev-dark-card border-r border-ev-dark-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-ev-dark-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-ev-blue rounded-lg flex items-center justify-center">
            <Zap size={20} className="text-white" fill="white" />
          </div>
          <div>
            <h1 className="font-bold text-white text-lg leading-none">EVision AI</h1>
            <p className="text-ev-gray text-xs mt-0.5">EV Infrastructure</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                isActive
                  ? 'bg-ev-blue/10 text-ev-blue border border-ev-blue/20'
                  : 'text-ev-gray hover:text-white hover:bg-ev-dark-border'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer tag */}
      <div className="p-4 border-t border-ev-dark-border">
        <p className="text-xs text-ev-gray text-center">Nigeria EV Planning Platform</p>
      </div>
    </aside>
  );
}
