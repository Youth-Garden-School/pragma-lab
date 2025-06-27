import React from 'react'
import { DashboardHeader } from '@/feature/Admin/components/dashboard/DashboardHeader'
import { DashboardSidebar } from '@/feature/Admin/components/dashboard/DashboardSidebar'
import { VehicleManagement } from '@/feature/Admin/components/vehicles/VehicleManagement'
import { SidebarProvider } from '@/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

const Vehicles = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <DashboardSidebar activeItem="Vehicles" />
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
                  <BreadcrumbPage>Vehicles</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div>
              <h2 className="text-3xl font-bold tracking-tight">Vehicle Management</h2>
              <p className="text-muted-foreground">
                Manage vehicles, types and seat configurations
              </p>
            </div>

            <VehicleManagement />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default Vehicles
