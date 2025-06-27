import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import React from 'react'
import { MapPin, Clock, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Trip, PickupDropPoint, TripStop } from '../../mockTrips'

interface PickupDropStepProps {
  pickupPoints: any[]
  dropoffPoints: any[]
  selectedPickup: string
  selectedDropoff: string
  onSelectPickup: (tripStopId: string) => void
  onSelectDropoff: (tripStopId: string) => void
  onNext: () => void
}

export default function PickupDropStep({
  pickupPoints,
  dropoffPoints,
  selectedPickup,
  selectedDropoff,
  onSelectPickup,
  onSelectDropoff,
  onNext,
}: PickupDropStepProps) {
  
  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatDate = (timeString: string) => {
    return new Date(timeString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit'
    })
  }

  const isStepComplete = selectedPickup && selectedDropoff

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">Chọn điểm đón và điểm trả</h3>
        <p className="text-sm text-gray-600">Vui lòng chọn điểm đón và điểm trả cho chuyến đi của bạn</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Điểm đón */}
        <Card className="border-2 border-dashed border-gray-200 hover:border-[#06b6d4] transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-[#06b6d4]">
              <MapPin className="w-5 h-5" />
              Điểm đón
              {selectedPickup && (
                <Badge variant="outline" className="ml-auto border-green-500 text-green-600">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Đã chọn
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <RadioGroup
              value={selectedPickup}
              onValueChange={onSelectPickup}
              className="space-y-3"
            >
              {pickupPoints.map((point) => (
                <div key={point.tripStopId || point.arrivalTime} className="space-y-2">
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-[#06b6d4]/5 hover:border-[#06b6d4] transition-all cursor-pointer">
                    <RadioGroupItem 
                      value={String(point.tripStopId)} 
                      id={`pickup-${point.tripStopId}`}
                      className="border-[#06b6d4] text-[#06b6d4]"
                    />
                    <Label 
                      htmlFor={`pickup-${point.tripStopId}`} 
                      className="flex-1 cursor-pointer space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">
                          {point.location?.detail}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {formatDate(point.arrivalTime)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>Khởi hành: {formatTime(point.departureTime)}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {point.location?.province}
                      </div>
                    </Label>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Điểm trả */}
        <Card className="border-2 border-dashed border-gray-200 hover:border-[#06b6d4] transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-[#06b6d4]">
              <MapPin className="w-5 h-5" />
              Điểm trả
              {selectedDropoff && (
                <Badge variant="outline" className="ml-auto border-green-500 text-green-600">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Đã chọn
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <RadioGroup
              value={selectedDropoff}
              onValueChange={onSelectDropoff}
              className="space-y-3"
            >
              {dropoffPoints.map((point) => (
                <div key={point.tripStopId || point.arrivalTime} className="space-y-2">
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-[#06b6d4]/5 hover:border-[#06b6d4] transition-all cursor-pointer">
                    <RadioGroupItem 
                      value={String(point.tripStopId)} 
                      id={`dropoff-${point.tripStopId}`}
                      className="border-[#06b6d4] text-[#06b6d4]"
                    />
                    <Label 
                      htmlFor={`dropoff-${point.tripStopId}`} 
                      className="flex-1 cursor-pointer space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">
                          {point.location?.detail}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {formatDate(point.arrivalTime)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>Đến nơi: {formatTime(point.arrivalTime)}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {point.location?.province}
                      </div>
                    </Label>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </div>

      {/* Summary khi đã chọn đủ */}
      {isStepComplete && (
        <Card className="bg-[#06b6d4]/5 border-[#06b6d4]/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <CheckCircle2 className="w-5 h-5 text-[#06b6d4]" />
                <div className="text-sm">
                  <span className="font-medium text-gray-900">Lộ trình đã chọn:</span>
                  <div className="flex items-center gap-2 mt-1 text-gray-600">
                    <span>
                      {pickupPoints.find(p => String(p.tripStopId) === selectedPickup)?.location?.detail}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                    <span>
                      {dropoffPoints.find(p => String(p.tripStopId) === selectedDropoff)?.location?.detail}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Button */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          onClick={onNext}
          disabled={!isStepComplete}
          className={`min-w-[120px] ${
            isStepComplete
              ? 'bg-[#06b6d4] hover:bg-[#0891b2] text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-300 cursor-not-allowed'
          } transition-all duration-200`}
        >
          {isStepComplete ? (
            <>
              Tiếp tục
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          ) : (
            'Vui lòng chọn điểm đón và trả'
          )}
        </Button>
      </div>
    </div>
  )
}