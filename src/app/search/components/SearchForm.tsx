import React, { useRef, useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, X, Minus, Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useTripStopsSearch, TripStopLocation } from '@/hooks/use-trip-stops-search'
import { SEARCH_CONSTANTS } from '@/shared/constants/searchConstants'

interface Props {
  departureDate: Date
  setDepartureDate: (d: Date) => void
  adultCount: number
  setAdultCount: (v: number) => void
  childCount: number
  setChildCount: (v: number) => void
  totalTickets: number
  handleSearch: () => void
  setPickupPointId: (id: string | number) => void
  setDropoffPointId: (id: string | number) => void
}

export default function SearchForm({
  departureDate,
  setDepartureDate,
  adultCount,
  setAdultCount,
  childCount,
  setChildCount,
  totalTickets,
  handleSearch,
  setPickupPointId,
  setDropoffPointId,
}: Props) {
  const [pickupQuery, setPickupQuery] = useState('')
  const [dropoffQuery, setDropoffQuery] = useState('')
  const [showPickupPopover, setShowPickupPopover] = useState(false)
  const [showDropoffPopover, setShowDropoffPopover] = useState(false)
  const [expandedPickup, setExpandedPickup] = useState<string | null>(null)
  const [expandedDropoff, setExpandedDropoff] = useState<string | null>(null)
  const [showTicketPopover, setShowTicketPopover] = useState(false)

  const pickupRef = useRef<HTMLDivElement | null>(null)
  const dropoffRef = useRef<HTMLDivElement | null>(null)

  // Use the new search hook (local only)
  const {
    locations: pickupLocations,
    loading: pickupLoading,
    getFilteredProvinces: getPickupProvinces,
    getLocationsByProvince: getPickupLocationsByProvince,
    setPickupLocationId,
    setDropoffLocationId,
    pickupId,
    dropoffId,
    searchQuery,
    setSearchQuery,
  } = useTripStopsSearch()

  // Khi chọn điểm đón
  const handlePickupSelect = (location: TripStopLocation) => {
    if (dropoffId === location.locationId) {
      alert('Điểm đón và điểm trả không được trùng nhau!')
      return
    }
    setPickupQuery(location.detail)
    setPickupPointId(location.locationId)
    setPickupLocationId(location.locationId)
    setExpandedPickup(null)
    setShowPickupPopover(false)
    setSearchQuery('')
  }

  // Khi chọn điểm trả
  const handleDropoffSelect = (location: TripStopLocation) => {
    if (pickupId === location.locationId) {
      alert('Điểm đón và điểm trả không được trùng nhau!')
      return
    }
    setDropoffQuery(location.detail)
    setDropoffPointId(location.locationId)
    setDropoffLocationId(location.locationId)
    setExpandedDropoff(null)
    setShowDropoffPopover(false)
    setSearchQuery('')
  }

  // Focus chỉ mở popover, không gọi lại API
  const handlePickupFocus = () => {
    setShowPickupPopover(true)
  }
  const handleDropoffFocus = () => {
    setShowDropoffPopover(true)
  }

  // Search chỉ filter local
  const handlePickupChange = (value: string) => {
    setPickupQuery(value)
    setSearchQuery(value)
  }
  const handleDropoffChange = (value: string) => {
    setDropoffQuery(value)
    setSearchQuery(value)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickupRef.current && !pickupRef.current.contains(event.target as Node))
        setShowPickupPopover(false)
      if (dropoffRef.current && !dropoffRef.current.contains(event.target as Node))
        setShowDropoffPopover(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="glass-card p-6 rounded-2xl border border-blue-500 shadow-md">
      <div className="flex flex-wrap gap-4">
        {/* Điểm đón */}
        <div className={`flex-1 ${SEARCH_CONSTANTS.MIN_INPUT_WIDTH} relative`} ref={pickupRef}>
          <p className="text-sm font-medium mb-2">{SEARCH_CONSTANTS.LABELS.PICKUP_POINT}</p>
          <Input
            placeholder={SEARCH_CONSTANTS.PLACEHOLDERS.PICKUP_SEARCH}
            value={pickupQuery}
            onFocus={handlePickupFocus}
            onChange={(e) => handlePickupChange(e.target.value)}
            className={SEARCH_CONSTANTS.INPUT_HEIGHT + ' border-2'}
          />
          {showPickupPopover && (
            <div
              className={`absolute z-50 mt-1 bg-white shadow-lg border rounded-xl ${SEARCH_CONSTANTS.POPOVER_MAX_HEIGHT} overflow-y-auto w-full`}
            >
              <div className="w-full text-left px-2 py-2 font-semibold">
                {SEARCH_CONSTANTS.LABELS.PROVINCE_CITY}
              </div>
              {pickupLoading ? (
                <div className="px-2 py-4 text-center text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                  Đang tải dữ liệu...
                </div>
              ) : (
                getPickupProvinces(pickupQuery).map((province) => (
                  <div key={province} className="border-b last:border-b-0">
                    <button
                      className={`w-full text-left px-2 py-2 ${SEARCH_CONSTANTS.PICKUP_HOVER_COLOR}`}
                      onClick={() =>
                        setExpandedPickup((prev) => (prev === province ? null : province))
                      }
                    >
                      {province}
                    </button>
                    {expandedPickup === province && (
                      <div className="pl-4 py-1 space-y-1">
                        {getPickupLocationsByProvince(province, pickupQuery).map((location) => (
                          <div
                            key={location.locationId}
                            className={`cursor-pointer px-2 py-1 ${SEARCH_CONSTANTS.PICKUP_CHILD_HOVER_COLOR} rounded`}
                            onClick={() => handlePickupSelect(location)}
                          >
                            {location.detail}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Điểm đến */}
        <div className={`flex-1 ${SEARCH_CONSTANTS.MIN_INPUT_WIDTH} relative`} ref={dropoffRef}>
          <p className="text-sm font-medium mb-2">{SEARCH_CONSTANTS.LABELS.DROPOFF_POINT}</p>
          <Input
            placeholder={SEARCH_CONSTANTS.PLACEHOLDERS.DROPOFF_SEARCH}
            value={dropoffQuery}
            onFocus={handleDropoffFocus}
            onChange={(e) => handleDropoffChange(e.target.value)}
            className={SEARCH_CONSTANTS.INPUT_HEIGHT + ' border-2'}
          />
          {showDropoffPopover && (
            <div
              className={`absolute z-50 mt-1 bg-white shadow-lg border rounded-xl ${SEARCH_CONSTANTS.POPOVER_MAX_HEIGHT} overflow-y-auto w-full`}
            >
              <div className="w-full text-left px-3 py-2 font-semibold">
                {SEARCH_CONSTANTS.LABELS.PROVINCE_CITY}
              </div>
              {pickupLoading ? (
                <div className="px-2 py-4 text-center text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                  Đang tải dữ liệu...
                </div>
              ) : (
                getPickupProvinces(dropoffQuery).map((province) => (
                  <div key={province} className="border-b last:border-b-0">
                    <button
                      className={`w-full text-left px-3 py-2 ${SEARCH_CONSTANTS.DROPOFF_HOVER_COLOR}`}
                      onClick={() =>
                        setExpandedDropoff((prev) => (prev === province ? null : province))
                      }
                    >
                      {province}
                    </button>
                    {expandedDropoff === province && (
                      <div className="pl-4 py-1 space-y-1">
                        {getPickupLocationsByProvince(province, dropoffQuery).map((location) => (
                          <div
                            key={location.locationId}
                            className={`cursor-pointer px-2 py-1 ${SEARCH_CONSTANTS.DROPOFF_CHILD_HOVER_COLOR} rounded`}
                            onClick={() => handleDropoffSelect(location)}
                          >
                            {location.detail}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Ngày đi */}
        <div className={`flex-1 ${SEARCH_CONSTANTS.MIN_INPUT_WIDTH}`}>
          <p className="text-sm font-medium mb-2">{SEARCH_CONSTANTS.LABELS.DEPARTURE_DATE}</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full ${SEARCH_CONSTANTS.INPUT_HEIGHT} text-left`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(departureDate, 'dd-MM-yyyy')}
                <X className="ml-auto h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white">
              <Calendar
                mode="single"
                selected={departureDate}
                onSelect={(date) => date && setDepartureDate(date)}
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Số vé */}
        <div className={`flex-1 ${SEARCH_CONSTANTS.MIN_TICKET_WIDTH}`}>
          <p className="text-sm font-medium mb-2">{SEARCH_CONSTANTS.LABELS.TICKET_COUNT}</p>
          <Popover open={showTicketPopover} onOpenChange={setShowTicketPopover}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full ${SEARCH_CONSTANTS.INPUT_HEIGHT} justify-between`}
              >
                <span>{totalTickets} vé</span>
                <X className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4 bg-white">
              <div className="mb-4">
                <p className="font-medium">{SEARCH_CONSTANTS.LABELS.ADULT}</p>
                <div className="flex gap-3 items-center mt-1">
                  <Button
                    size="icon"
                    onClick={() =>
                      setAdultCount(Math.max(SEARCH_CONSTANTS.MIN_ADULT_COUNT, adultCount - 1))
                    }
                  >
                    <Minus />
                  </Button>
                  <span>{adultCount}</span>
                  <Button
                    size="icon"
                    onClick={() =>
                      setAdultCount(
                        Math.min(SEARCH_CONSTANTS.MAX_TICKETS - childCount, adultCount + 1),
                      )
                    }
                  >
                    <Plus />
                  </Button>
                </div>
              </div>
              <div>
                <p className="font-medium">{SEARCH_CONSTANTS.LABELS.CHILD}</p>
                <div className="flex gap-3 items-center mt-1">
                  <Button
                    size="icon"
                    onClick={() =>
                      setChildCount(Math.max(SEARCH_CONSTANTS.MIN_CHILD_COUNT, childCount - 1))
                    }
                  >
                    <Minus />
                  </Button>
                  <span>{childCount}</span>
                  <Button
                    size="icon"
                    onClick={() =>
                      setChildCount(
                        Math.min(SEARCH_CONSTANTS.MAX_TICKETS - adultCount, childCount + 1),
                      )
                    }
                  >
                    <Plus />
                  </Button>
                </div>
              </div>
              <Button className="mt-4 w-full" onClick={() => setShowTicketPopover(false)}>
                {SEARCH_CONSTANTS.LABELS.DONE}
              </Button>
            </PopoverContent>
          </Popover>
        </div>

        {/* Tìm vé */}
        <div className={`flex-1 ${SEARCH_CONSTANTS.MIN_SEARCH_WIDTH}`}>
          <p className="text-sm font-medium mb-2">{SEARCH_CONSTANTS.LABELS.SEARCH_TRIP}</p>
          <Button
            onClick={handleSearch}
            disabled={!pickupId || !dropoffId}
            className={`w-full ${SEARCH_CONSTANTS.INPUT_HEIGHT} bg-gradient-to-r from-blue-600 to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {SEARCH_CONSTANTS.LABELS.SEARCH_BUTTON}
          </Button>
        </div>
      </div>
    </div>
  )
}
