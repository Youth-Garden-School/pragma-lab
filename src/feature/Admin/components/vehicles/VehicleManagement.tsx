'use client'
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VehicleTypesTab } from './VehicleTypesTab';
import { VehiclesTab } from './VehiclesTab';
import { SeatConfigurationTab } from './SeatConfigurationTab';

export const VehicleManagement = () => {
  return (
    <Tabs defaultValue="types" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="types">Vehicle Types</TabsTrigger>
        <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
        <TabsTrigger value="seats">Seat Configuration</TabsTrigger>
      </TabsList>
      
      <TabsContent value="types">
        <VehicleTypesTab />
      </TabsContent>
      
      <TabsContent value="vehicles">
        <VehiclesTab />
      </TabsContent>
      
      <TabsContent value="seats">
        <SeatConfigurationTab />
      </TabsContent>
    </Tabs>
  );
};
