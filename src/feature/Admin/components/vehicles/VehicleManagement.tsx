'use client'
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VehicleTypesTab } from './VehicleTypesTab';
import { VehiclesTab } from './VehiclesTab';
import { SeatConfigurationTab } from './SeatConfigurationTab';
import { VehicleWorkflowGuide } from './VehicleWorkflowGuide';

export const VehicleManagement = () => {
  return (
    <Tabs defaultValue="workflow" className="space-y-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="workflow">Workflow Guide</TabsTrigger>
        <TabsTrigger value="types">Vehicle Types</TabsTrigger>
        <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
        <TabsTrigger value="seats">Seat Configuration</TabsTrigger>
      </TabsList>
      
      <TabsContent value="workflow">
        <VehicleWorkflowGuide />
      </TabsContent>
      
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

