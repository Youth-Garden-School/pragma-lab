import { Location } from "./mockdata";

export interface VehicleType {
  name: string;
  seatCapacity: number;
  pricePerSeat: number;
}
export interface Vehicle {
  vehicleId: number;
  licensePlate: string;
  vehicleTypeId: number;
  vehicleType: VehicleType;
}

export interface TripStop {
  tripStopId: number;
  tripId: number;
  locationId: number;
  stopOrder: number;
  arrivalTime: string; // hoặc Date nếu bạn parse về dạng Date object
  departureTime: string; // hoặc Date
  isPickup: boolean;
  location: Location;
}
export interface PickupDropPoint {
  time: string;
  name: string;
  address?: string;
}

export interface Trip {
  TripId: string;
  vehicle: Vehicle;
  vehicletype: VehicleType; 
  departureTime: string;
  arrivalTime: string;
  pickupStop: TripStop;         // Điểm đón đầu tiên
  dropoffStop: TripStop;        // Điểm trả cuối cùng
  pickupStops: TripStop[];      // ← mới thêm
  dropoffStops: TripStop[];     // ← mới thêm
  
}

const pickupStops: TripStop[] = [
  {
    tripStopId: 1,
    tripId: 101,
    locationId: 1001,
    stopOrder: 1,
    arrivalTime: "05:25",
    departureTime: "05:30",
    isPickup: true,
    location: {
      locationId: 1001,
      detail: "(VIP)BX Vũng Tàu",
      province: "Bà Rịa - Vũng Tàu"
    }
  },
  {
    tripStopId: 2,
    tripId: 101,
    locationId: 1002,
    stopOrder: 2,
    arrivalTime: "05:40",
    departureTime: "05:45",
    isPickup: true,
    location: {
      locationId: 1002,
      detail: "Ngã 3 Long Sơn",
      province: "Bà Rịa - Vũng Tàu"
    }
  },
  {
    tripStopId: 3,
    tripId: 101,
    locationId: 1003,
    stopOrder: 3,
    arrivalTime: "05:48",
    departureTime: "05:50",
    isPickup: true,
    location: {
      locationId: 1003,
      detail: "Ngã 3 Hội Bài",
      province: "Bà Rịa - Vũng Tàu"
    }
  },
  {
    tripStopId: 4,
    tripId: 101,
    locationId: 1004,
    stopOrder: 4,
    arrivalTime: "05:53",
    departureTime: "05:55",
    isPickup: true,
    location: {
      locationId: 1004,
      detail: "Chợ Phước Lộc",
      province: "Bà Rịa - Vũng Tàu"
    }
  }
];

const dropoffStops: TripStop[] = [
  {
    tripStopId: 5,
    tripId: 101,
    locationId: 2001,
    stopOrder: 5,
    arrivalTime: "07:10",
    departureTime: "07:12",
    isPickup: false,
    location: {
      locationId: 2001,
      detail: "Dọc đường Điện Biên Phủ",
      province: "TP.HCM"
    }
  },
  {
    tripStopId: 6,
    tripId: 101,
    locationId: 2002,
    stopOrder: 6,
    arrivalTime: "07:15",
    departureTime: "07:17",
    isPickup: false,
    location: {
      locationId: 2002,
      detail: "Công viên Lê Văn Tám",
      province: "TP.HCM"
    }
  },
  {
    tripStopId: 7,
    tripId: 101,
    locationId: 2003,
    stopOrder: 7,
    arrivalTime: "07:20",
    departureTime: "07:22",
    isPickup: false,
    location: {
      locationId: 2003,
      detail: "Đối diện 8 Phạm Văn Hai",
      province: "TP.HCM"
    }
  }
];

export const mockTrips: Trip[] = [
  {
    TripId: "trip-01",
    vehicle: {
      vehicleId: 1,
      licensePlate: "79B-12345",
      vehicleTypeId: 1,
      vehicleType: {  
        name: "Limousine 18 chỗ",
        seatCapacity: 18,
        pricePerSeat: 200000
      }
    },
    vehicletype: {
      name: "Limousine 18 chỗ",
      seatCapacity: 18,
      pricePerSeat: 200000
    },
    departureTime: "05:30",
    arrivalTime: "07:30",

    pickupStop: {
      location: {
        province: pickupStops[0].location.province
      }
    } as any,

    dropoffStop: {
      location: {
        province: dropoffStops[0].location.province
      }
    } as any,

    pickupStops,
    dropoffStops,
  },
]