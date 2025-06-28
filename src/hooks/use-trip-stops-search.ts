import { useState, useEffect, useCallback } from 'react'
import { SEARCH_CONSTANTS } from '@/shared/constants/searchConstants'

export interface TripStopLocation {
  locationId: number
  detail: string
  province: string
  tripCount: number
  isPickup?: boolean
  isDropoff?: boolean
  stopOrder?: number
}

export function useTripStopsSearch() {
  const [allLocations, setAllLocations] = useState<TripStopLocation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [pickupId, setPickupId] = useState<number | null>(null)
  const [dropoffId, setDropoffId] = useState<number | null>(null)

  // Fetch all locations ONCE on mount
  useEffect(() => {
    setLoading(true)
    fetch('/api/trip-stops/search?limit=1000')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAllLocations(data.data)
        else setError(data.error || 'Lỗi khi lấy danh sách điểm dừng')
      })
      .catch(() => setError('Lỗi kết nối API'))
      .finally(() => setLoading(false))
  }, [])

  // Set pickup/dropoff for local filtering
  const setPickupLocationId = (id: number | null) => setPickupId(id)
  const setDropoffLocationId = (id: number | null) => setDropoffId(id)

  // Filter logic: only in-memory
  const filteredLocations = useCallback(() => {
    let filtered = allLocations
    // Nếu có search query
    if (searchQuery && searchQuery.length >= SEARCH_CONSTANTS.MIN_SEARCH_LENGTH) {
      filtered = filtered.filter(
        (loc) =>
          loc.detail.toLowerCase().includes(searchQuery.toLowerCase()) ||
          loc.province.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }
    // Nếu có chọn pickup/dropoff, chỉ show các location hợp lệ
    if (pickupId && dropoffId) {
      // Chỉ show location khác pickupId nếu đang chọn dropoff, và ngược lại
      filtered = filtered.filter(
        (loc) => loc.locationId !== pickupId && loc.locationId !== dropoffId,
      )
    }
    return filtered
  }, [allLocations, searchQuery, pickupId, dropoffId])

  const getFilteredProvinces = useCallback(
    (query: string) => {
      const filtered = filteredLocations()
      const provinces = Array.from(new Set(filtered.map((loc) => loc.province)))
      if (!query || query.length < SEARCH_CONSTANTS.MIN_SEARCH_LENGTH) {
        return provinces
      }
      return provinces.filter(
        (province) =>
          province.toLowerCase().includes(query.toLowerCase()) ||
          filtered.some(
            (loc) =>
              loc.province === province && loc.detail.toLowerCase().includes(query.toLowerCase()),
          ),
      )
    },
    [filteredLocations],
  )

  const getLocationsByProvince = useCallback(
    (province: string, query: string) => {
      const filtered = filteredLocations()
      if (!query || query.length < SEARCH_CONSTANTS.MIN_SEARCH_LENGTH) {
        return filtered.filter((loc) => loc.province === province)
      }
      return filtered.filter(
        (loc) =>
          loc.province === province &&
          (loc.detail.toLowerCase().includes(query.toLowerCase()) ||
            loc.province.toLowerCase().includes(query.toLowerCase())),
      )
    },
    [filteredLocations],
  )

  return {
    locations: filteredLocations(),
    loading,
    error,
    searchQuery,
    setSearchQuery,
    getFilteredProvinces,
    getLocationsByProvince,
    setPickupLocationId,
    setDropoffLocationId,
    pickupId,
    dropoffId,
  }
}
