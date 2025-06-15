
import React from 'react';
import { DashboardHeader } from '@/feature/Admin/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/feature/Admin/components/dashboard/DashboardSidebar';
import { UsersList } from '@/feature/Admin/components/users/UsersList';
import { SidebarProvider } from '@/components/ui/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const Users = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <DashboardSidebar activeItem="Users" />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6 space-y-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Users</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            
            <div>
              <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
              <p className="text-muted-foreground">
                Manage all users in your bus system
              </p>
            </div>
            
            <UsersList />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Users;
