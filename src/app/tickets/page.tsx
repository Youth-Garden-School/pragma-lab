import React from 'react';
import { DashboardSidebar } from '@/feature/Admin/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/feature/Admin/components/dashboard/DashboardHeader';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TicketOverview } from '@/feature/Admin/components/tickets/TicketOverview';
import { TicketsList } from '@/feature/Admin/components/tickets/TicketsList';
import { PaymentsList } from '@/feature/Admin/components/tickets/PaymentsList';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const Tickets = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <DashboardSidebar activeItem="Tickets" />
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
                  <BreadcrumbPage>Tickets</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div>
              <h2 className="text-3xl font-bold tracking-tight">Ticket Management</h2>
              <p className="text-muted-foreground">
                Manage tickets, payments, and refunds
              </p>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="tickets">All Tickets</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="refunds">Refunds</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <TicketOverview />
              </TabsContent>

              <TabsContent value="tickets">
                <TicketsList />
              </TabsContent>

              <TabsContent value="payments">
                <PaymentsList />
              </TabsContent>

              <TabsContent value="refunds">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center text-gray-500">
                      Refunds management coming soon...
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Tickets;
