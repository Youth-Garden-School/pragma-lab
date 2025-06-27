'use client'
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Truck, 
  MapPin, 
  Route, 
  Ticket, 
  BarChart3 
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface DashboardSidebarProps {
  activeItem?: string;
}

const navigationItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Users, label: 'Users', href: '/users' },
  { icon: Truck, label: 'Vehicles', href: '/vehicles' },
  { icon: MapPin, label: 'Locations', href: '/locations' },
  { icon: Route, label: 'Trips', href: '/trips' },
  { icon: Ticket, label: 'Tickets', href: '/tickets' },
  { icon: BarChart3, label: 'Reports', href: '/reports' },
];

export const DashboardSidebar = ({ activeItem = 'Dashboard' }: DashboardSidebarProps) => {
  return (
    <Card className="w-64 h-screen rounded-none border-r border-t-0 border-l-0 border-b-0 bg-white">
      <div className="p-4 space-y-2">
        <div className="space-y-1">
          {navigationItems.slice(0, 1).map((item) => (
            <Button
              key={item.label}
              variant={activeItem === item.label ? "default" : "ghost"}
              className="w-full justify-start gap-3"
              onClick={() => window.location.href = item.href}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </div>
        
        <Separator />
        
        <div className="space-y-1">
          {navigationItems.slice(1, 5).map((item) => (
            <Button
              key={item.label}
              variant={activeItem === item.label ? "default" : "ghost"}
              className="w-full justify-start gap-3"
              onClick={() => window.location.href = item.href}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </div>
        
        <Separator />
        
        <div className="space-y-1">
          {navigationItems.slice(5).map((item) => (
            <Button
              key={item.label}
              variant={activeItem === item.label ? "default" : "ghost"}
              className="w-full justify-start gap-3"
              onClick={() => window.location.href = item.href}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};
