import { useAuth } from '../../context/AuthContext';
import GovernmentDashboard from './GovernmentDashboard';
import InvestorDashboard from './InvestorDashboard';
import OperatorDashboard from './OperatorDashboard';
import PlannerDashboard from './PlannerDashboard';
// Fallback to the generic dashboard for unknown roles
import Dashboard from '../Dashboard';

export default function RoleDashboard() {
  const { user } = useAuth();
  switch (user?.role) {
    case 'government': return <GovernmentDashboard />;
    case 'investor':   return <InvestorDashboard />;
    case 'operator':   return <OperatorDashboard />;
    case 'planner':    return <PlannerDashboard />;
    default:           return <Dashboard />;
  }
}
