'use client'
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Trash2, GripVertical } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { mockVehicles, mockUsers, mockLocations, Role } from '@/feature/Admin/data/mockData';
import { toast } from 'sonner';

interface CreateTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TripStop {
  id: string;
  locationId: number;
  stopOrder: number;
  arrivalTime: Date | undefined;
  departureTime: Date | undefined;
  isPickup: boolean;
}

export const CreateTripDialog = ({ open, onOpenChange }: CreateTripDialogProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    vehicleId: '',
    driverId: '',
    note: '',
    departureDate: undefined as Date | undefined,
  });
  const [tripStops, setTripStops] = useState<TripStop[]>([]);

  // Get available vehicles and drivers
  const availableVehicles = mockVehicles;
  const availableDrivers = mockUsers.filter(u => u.role === Role.employee);

  const handleAddStop = () => {
    const newStop: TripStop = {
      id: Date.now().toString(),
      locationId: 0,
      stopOrder: tripStops.length + 1,
      arrivalTime: undefined,
      departureTime: undefined,
      isPickup: tripStops.length === 0 // First stop is pickup by default
    };
    setTripStops([...tripStops, newStop]);
  };

  const handleRemoveStop = (stopId: string) => {
    setTripStops(tripStops.filter(stop => stop.id !== stopId));
  };

  const handleStopChange = (stopId: string, field: keyof TripStop, value: any) => {
    setTripStops(tripStops.map(stop => 
      stop.id === stopId ? { ...stop, [field]: value } : stop
    ));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Creating trip:', { formData, tripStops });
    toast.success('Trip created successfully');
    onOpenChange(false);
    setCurrentStep(1);
    setFormData({
      vehicleId: '',
      driverId: '',
      note: '',
      departureDate: undefined,
    });
    setTripStops([]);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      {[1, 2, 3].map((step) => (
        <React.Fragment key={step}>
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
              step <= currentStep
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-600"
            )}
          >
            {step}
          </div>
          {step < 3 && (
            <div
              className={cn(
                "w-16 h-0.5 mx-2",
                step < currentStep ? "bg-blue-600" : "bg-gray-200"
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Basic Trip Information</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vehicle">Vehicle</Label>
          <Select value={formData.vehicleId} onValueChange={(value) => setFormData({...formData, vehicleId: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select vehicle" />
            </SelectTrigger>
            <SelectContent>
              {availableVehicles.map((vehicle) => (
                <SelectItem key={vehicle.vehicleId} value={vehicle.vehicleId.toString()}>
                  <div className="flex flex-col">
                    <span>{vehicle.licensePlate}</span>
                    <span className="text-sm text-gray-500">{vehicle.vehicleType?.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="driver">Driver</Label>
          <Select value={formData.driverId} onValueChange={(value) => setFormData({...formData, driverId: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select driver" />
            </SelectTrigger>
            <SelectContent>
              {availableDrivers.map((driver) => (
                <SelectItem key={driver.userId} value={driver.userId.toString()}>
                  <div className="flex flex-col">
                    <span>{driver.name}</span>
                    <span className="text-sm text-gray-500">{driver.phone}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="departureDate">Departure Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.departureDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.departureDate ? format(formData.departureDate, "PPP") : "Select departure date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.departureDate}
              onSelect={(date) => setFormData({...formData, departureDate: date})}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">Notes</Label>
        <Textarea
          id="note"
          placeholder="Add any notes about this trip..."
          value={formData.note}
          onChange={(e) => setFormData({...formData, note: e.target.value})}
          rows={3}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Trip Stops</h3>
        <Button onClick={handleAddStop} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Stop
        </Button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {tripStops.map((stop, index) => (
          <Card key={stop.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <CardTitle className="text-sm">Stop {index + 1}</CardTitle>
                  <Badge variant={stop.isPickup ? "default" : "secondary"}>
                    {stop.isPickup ? "Pickup" : "Drop-off"}
                  </Badge>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleRemoveStop(stop.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select 
                    value={stop.locationId.toString()} 
                    onValueChange={(value) => handleStopChange(stop.id, 'locationId', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockLocations.map((location) => (
                        <SelectItem key={location.locationId} value={location.locationId.toString()}>
                          <div className="flex flex-col">
                            <span>{location.detail}</span>
                            <span className="text-sm text-gray-500">{location.province}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Stop Type</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`pickup-${stop.id}`}
                      checked={stop.isPickup}
                      onCheckedChange={(checked) => handleStopChange(stop.id, 'isPickup', checked)}
                    />
                    <Label htmlFor={`pickup-${stop.id}`}>Pickup Location</Label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Arrival Time</Label>
                  <Input
                    type="time"
                    value={stop.arrivalTime ? format(stop.arrivalTime, 'HH:mm') : ''}
                    onChange={(e) => {
                      if (e.target.value) {
                        const [hours, minutes] = e.target.value.split(':');
                        const date = new Date();
                        date.setHours(parseInt(hours), parseInt(minutes));
                        handleStopChange(stop.id, 'arrivalTime', date);
                      }
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Departure Time</Label>
                  <Input
                    type="time"
                    value={stop.departureTime ? format(stop.departureTime, 'HH:mm') : ''}
                    onChange={(e) => {
                      if (e.target.value) {
                        const [hours, minutes] = e.target.value.split(':');
                        const date = new Date();
                        date.setHours(parseInt(hours), parseInt(minutes));
                        handleStopChange(stop.id, 'departureTime', date);
                      }
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {tripStops.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No stops added yet. Click "Add Stop" to create your first stop.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Review & Confirm</h3>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Trip Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Vehicle</Label>
              <p className="text-sm text-gray-600">
                {availableVehicles.find(v => v.vehicleId.toString() === formData.vehicleId)?.licensePlate || 'Not selected'}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Driver</Label>
              <p className="text-sm text-gray-600">
                {availableDrivers.find(d => d.userId.toString() === formData.driverId)?.name || 'Not selected'}
              </p>
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium">Departure Date</Label>
            <p className="text-sm text-gray-600">
              {formData.departureDate ? format(formData.departureDate, 'PPP') : 'Not selected'}
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium">Notes</Label>
            <p className="text-sm text-gray-600">{formData.note || 'No notes'}</p>
          </div>

          <div>
            <Label className="text-sm font-medium">Trip Stops ({tripStops.length})</Label>
            <div className="space-y-2 mt-1">
              {tripStops.map((stop, index) => {
                const location = mockLocations.find(l => l.locationId === stop.locationId);
                return (
                  <div key={stop.id} className="flex items-center justify-between text-sm">
                    <span>{index + 1}. {location?.detail || 'Unknown location'}</span>
                    <Badge variant={stop.isPickup ? "default" : "secondary"} className="text-xs">
                      {stop.isPickup ? "Pickup" : "Drop-off"}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Trip</DialogTitle>
        </DialogHeader>

        {renderStepIndicator()}

        <div className="min-h-[400px]">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        <div className="flex justify-between pt-4">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {currentStep < 3 ? (
              <Button onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                Create Trip
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
