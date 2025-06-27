// 'use client'
// import React from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import { ArrowRight, CheckCircle, Circle, Database, Car, MapPin, Users } from 'lucide-react'

// const WORKFLOW_STEPS = [
//   {
//     id: 1,
//     title: 'Create Vehicle Type',
//     description: 'Define the type of vehicle (e.g., Bus 45 seats, Limousine 16 seats)',
//     icon: Car,
//     color: 'bg-blue-500',
//     data: {
//       name: 'Xe Bus 45 chỗ',
//       seatCapacity: 45,
//       pricePerSeat: 150000
//     },
//     api: 'POST /api/vehicletypes',
//     table: 'VehicleTypes'
//   },
//   {
//     id: 2,
//     title: 'Auto-Generate Seat Configurations',
//     description: 'Automatically create seat layout based on vehicle type capacity',
//     icon: Users,
//     color: 'bg-green-500',
//     data: {
//       vehicleTypeId: 1,
//       seatConfigurations: [
//         { seatNumber: 'A1', rowNumber: 1, columnNumber: 1 },
//         { seatNumber: 'A2', rowNumber: 1, columnNumber: 2 },
//         // ... 45 seats total
//       ]
//     },
//     api: 'POST /api/seat-configurations/bulk',
//     table: 'SeatConfigurations'
//   },
//   {
//     id: 3,
//     title: 'Create Vehicle',
//     description: 'Create a specific vehicle instance of the defined type',
//     icon: Car,
//     color: 'bg-purple-500',
//     data: {
//       licensePlate: '51A-12345',
//       vehicleTypeId: 1
//     },
//     api: 'POST /api/vehicles',
//     table: 'Vehicles'
//   },
//   {
//     id: 4,
//     title: 'Create Trip',
//     description: 'Create a journey using the specific vehicle',
//     icon: MapPin,
//     color: 'bg-orange-500',
//     data: {
//       vehicleId: 1,
//       driverId: 1,
//       tripStops: [
//         { locationId: 1, stopOrder: 1, arrivalTime: '2024-01-15T08:00:00Z', isPickup: true },
//         { locationId: 2, stopOrder: 2, arrivalTime: '2024-01-15T10:00:00Z', isPickup: false }
//       ]
//     },
//     api: 'POST /api/trip',
//     table: 'Trips + TripStops'
//   },
//   {
//     id: 5,
//     title: 'Auto-Create Trip Seats',
//     description: 'Automatically create seat instances for the trip based on vehicle type configuration',
//     icon: Database,
//     color: 'bg-red-500',
//     data: {
//       tripId: 1,
//       seatConfigurations: [
//         { seatNumber: 'A1' },
//         { seatNumber: 'A2' },
//         // ... all seats from SeatConfigurations
//       ]
//     },
//     api: 'POST /api/trip-seats',
//     table: 'TripSeats'
//   }
// ]

// export const VehicleWorkflowGuide = () => {
//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <CheckCircle className="h-5 w-5 text-green-500" />
//             Vehicle Management Workflow Guide
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-muted-foreground mb-6">
//             Follow these steps in order to properly set up vehicles and seat configurations for your transportation system.
//           </p>
          
//           <div className="space-y-4">
//             {WORKFLOW_STEPS.map((step, index) => (
//               <div key={step.id} className="relative">
//                 {/* Connection line */}
//                 {index < WORKFLOW_STEPS.length - 1 && (
//                   <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-300" />
//                 )}
                
//                 <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
//                   {/* Step number and icon */}
//                   <div className="flex-shrink-0">
//                     <div className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center text-white`}>
//                       <step.icon className="h-6 w-6" />
//                     </div>
//                   </div>
                  
//                   {/* Content */}
//                   <div className="flex-1 space-y-3">
//                     <div className="flex items-center gap-2">
//                       <Badge variant="outline">Step {step.id}</Badge>
//                       <h3 className="text-lg font-semibold">{step.title}</h3>
//                     </div>
                    
//                     <p className="text-muted-foreground">{step.description}</p>
                    
//                     {/* API and Database info */}
//                     <div className="grid grid-cols-2 gap-4 text-sm">
//                       <div>
//                         <span className="font-medium text-blue-600">API Endpoint:</span>
//                         <code className="ml-2 px-2 py-1 bg-muted rounded text-xs">
//                           {step.api}
//                         </code>
//                       </div>
//                       <div>
//                         <span className="font-medium text-green-600">Database Table:</span>
//                         <code className="ml-2 px-2 py-1 bg-muted rounded text-xs">
//                           {step.table}
//                         </code>
//                       </div>
//                     </div>
                    
//                     {/* Sample data */}
//                     <details className="group">
//                       <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800">
//                         View Sample Data
//                       </summary>
//                       <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-x-auto">
//                         {JSON.stringify(step.data, null, 2)}
//                       </pre>
//                     </details>
//                   </div>
                  
//                   {/* Arrow */}
//                   {index < WORKFLOW_STEPS.length - 1 && (
//                     <div className="flex-shrink-0 self-center">
//                       <ArrowRight className="h-5 w-5 text-gray-400" />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
      
//       {/* Quick Actions */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Quick Actions</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
//               <Car className="h-6 w-6" />
//               <span>Create Vehicle Type</span>
//               <span className="text-xs text-muted-foreground">Start here</span>
//             </Button>
            
//             <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
//               <Users className="h-6 w-6" />
//               <span>Configure Seats</span>
//               <span className="text-xs text-muted-foreground">Manage seat layout</span>
//             </Button>
            
//             <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
//               <MapPin className="h-6 w-6" />
//               <span>Create Trip</span>
//               <span className="text-xs text-muted-foreground">Schedule journey</span>
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
      
//       {/* Important Notes */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Important Notes</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-3">
//           <div className="flex items-start gap-3">
//             <Circle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
//             <div>
//               <p className="font-medium">Seat Configurations are Auto-Generated</p>
//               <p className="text-sm text-muted-foreground">
//                 When you create a new Vehicle Type, seat configurations are automatically generated based on the seat capacity.
//               </p>
//             </div>
//           </div>
          
//           <div className="flex items-start gap-3">
//             <Circle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
//             <div>
//               <p className="font-medium">Trip Seats are Created Automatically</p>
//               <p className="text-sm text-muted-foreground">
//                 When you create a Trip, trip seats are automatically created from the vehicle type's seat configurations.
//               </p>
//             </div>
//           </div>
          
//           <div className="flex items-start gap-3">
//             <Circle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
//             <div>
//               <p className="font-medium">Seat Configuration Tab is for Management</p>
//               <p className="text-sm text-muted-foreground">
//                 The Seat Configuration tab is used to view and manage seat availability, not to create new seats.
//               </p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// } 