export type StopPoint = {
  id: string;
  name: string;
  location: string;
};

export type FilterOptions = {
  departureTimes: string[];
  vehicleTypes: string[];
  seatPositions: string[];
};

export const stopPoints: StopPoint[] = [
  { id: "sp1", name: "(VIP)BX Vũng Tàu", location: "Bà Rịa - Vũng Tàu" },
  { id: "sp2", name: "Ngã 3 Long Sơn", location: "Bà Rịa - Vũng Tàu" },
  { id: "sp3", name: "Ngã 3 Hội Bài", location: "Bà Rịa - Vũng Tàu" },
  { id: "sp4", name: "Chợ Phước Lộc", location: "Bà Rịa - Vũng Tàu" },

  { id: "sp5", name: "Sân bay", location: "TP. Hồ Chí Minh" },
  { id: "sp6", name: "Công viên Lê Văn Tám", location: "TP. Hồ Chí Minh" },
  { id: "sp7", name: "Đối diện 8 Phạm Văn Hai", location: "TP. Hồ Chí Minh" },

  // Dự phòng cho lọc thêm
  { id: "sp8", name: "Trạm TC 8 Phạm Văn Hai, P2, Quận Tân Bình", location: "TP. Hồ Chí Minh" },
  { id: "sp9", name: "Trạm TC Nguyễn Thái Bình, Quận 1", location: "TP. Hồ Chí Minh" },
  { id: "sp10", name: "Bến xe An Sương", location: "TP. Hồ Chí Minh" },
  { id: "sp11", name: "Bến xe Miền Đông mới", location: "TP. Hồ Chí Minh" },
  { id: "sp12", name: "Bến xe Biên Hòa", location: "Đồng Nai" }
];

export const locations = Array.from(new Set(stopPoints.map((sp) => sp.location)));

export const filterOptions: FilterOptions = {
  departureTimes: [
    "Sáng 0h - 6h",
    "Trưa 6h - 12h",
    "Chiều 12h - 18h",
    "Tối 18h - 24h"
  ],
  vehicleTypes: ["Limousine 10C", "Limousine 18C", "Giường nằm"],
  seatPositions: ["Hàng ghế đầu", "Hàng ghế giữa", "Hàng ghế cuối"]
};
