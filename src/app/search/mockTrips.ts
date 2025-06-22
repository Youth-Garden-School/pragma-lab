export type SeatStatus = 'available' | 'sold' | 'selected';

export interface Seat {
  id: string;
  status: SeatStatus;
}

export interface PickupDropPoint {
  time: string;
  name: string;
  address?: string;
}

export interface Trip {
  id: string;
  vehicleType: string;
  vehicleCode: string;
  departureTime: string;
  arrivalTime: string;
  pickupArea: string;         // Điểm đón cụ thể để hiển thị
  pickupLocation: string;     // Tỉnh/thành để lọc
  dropoffArea: string;        // Điểm trả cụ thể để hiển thị
  dropoffLocation: string;    // Tỉnh/thành để lọc
  price: number;
  availableSeats: number;
  seatMap: Seat[];
  pickupPoints: PickupDropPoint[];
  dropoffPoints: PickupDropPoint[];
}

export const mockTrips: Trip[] = [
  {
    id: "trip-01",
    vehicleType: "Xe Limousine 18C",
    vehicleCode: "72K-04710",
    departureTime: "05:30",
    arrivalTime: "07:30",

    // Thông tin điểm đón/trả
    pickupArea: "(VIP)BX Vũng Tàu",
    pickupLocation: "Bà Rịa - Vũng Tàu",
    dropoffArea: "Sân bay",
    dropoffLocation: "TP. Hồ Chí Minh",

    price: 200000,
    availableSeats: Array.from({ length: 18 }, (_, i) => (
      [0, 1, 2, 5, 6, 15, 16].includes(i) ? "sold" : "available"
    )).filter(status => status === "available").length,

    seatMap: Array.from({ length: 18 }, (_, i) => ({
      id: (i + 1).toString(),
      status: [0, 1, 2, 5, 6, 15, 16].includes(i) ? "sold" : "available"
    })),

    pickupPoints: [
      { time: "05:30", name: "(VIP)BX Vũng Tàu" },
      { time: "05:45", name: "Ngã 3 Long Sơn", address: "QL51, Tân Hải, Tân Thành, Bà Rịa - Vũng Tàu" },
      { time: "05:50", name: "Ngã 3 Hội Bài", address: "QL51, Tân Hòa, Tân Thành, Bà Rịa - Vũng Tàu" },
      { time: "05:55", name: "Chợ Phước Lộc", address: "QL51, Tân Phước, Tân Thành, Bà Rịa - Vũng Tàu" }
    ],

    dropoffPoints: [
      { time: "07:10", name: "Dọc đường Điện Biên Phủ", address: "P.13, Bình Thạnh, TP.HCM" },
      { time: "07:15", name: "Công viên Lê Văn Tám", address: "163 - 187 Điện Biên Phủ, P.Đa Kao, Quận 1, TP.HCM" },
      { time: "07:20", name: "Đối diện 8 Phạm Văn Hai", address: "08 Phạm Văn Hai, P.2, Tân Bình, TP.HCM" }
    ]
  }
]
