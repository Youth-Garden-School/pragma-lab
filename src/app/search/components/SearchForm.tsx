import React, { useRef, useState, useEffect } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, X, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { StopPoint } from "../mockdata"

interface Props {
  stopPoints: StopPoint[]
  departureDate: Date
  setDepartureDate: (d: Date) => void
  adultCount: number
  setAdultCount: (v: number) => void
  childCount: number
  setChildCount: (v: number) => void
  totalTickets: number
  handleSearch: () => void
  setPickupPointId: (id: string) => void
  setDropoffPointId: (id: string) => void
}

export default function SearchForm({
  stopPoints,
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
  const [pickupQuery, setPickupQuery] = useState("")
  const [dropoffQuery, setDropoffQuery] = useState("")
  const [showPickupPopover, setShowPickupPopover] = useState(false)
  const [showDropoffPopover, setShowDropoffPopover] = useState(false)
  const [expandedPickup, setExpandedPickup] = useState<string | null>(null)
  const [expandedDropoff, setExpandedDropoff] = useState<string | null>(null)
  const [showTicketPopover, setShowTicketPopover] = useState(false)

  const pickupRef = useRef<HTMLDivElement | null>(null)
  const dropoffRef = useRef<HTMLDivElement | null>(null)

  const getFilteredLocations = (query: string) => {
    return Array.from(new Set(stopPoints.map(p => p.location))).filter(loc =>
      loc.toLowerCase().includes(query.toLowerCase()) ||
      stopPoints.some(sp => sp.location === loc && sp.name.toLowerCase().includes(query.toLowerCase()))
    )
  }

  const handlePickupSelect = (sp: StopPoint) => {
    setPickupQuery(sp.name)
    setPickupPointId(sp.id)
    setExpandedPickup(null)
    setShowPickupPopover(false)
  }

  const handleDropoffSelect = (sp: StopPoint) => {
    setDropoffQuery(sp.name)
    setDropoffPointId(sp.id)
    setExpandedDropoff(null)
    setShowDropoffPopover(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickupRef.current && !pickupRef.current.contains(event.target as Node)) setShowPickupPopover(false)
      if (dropoffRef.current && !dropoffRef.current.contains(event.target as Node)) setShowDropoffPopover(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="glass-card p-6 rounded-2xl border border-blue-500 shadow-md">
      <div className="flex flex-wrap gap-4">
        {/* Điểm đón */}
        <div className="flex-1 min-w-[200px] relative" ref={pickupRef}>
          <p className="text-sm font-medium mb-2">Điểm đón</p>
          <Input
            placeholder="Tìm điểm đón..."
            value={pickupQuery}
            onFocus={() => setShowPickupPopover(true)}
            onChange={(e) => setPickupQuery(e.target.value)}
            className="h-11 border-2"
          />
          {showPickupPopover && (
            <div className="absolute z-50 mt-1 bg-white shadow-lg border rounded-xl max-h-64 overflow-y-auto w-full">
              <div className="w-full text-left px-2 py-2 font-semibold">Tỉnh - Thành phố</div>
              {getFilteredLocations(pickupQuery).map(location => (
                <div key={location} className="border-b last:border-b-0">
                  <button
                    className="w-full text-left px-2 py-2 hover:bg-blue-50"
                    onClick={() => setExpandedPickup(prev => (prev === location ? null : location))}
                  >
                    {location}
                  </button>
                  {expandedPickup === location && (
                    <div className="pl-4 py-1 space-y-1">
                      {stopPoints
                        .filter(sp => sp.location === location && sp.name.toLowerCase().includes(pickupQuery.toLowerCase()))
                        .map(sp => (
                          <div
                            key={sp.id}
                            className="cursor-pointer px-2 py-1 hover:bg-blue-100 rounded"
                            onClick={() => handlePickupSelect(sp)}
                          >
                            {sp.name}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Điểm đến */}
        <div className="flex-1 min-w-[200px] relative" ref={dropoffRef}>
          <p className="text-sm font-medium mb-2">Điểm đến</p>
          <Input
            placeholder="Tìm điểm đến..."
            value={dropoffQuery}
            onFocus={() => setShowDropoffPopover(true)}
            onChange={(e) => setDropoffQuery(e.target.value)}
            className="h-11 border-2"
          />
          {showDropoffPopover && (
            <div className="absolute z-50 mt-1 bg-white shadow-lg border rounded-xl max-h-64 overflow-y-auto w-full">
              <div className="w-full text-left px-3 py-2 font-semibold">Tỉnh - Thành phố</div>
              {getFilteredLocations(dropoffQuery).map(location => (
                <div key={location} className="border-b last:border-b-0">
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-purple-50"
                    onClick={() => setExpandedDropoff(prev => (prev === location ? null : location))}
                  >
                    {location}
                  </button>
                  {expandedDropoff === location && (
                    <div className="pl-4 py-1 space-y-1">
                      {stopPoints
                        .filter(sp => sp.location === location && sp.name.toLowerCase().includes(dropoffQuery.toLowerCase()))
                        .map(sp => (
                          <div
                            key={sp.id}
                            className="cursor-pointer px-2 py-1 hover:bg-purple-100 rounded"
                            onClick={() => handleDropoffSelect(sp)}
                          >
                            {sp.name}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ngày đi */}
        <div className="flex-1 min-w-[200px]">
          <p className="text-sm font-medium mb-2">Ngày đi</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full h-11 text-left">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(departureDate, "dd-MM-yyyy")}
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
        <div className="flex-1 min-w-[150px]">
          <p className="text-sm font-medium mb-2">Số vé</p>
          <Popover open={showTicketPopover} onOpenChange={setShowTicketPopover}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full h-11 justify-between">
                <span>{totalTickets} vé</span>
                <X className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4 bg-white">
              <div className="mb-4">
                <p className="font-medium">Người lớn</p>
                <div className="flex gap-3 items-center mt-1">
                  <Button size="icon" onClick={() => setAdultCount(Math.max(1, adultCount - 1))}><Minus /></Button>
                  <span>{adultCount}</span>
                  <Button size="icon" onClick={() => setAdultCount(adultCount + 1)}><Plus /></Button>
                </div>
              </div>
              <div>
                <p className="font-medium">Em bé</p>
                <div className="flex gap-3 items-center mt-1">
                  <Button size="icon" onClick={() => setChildCount(Math.max(0, childCount - 1))}><Minus /></Button>
                  <span>{childCount}</span>
                  <Button size="icon" onClick={() => setChildCount(childCount + 1)}><Plus /></Button>
                </div>
              </div>
              <Button className="mt-4 w-full" onClick={() => setShowTicketPopover(false)}>Xong</Button>
            </PopoverContent>
          </Popover>
        </div>

        {/* Tìm vé */}
        <div className="flex-1 min-w-[120px]">
          <p className="text-sm font-medium mb-2">Tìm chuyến</p>
          <Button
            onClick={handleSearch}
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
          >
            Tìm vé
          </Button>
        </div>
      </div>
    </div>
  )
}
