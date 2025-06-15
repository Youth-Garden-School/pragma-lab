import React from 'react';
import { DashboardHeader } from '@/feature/Admin/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/feature/Admin/components/dashboard/DashboardSidebar';
import { DashboardContent } from '@/feature/Admin/components/dashboard/DashboardContent';
import { SidebarProvider } from '@/components/ui/sidebar';

const AdminPage = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <DashboardContent />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminPage;
