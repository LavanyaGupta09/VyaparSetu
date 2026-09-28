import React from 'react';
import { useUserRole } from '../context/UserRoleContext';
import EntrepreneurDashboard from './EntrepreneurDashboard';
import OfficerDashboard from './OfficerDashboard';

const DashboardRouter = () => {
  const { role } = useUserRole();

  return role === 'officer' ? <OfficerDashboard /> : <EntrepreneurDashboard />;
};

export default DashboardRouter;
