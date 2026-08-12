import React from 'react';
import { ProjectMetricsWidget } from './ProjectMetricsWidget';
import { AAMCProject } from '../../types';

interface DashboardMetricsCardProps {
  project: AAMCProject;
  onNavigate: (view: any) => void;
}

export const DashboardMetricsCard: React.FC<DashboardMetricsCardProps> = (props) => {
  return <ProjectMetricsWidget {...props} />;
};
