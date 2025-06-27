'use client'

import React from 'react';
import { KPICards } from '@/feature/Admin/components/dashboard/KPICards';
import { RecentActivities } from '@/feature/Admin/components/dashboard/RecentActivities';
import { DashboardCharts } from '@/feature/Admin/components/dashboard/DashboardCharts';

export const DashboardContent = () => {
  return (
    <main className="flex-1 p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your bus system today.
        </p>
      </div>
      
      <KPICards />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardCharts />
        </div>
        <div className="space-y-6">
          <RecentActivities />
        </div>
      </div>
    </main>
  );
};
export default DashboardContent;