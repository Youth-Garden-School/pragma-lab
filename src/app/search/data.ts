export type StopPoint = {
  id: string
  name: string
  location: string // Ví dụ: HCM, HN, NT...
}

export type FilterOptions = {
  departureTimes: string[]
  vehicleTypes: string[]
  seatPositions: string[]
}

export const stopPoints: StopPoint[] = [
  { id: "sp1", name: "Bà Rịa", location: "Bà Rịa - Vũng Tàu" },
  { id: "sp2", name: "Vũng Tàu", location: "Bà Rịa - Vũng Tàu" },
  { id: "sp3", name: "Hồ Tràm", location: "Bà Rịa - Vũng Tàu" },
  { id: "sp4", name: "Long Hải - Phước Hải", location: "Bà Rịa - Vũng Tàu" },
  { id: "sp5", name: "Sân Bay", location: "TP. Hồ Chí Minh" },
  { id: "sp6", name: "Bến xe An Sương", location: "TP. Hồ Chí Minh" },
  { id: "sp7", name: "Trạm TC Nguyễn Thái Bình, Quận 1", location: "TP. Hồ Chí Minh" },
  { id: "sp8", name: "Trạm TC 8 Phạm Văn Hai, P2, Quận Tân Bình", location: "TP. Hồ Chí Minh" },
  { id: "sp9", name: "Bến xe Miền Tây", location: "TP. Hồ Chí Minh" },
  { id: "sp10", name: "Bến xe Miền Đông mới", location: "TP. Hồ Chí Minh" },
  { id: "sp11", name: "Trạm TC 153/62 QL13, Quận Bình Thạnh", location: "TP. Hồ Chí Minh" },
  { id: "sp12", name: "Bến xe Biên Hòa", location: "Đồng Nai" },
]

export const locations = Array.from(
  new Set(stopPoints.map((sp) => sp.location))
)

export const filterOptions = {
  departureTimes: [
    "Sáng 0h - 6h",
    "Trưa 6h - 12h",
    "Chiều 12h - 18h",
    "Tối 18h - 24h"
  ],
  vehicleTypes: ["Limousine", "Giường nằm", "Ghế ngồi"],
  seatPositions: ["Hàng ghế đầu", "Hàng ghế giữa", "Hàng ghế cuối"]
}
