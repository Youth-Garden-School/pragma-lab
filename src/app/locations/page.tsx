
import React from 'react';
import { DashboardHeader } from '@/feature/Admin/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/feature/Admin/components/dashboard/DashboardSidebar';
import { LocationsList } from '@/feature/Admin/components/locations/LocationsList';
import { SidebarProvider } from '@/components/ui/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const Locations = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <DashboardSidebar activeItem="Locations" />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6 space-y-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Locations</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Location Management</h2>
              <p className="text-muted-foreground">
                Manage all bus stations and terminals in your system
              </p>
            </div>
            
            <LocationsList />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Locations;
