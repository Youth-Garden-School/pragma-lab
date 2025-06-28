'use client'

import Header from '@/components/Common/Layout/Header'
import Footer from '@/components/Common/Layout/Footer'
import SearchForm from './components/SearchForm'
import FilterSidebar from './components/FilterSidebar'
import DateCarousel from './components/DateCarousel'
import SortOptions from './components/SortOptions'
import TripCard from './components/TripCard/TripCard'

import { useState, useEffect } from 'react'
import { SEARCH_CONSTANTS } from '@/shared/constants/searchConstants'

export default function SearchPage() {
  const [departureDate, setDepartureDate] = useState(new Date())
  const [adultCount, setAdultCount] = useState<number>(SEARCH_CONSTANTS.DEFAULT_ADULT_COUNT)
  const [childCount, setChildCount] = useState<number>(SEARCH_CONSTANTS.DEFAULT_CHILD_COUNT)
  const totalTickets = adultCount + childCount

  const [pickupPointId, setPickupPointId] = useState('')
  const [dropoffPointId, setDropoffPointId] = useState('')

  const [selectedDepartureTimes, setSelectedDepartureTimes] = useState<string[]>([])
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState<string[]>([])
  const [selectedSeatPositions, setSelectedSeatPositions] = useState<string[]>([])
  const [selectedPickupPoints, setSelectedPickupPoints] = useState<string[]>([])
  const [selectedDropoffPoints, setSelectedDropoffPoints] = useState<string[]>([])

  const [expandedTripId, setExpandedTripId] = useState<string | null>(null)

  const [trips, setTrips] = useState<any[]>([])
  const [loadingTrips, setLoadingTrips] = useState(false)

  const fetchTrips = async () => {
    if (!pickupPointId || !dropoffPointId) {
      setTrips([])
      return
    }
    setLoadingTrips(true)
    try {
      const params: any = {
        departureDate: departureDate.toISOString().split('T')[0],
        pickupPointId,
        dropoffPointId,
      }
      const query = new URLSearchParams(params).toString()
      const res = await fetch(`/api/trip?${query}`)
      const data = await res.json()
      setTrips(data.data?.items || [])
    } catch (err: any) {
      console.error(err)
    } finally {
      setLoadingTrips(false)
    }
  }

  const handleSearch = () => {
    fetchTrips()
  }

  useEffect(() => {
    fetchTrips()
  }, [pickupPointId, dropoffPointId, departureDate])

  const onToggle = (item: string, list: string[], setList: (val: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item))
    } else {
      setList([...list, item])
    }
  }

  const clearAll = () => {
    setSelectedDepartureTimes([])
    setSelectedVehicleTypes([])
    setSelectedSeatPositions([])
    setSelectedPickupPoints([])
    setSelectedDropoffPoints([])
  }

  const dateOptions = Array.from({ length: SEARCH_CONSTANTS.DATE_OPTIONS_COUNT }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return date
  })

  const [activeDateIndex, setActiveDateIndex] = useState<number | null>(() => {
    return dateOptions.findIndex((d) => d.toDateString() === departureDate.toDateString())
  })

  const [activeSort, setActiveSort] = useState<string | null>(null)

  return (
    <main className="min-h-screen pt-[120px]">
      <Header />
      <div className="pt-[60px] pb-[60px] max-w-6xl mx-auto space-y-8">
        <SearchForm
          departureDate={departureDate}
          setDepartureDate={setDepartureDate}
          adultCount={adultCount}
          setAdultCount={setAdultCount}
          childCount={childCount}
          setChildCount={setChildCount}
          totalTickets={totalTickets}
          handleSearch={handleSearch}
          setPickupPointId={(id: string | number) => setPickupPointId(String(id))}
          setDropoffPointId={(id: string | number) => setDropoffPointId(String(id))}
        />
      </div>
      <div className="flex max-w-6xl mx-auto gap-6 pb-10">
        <FilterSidebar
          selectedDepartureTimes={selectedDepartureTimes}
          selectedVehicleTypes={selectedVehicleTypes}
          selectedSeatPositions={selectedSeatPositions}
          selectedPickupPoints={selectedPickupPoints}
          selectedDropoffPoints={selectedDropoffPoints}
          pickupFilterPoints={[]}
          dropoffFilterPoints={[]}
          onToggle={onToggle}
          clearAll={clearAll}
          setSelectedDepartureTimes={setSelectedDepartureTimes}
          setSelectedVehicleTypes={setSelectedVehicleTypes}
          setSelectedSeatPositions={setSelectedSeatPositions}
          setSelectedPickupPoints={setSelectedPickupPoints}
          setSelectedDropoffPoints={setSelectedDropoffPoints}
        />

        <div className="flex-1 space-y-4">
          <div className="text-cyan-400 font-bold text-xl text-center mt-2 mb-4">
            Dịch vụ xe liên tỉnh DATVEXE
          </div>
          <DateCarousel
            dateOptions={dateOptions}
            departureDate={departureDate}
            setDepartureDate={setDepartureDate}
            activeDateIndex={activeDateIndex}
            setActiveDateIndex={setActiveDateIndex}
          />
          <SortOptions
            sortOptions={[...SEARCH_CONSTANTS.SORT_OPTIONS]}
            activeSort={activeSort}
            setActiveSort={setActiveSort}
          />

          {loadingTrips ? (
            <div className="text-center py-8 text-blue-500 font-semibold">Đang tìm chuyến...</div>
          ) : trips.length === 0 ? (
            <div>Không có chuyến nào phù hợp.</div>
          ) : (
            trips.map((trip) => (
              <TripCard
                key={trip.tripId}
                trip={trip}
                expandedTripId={expandedTripId}
                setExpandedTripId={setExpandedTripId}
              />
            ))
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}
