'use client';
import DashboardCard from '@/app/components/Dashboard/DashboardCard';
import OverdueAlerts from '@/app/components/Dashboard/OverdueAlerts';
import RecentOrder from '@/app/components/Dashboard/RecentOrder';
import TeamPerformance from '@/app/components/Dashboard/TeamPerformance';
import WorkflowOverview from '@/app/components/Dashboard/WorkflowOverview';
import React from 'react';

export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8">
      <DashboardCard />
      <RecentOrder />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <WorkflowOverview />
        <TeamPerformance />
      </div>
      <OverdueAlerts />
    </div>
  );
}