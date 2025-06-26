import { useEffect, useState } from 'react'

export interface Location {
  locationId: number
  detail: string
  province: string
}

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch('/api/locations?limit=100')
      .then(async (res) => {
        const data = await res.json()
        if (data.success) {
          setLocations(data.data)
        } else {
          setError(data.error || 'Lỗi khi lấy danh sách điểm dừng')
        }
      })
      .catch(() => setError('Lỗi kết nối API'))
      .finally(() => setLoading(false))
  }, [])

  return { locations, loading, error }
}
