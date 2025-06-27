import { VehicleType } from "./mockTrips";

export interface Location {
  locationId: number;
  detail: string;
  province: string;
}
export type FilterOptions = {
  departureTimes: string[];
  vehicleTypes: { name: string }[];
  seatPositions: string[];
};

export const stopPoints: Location[] = [
  { locationId: 1, detail: "(VIP)BX Vũng Tàu", province: "Bà Rịa - Vũng Tàu" },
  { locationId: 2, detail: "Ngã 3 Long Sơn", province: "Bà Rịa - Vũng Tàu" },
  { locationId: 3, detail: "Ngã 3 Hội Bài", province: "Bà Rịa - Vũng Tàu" },
  { locationId: 4, detail: "Chợ Phước Lộc", province: "Bà Rịa - Vũng Tàu" },

  { locationId: 5, detail: "Sân bay", province: "TP. Hồ Chí Minh" },
  { locationId: 6, detail: "Công viên Lê Văn Tám", province: "TP. Hồ Chí Minh" },
  { locationId: 7, detail: "Đối diện 8 Phạm Văn Hai", province: "TP. Hồ Chí Minh" },

  // Dự phòng cho lọc thêm
  { locationId: 8, detail: "Trạm TC 8 Phạm Văn Hai, P2, Quận Tân Bình", province: "TP. Hồ Chí Minh" },
  { locationId: 9, detail: "Trạm TC Nguyễn Thái Bình, Quận 1", province: "TP. Hồ Chí Minh" },
  { locationId: 10, detail: "Bến xe An Sương", province: "TP. Hồ Chí Minh" },
  { locationId: 11, detail: "Bến xe Miền Đông mới", province: "TP. Hồ Chí Minh" },
  { locationId: 12, detail: "Bến xe Biên Hòa", province: "Đồng Nai" }
];

export const locations = Array.from(new Set(stopPoints.map((sp) => sp.province)));

export const filterOptions: FilterOptions = {
  departureTimes: [
    "Sáng 0h - 6h",
    "Trưa 6h - 12h",
    "Chiều 12h - 18h",
    "Tối 18h - 24h"
  ],
  vehicleTypes:[
      { name: "Xe giường nằm" },
      { name: "Xe ghế ngồi" },
      { name: "Xe limousine" }
    ],
  seatPositions: ["Hàng ghế đầu", "Hàng ghế giữa", "Hàng ghế cuối"]
};