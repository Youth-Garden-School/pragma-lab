"use client" 

import Footer from "@/components/Common/Layout/Footer"
import Header from "@/components/Common/Layout/Header"

import { useState, useRef, useEffect } from "react"
import { format, addDays } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Calendar as CalendarIcon, X, Minus, Plus } from "lucide-react"

import { mockTrips } from "./mockTrips"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import {
    filterOptions,
    stopPoints,
    StopPoint
} from "./data"

export default function Search() {
    const [showPickupPopover, setShowPickupPopover] = useState(false)
    const [pickupQuery, setPickupQuery] = useState("")
    const [expandedPickup, setExpandedPickup] = useState<string | null>(null)

    const [showDropoffPopover, setShowDropoffPopover] = useState(false)
    const [dropoffQuery, setDropoffQuery] = useState("")
    const [expandedDropoff, setExpandedDropoff] = useState<string | null>(null)

    const pickupRef = useRef<HTMLDivElement | null>(null)
    const dropoffRef = useRef<HTMLDivElement | null>(null)

    const [fromLocation, setFromLocation] = useState("")
    const [toLocation, setToLocation] = useState("")
    const [departureDate, setDepartureDate] = useState<Date>(new Date())
    const [adultCount, setAdultCount] = useState(1)
    const [childCount, setChildCount] = useState(0)
    const [showTicketPopover, setShowTicketPopover] = useState(false)
    const [activeDateIndex, setActiveDateIndex] = useState(2)

    const [pickupFilterPoints, setPickupFilterPoints] = useState<StopPoint[]>([])
    const [dropoffFilterPoints, setDropoffFilterPoints] = useState<StopPoint[]>([])

    const [selectedDepartureTimes, setSelectedDepartureTimes] = useState<string[]>([])
    const [selectedVehicleTypes, setSelectedVehicleTypes] = useState<string[]>([])
    const [selectedSeatPositions, setSelectedSeatPositions] = useState<string[]>([])
    const [selectedPickupPoints, setSelectedPickupPoints] = useState<string[]>([])
    const [selectedDropoffPoints, setSelectedDropoffPoints] = useState<string[]>([])

    const totalTickets = adultCount + childCount
    const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]
    const dateOptions = Array.from({ length: 5 }, (_, i) => addDays(departureDate, i))

    const handleSearch = () => {
        const pickupPoint = stopPoints.find(sp => sp.name === pickupQuery)
        const dropoffPoint = stopPoints.find(sp => sp.name === dropoffQuery)

        if (pickupPoint && dropoffPoint) {
            if (pickupPoint.location === dropoffPoint.location) {
                // Cùng khu vực => không hiển thị điểm nào ở bộ lọc
                setPickupFilterPoints([])
                setDropoffFilterPoints([])
                return
            }

            // Đã chọn rõ 2 điểm và khác khu vực => hiển thị chính xác 2 điểm
            setPickupFilterPoints([pickupPoint])
            setDropoffFilterPoints([dropoffPoint])
            return
        }

        // Chưa chọn rõ ràng điểm đón hoặc điểm đến => không hiển thị gì
        setPickupFilterPoints([])
        setDropoffFilterPoints([])
    }

    const [expandedTripId, setExpandedTripId] = useState<string | null>(null)
    const [selectedSeats, setSelectedSeats] = useState<string[]>([])

    const handleToggleSeat = (seatId: string) => {
        setSelectedSeats((prev) =>
            prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
        )
    }

    useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (pickupRef.current && !pickupRef.current.contains(event.target as Node)) {
        setShowPickupPopover(false)
        }
        if (dropoffRef.current && !dropoffRef.current.contains(event.target as Node)) {
        setShowDropoffPopover(false)
        }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const toggleSelection = (item: string, list: string[], setList: (val: string[]) => void) => {
    if (list.includes(item)) {
        setList(list.filter(i => i !== item))
    } else {
        setList([...list, item])
    }
    }

    const clearAllFilters = () => {
    setSelectedDepartureTimes([])
    setSelectedVehicleTypes([])
    setSelectedSeatPositions([])
    setSelectedPickupPoints([])
    setSelectedDropoffPoints([])
    }

    return (
        <main className="min-h-screen pt-[120px]">
            <Header />

            {/* Search Form */}
            <div className="pt-[60px] pb-[60px] max-w-6xl mx-auto space-y-8">
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
                        <div className="absolute z-50 mt-1 bg-white shadow-lg border rounded-xl max-h-64 overflow-y-auto w-full" >
                        <div className="w-full text-left px-2 py-2 font-semibold">
                            <p>Tỉnh - Thành phố</p>
                        </div>
                        {Array.from(new Set(stopPoints.map(p => p.location)))
                            .filter(loc =>
                            loc.toLowerCase().includes(pickupQuery.toLowerCase()) ||
                            stopPoints.some(sp =>
                                sp.location === loc && sp.name.toLowerCase().includes(pickupQuery.toLowerCase())
                            )
                            )
                            .map(location => (
                            <div key={location} className="border-b last:border-b-0">
                                <button
                                className="w-full text-left px-2 py-2 hover:bg-blue-50"
                                onClick={() =>
                                    setExpandedPickup(prev => (prev === location ? null : location))
                                }
                                >
                                {location}
                                </button>
                                {expandedPickup === location && (
                                <div className="pl-4 py-1 space-y-1">
                                    {stopPoints
                                    .filter(sp =>
                                        sp.location === location &&
                                        sp.name.toLowerCase().includes(pickupQuery.toLowerCase())
                                    )
                                    .map(sp => (
                                        <div
                                        key={sp.id}
                                        className="cursor-pointer px-2 py-1 hover:bg-blue-100 rounded"
                                        onClick={() => {
                                            setFromLocation(sp.location)
                                            setPickupQuery(sp.name)
                                            setExpandedPickup(null)
                                            setShowPickupPopover(false)
                                        }}
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
                        <div className="absolute z-50 mt-1 bg-white shadow-lg border rounded-xl max-h-64 overflow-y-auto w-full" >
                        <div className="w-full text-left px-3 py-2 font-semibold">
                            <p>Tỉnh - Thành phố</p>
                        </div>
                        {Array.from(new Set(stopPoints.map(p => p.location)))
                            .filter(loc =>
                            loc.toLowerCase().includes(dropoffQuery.toLowerCase()) ||
                            stopPoints.some(sp =>
                                sp.location === loc && sp.name.toLowerCase().includes(dropoffQuery.toLowerCase())
                            )
                            )
                            .map(location => (
                            <div key={location} className="border-b last:border-b-0">
                                <button
                                className="w-full text-left px-3 py-2 hover:bg-purple-50"
                                onClick={() =>
                                    setExpandedDropoff(prev => (prev === location ? null : location))
                                }
                                >
                                {location}
                                </button>
                                {expandedDropoff === location && (
                                <div className="pl-4 py-1 space-y-1">
                                    {stopPoints
                                    .filter(sp =>
                                        sp.location === location &&
                                        sp.name.toLowerCase().includes(dropoffQuery.toLowerCase())
                                    )
                                    .map(sp => (
                                        <div
                                        key={sp.id}
                                        className="cursor-pointer px-2 py-1 hover:bg-purple-100 rounded"
                                        onClick={() => {
                                            setToLocation(sp.location)
                                            setDropoffQuery(sp.name)
                                            setExpandedDropoff(null)
                                            setShowDropoffPopover(false)
                                        }}
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
                        <p className="text-sm font-medium mb-2">Ngày giờ đi</p>
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
                            {/* Người lớn */}
                            <div className="mb-4">
                            <p className="font-medium">Người lớn</p>
                            <div className="flex gap-3 items-center mt-1">
                                <Button size="icon" onClick={() => setAdultCount(Math.max(1, adultCount - 1))}><Minus /></Button>
                                <span>{adultCount}</span>
                                <Button size="icon" onClick={() => setAdultCount(adultCount + 1)}><Plus /></Button>
                            </div>
                            </div>
                            {/* Trẻ em */}
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
                        <Button onClick={handleSearch} className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        Tìm vé
                        </Button>
                    </div>
                    </div>
                </div>
            </div>
            
            <div className="flex max-w-6xl mx-auto gap-6 pb-10">
                {/* Cột lọc */}
                <aside className="w-64 bg-white border rounded-xl p-4 space-y-6">
                    <div className="w-full flex bg-gray-100 rounded overflow-hidden">
                        <div className="bg-gray-100 px-4 py-2 flex-1">
                            <h2 className="text-lg font-semibold">Lọc</h2>
                        </div>
                    {(selectedDepartureTimes.length > 0 || selectedVehicleTypes.length > 0 || selectedSeatPositions.length > 0 || selectedPickupPoints.length > 0 || selectedDropoffPoints.length > 0) && (
                        <button onClick={clearAllFilters} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-300 transition">Xóa lọc</button>
                    )}
                    </div>

                    <div className="w-full">
                    <p className="font-medium mb-1">Giờ đi</p>
                    <div className="grid grid-cols-2 gap-2">
                        {filterOptions.departureTimes.map((opt, i) => (
                        <Button
                            key={i}
                            variant={selectedDepartureTimes.includes(opt) ? "default" : "outline"}
                            className={selectedDepartureTimes.includes(opt) ? "bg-cyan-400 text-white hover:bg-cyan-400" : "bg-gray-100 hover:bg-gray-200"}
                            onClick={() => toggleSelection(opt, selectedDepartureTimes, setSelectedDepartureTimes)}
                        >
                            {opt}
                        </Button>
                        ))}
                    </div>
                    </div>

                    <div className="w-full">
                    <p className="font-medium mb-1">Loại xe</p>
                    {filterOptions.vehicleTypes.map((opt, i) => (
                        <label key={i} className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={selectedVehicleTypes.includes(opt)}
                            onChange={() => toggleSelection(opt, selectedVehicleTypes, setSelectedVehicleTypes)}
                        />
                        {opt}
                        </label>
                    ))}
                    </div>

                    <div className="w-full">
                    <p className="font-medium mb-1">Vị trí ghế</p>
                    {filterOptions.seatPositions.map((opt, i) => (
                        <label key={i} className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={selectedSeatPositions.includes(opt)}
                            onChange={() => toggleSelection(opt, selectedSeatPositions, setSelectedSeatPositions)}
                        />
                        {opt}
                        </label>
                    ))}
                    </div>

                    <div className="w-full">
                    <p className="font-medium mb-1">Điểm đón</p>
                    {pickupFilterPoints.map((p) => (
                        <label key={p.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={selectedPickupPoints.includes(p.name)}
                            onChange={() => toggleSelection(p.name, selectedPickupPoints, setSelectedPickupPoints)}
                        />
                        {p.name}
                        </label>
                    ))}
                    </div>

                    <div className="w-full">
                    <p className="font-medium mb-1">Điểm trả</p>
                    {dropoffFilterPoints.map((p) => (
                        <label key={p.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={selectedDropoffPoints.includes(p.name)}
                            onChange={() => toggleSelection(p.name, selectedDropoffPoints, setSelectedDropoffPoints)}
                        />
                        {p.name}
                        </label>
                    ))}
                    </div>
                </aside>


                {/* Chọn Vé */}
                <div className="flex-1 space-y-4">
                    <div className="flex gap-2 overflow-x-auto">
                    {dateOptions.map((date, i) => (
                        <Button
                        key={i}
                        variant={i === activeDateIndex ? "default" : "outline"}
                        onClick={() => setActiveDateIndex(i)}
                        >
                        {weekDays[date.getDay()]} {format(date, "dd-MM-yyyy")}
                        </Button>
                    ))}
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button variant="outline"><CalendarIcon className="w-4 h-4" /></Button>
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

                    <div className="flex flex-wrap gap-2">
                    {["Giờ đi sớm nhất", "Giờ đi muộn nhất", "Giá tăng dần", "Giá giảm dần"].map((label, i) => (
                        <Button key={i} variant="outline" className="rounded-full">{label}</Button>
                    ))}
                    </div>

                    {/* Danh sách các chuyến */}
                    {mockTrips.map((trip) => (
                    <div key={trip.id} className="bg-white border rounded-xl p-4 space-y-">
                        <div className="flex justify-between items-center">
                        <div>
                            <p className="font-semibold">{trip.vehicleType}</p>
                            <p className="text-gray-600">{trip.departureTime} → {trip.arrivalTime}</p>
                            <p className="text-sm">{trip.pickupPoint} → {trip.dropoffPoint}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm">Còn {trip.availableSeats} chỗ trống</p>
                            <p className="font-bold text-lg text-blue-600">Từ {trip.price.toLocaleString()}đ</p>
                            <Button
                            onClick={() => {
                                setExpandedTripId((prev) => (prev === trip.id ? null : trip.id))
                                setSelectedSeats([])
                            }}
                            >
                            Chọn chuyến
                            </Button>
                        </div>
                        </div>

                        {/* Hộp chọn ghế */}
                        {expandedTripId === trip.id && (
                        <div className="border-t pt-4">
                            {/* Thanh progress */}
                            <div className="flex justify-between mb-4 font-medium text-gray-600">
                            <span className="text-blue-600">1. Chỗ mong muốn</span>
                            <span>2. Điểm đón trả</span>
                            <span>3. Nhập thông tin</span>
                            </div>

                            {/* Bảng chú thích */}
                            <div className="flex gap-4 mb-2 text-sm">
                            <div className="flex items-center gap-1">
                                <div className="w-4 h-4 border bg-white" /> Còn trống
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-4 h-4 bg-gray-400" /> Ghế không bán
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-4 h-4 bg-green-500" /> Đang chọn
                            </div>
                            </div>

                            {/* Bảng chọn ghế */}
                            <div className="grid grid-cols-5 gap-2 max-w-xs">
                            {trip.seats.map((seat) => {
                                const isSelected = selectedSeats.includes(seat.id)
                                const bg =
                                seat.status === "sold"
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : isSelected
                                    ? "bg-green-500"
                                    : "bg-white hover:bg-blue-100"

                                return (
                                <button
                                    key={seat.id}
                                    disabled={seat.status === "sold"}
                                    onClick={() => handleToggleSeat(seat.id)}
                                    className={`border rounded w-10 h-10 ${bg}`}
                                >
                                    {seat.id}
                                </button>
                                )
                            })}
                            </div>

                            {/* Thông tin ghế và nút tiếp tục */}
                            <div className="flex justify-between items-center mt-4">
                            <div className="text-sm">
                                Ghế <span className="font-semibold text-blue-700">{selectedSeats.join(", ")}</span>
                            </div>
                            <Button disabled={selectedSeats.length === 0}>
                                Tiếp tục
                            </Button>
                            </div>
                        </div>
                        )}
                    </div>
                    ))}

                </div>
            </div>

            <Footer />
        </main>
    )
}
