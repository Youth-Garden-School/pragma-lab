# Seat Management API Guide

## Tổng quan

API này cung cấp các chức năng quản lý ghế ngồi cho hệ thống booking xe khách, bao gồm:

- Quản lý cấu hình ghế cho từng loại xe
- Quản lý trạng thái ghế trong từng chuyến đi
- Cập nhật tính khả dụng của ghế
- Bulk operations cho việc tạo, cập nhật, xóa nhiều ghế cùng lúc

## API Endpoints

### 1. Seat Configurations

#### GET `/api/seat-configurations`

Lấy danh sách cấu hình ghế

**Query Parameters:**

- `vehicleTypeId` (optional): ID loại xe
- `page` (optional): Trang hiện tại (default: 1)
- `limit` (optional): Số lượng item mỗi trang (default: 50)

**Response:**

```json
{
  "statusCode": 200,
  "code": "SUCCESS",
  "message": "Seat configurations retrieved successfully",
  "data": {
    "items": [
      {
        "seatConfigId": 1,
        "vehicleTypeId": 1,
        "seatNumber": "L1",
        "rowNumber": 1,
        "columnNumber": 1,
        "isAvailable": true,
        "vehicleType": {
          "vehicleTypeId": 1,
          "name": "Xe Limousine 22 chỗ",
          "seatCapacity": 22,
          "pricePerSeat": 250000
        }
      }
    ],
    "total": 22,
    "page": 1,
    "limit": 50,
    "totalPages": 1
  }
}
```

#### POST `/api/seat-configurations`

Tạo cấu hình ghế mới

**Request Body:**

```json
{
  "vehicleTypeId": 1,
  "seatNumber": "L1",
  "rowNumber": 1,
  "columnNumber": 1,
  "isAvailable": true
}
```

#### PUT `/api/seat-configurations/[id]`

Cập nhật cấu hình ghế

**Request Body:**

```json
{
  "seatNumber": "L1",
  "rowNumber": 1,
  "columnNumber": 1,
  "isAvailable": false
}
```

#### DELETE `/api/seat-configurations/[id]`

Xóa cấu hình ghế

### 2. Bulk Operations

#### POST `/api/seat-configurations/bulk`

Tạo nhiều cấu hình ghế cùng lúc

**Request Body:**

```json
{
  "vehicleTypeId": 1,
  "seatConfigurations": [
    {
      "seatNumber": "L1",
      "rowNumber": 1,
      "columnNumber": 1,
      "isAvailable": true
    },
    {
      "seatNumber": "L2",
      "rowNumber": 1,
      "columnNumber": 2,
      "isAvailable": true
    }
  ]
}
```

#### PUT `/api/seat-configurations/bulk`

Cập nhật nhiều cấu hình ghế cùng lúc

**Request Body:**

```json
{
  "updates": [
    {
      "seatConfigId": 1,
      "isAvailable": false
    },
    {
      "seatConfigId": 2,
      "rowNumber": 2
    }
  ]
}
```

#### DELETE `/api/seat-configurations/bulk`

Xóa nhiều cấu hình ghế cùng lúc

**Request Body:**

```json
{
  "seatConfigIds": [1, 2, 3]
}
```

### 3. Seat Availability

#### GET `/api/seat-configurations/availability`

Lấy thông tin tính khả dụng của ghế

**Query Parameters:**

- `vehicleTypeId` (optional): ID loại xe
- `tripId` (optional): ID chuyến đi
- `isAvailable` (optional): Lọc theo trạng thái khả dụng

**Response:**

```json
{
  "statusCode": 200,
  "code": "SUCCESS",
  "message": "Seat availability retrieved successfully",
  "data": {
    "seats": [...],
    "statistics": {
      "total": 22,
      "available": 18,
      "unavailable": 4,
      "availabilityRate": "81.82"
    }
  }
}
```

#### PUT `/api/seat-configurations/availability`

Cập nhật tính khả dụng của một ghế

**Request Body:**

```json
{
  "seatConfigId": 1,
  "isAvailable": false
}
```

#### POST `/api/seat-configurations/availability`

Cập nhật tính khả dụng của nhiều ghế cùng lúc

**Request Body:**

```json
{
  "vehicleTypeId": 1,
  "isAvailable": false,
  "seatNumbers": ["L1", "L2", "L3"]
}
```

### 4. Trip Seats

#### GET `/api/trip-seats`

Lấy danh sách ghế trong chuyến đi

**Query Parameters:**

- `tripId` (optional): ID chuyến đi
- `seatNumber` (optional): Số ghế
- `isBooked` (optional): Trạng thái đặt

#### POST `/api/trip-seats`

Tạo ghế cho chuyến đi

**Request Body:**

```json
{
  "tripId": 1,
  "seatConfigurations": [{ "seatNumber": "L1" }, { "seatNumber": "L2" }]
}
```

#### PUT `/api/trip-seats`

Cập nhật trạng thái ghế trong chuyến đi

**Request Body:**

```json
{
  "tripId": 1,
  "seatNumber": "L1",
  "isBooked": true,
  "ticketId": 123
}
```

## Constants

### Seat Status

```typescript
export const SEAT_STATUS = {
  AVAILABLE: 'available',
  BOOKED: 'booked',
  MAINTENANCE: 'maintenance',
} as const
```

### Vehicle Type Layouts

```typescript
export const VEHICLE_TYPE_LAYOUTS = {
  LIMOUSINE_22: {
    id: 1,
    name: 'Xe Limousine 22 chỗ',
    gridColumns: 'grid-cols-3',
    seatCapacity: 22,
    seatPrefix: 'L',
  },
  SLEEPER_40: {
    id: 2,
    name: 'Xe Giường nằm 40 chỗ',
    gridColumns: 'grid-cols-2',
    seatCapacity: 40,
    seatPrefix: 'B',
  },
  SEATED_45: {
    id: 3,
    name: 'Xe Ghế ngồi 45 chỗ',
    gridColumns: 'grid-cols-5',
    seatCapacity: 45,
    seatPrefix: 'S',
  },
} as const
```

## Error Codes

- `BAD_REQUEST`: Dữ liệu đầu vào không hợp lệ
- `NOT_FOUND`: Không tìm thấy resource
- `CONFLICT`: Xung đột dữ liệu (ví dụ: ghế đã tồn tại)
- `INTERNAL_SERVER_ERROR`: Lỗi server
- `METHOD_NOT_ALLOWED`: Method không được hỗ trợ

## Sử dụng trong Frontend

### Import API Service

```typescript
import { SeatApi } from '@/feature/Admin/apis/SeatApi'

const seatApi = new SeatApi()
```

### Lấy danh sách cấu hình ghế

```typescript
const response = await seatApi.getSeatConfigurations({
  vehicleTypeId: 1,
  page: 1,
  limit: 50,
})

if (response.code === 'SUCCESS') {
  const seatConfigs = response.data.items
}
```

### Cập nhật tính khả dụng

```typescript
const response = await seatApi.updateSeatAvailability({
  seatConfigId: 1,
  isAvailable: false,
})
```

### Bulk operations

```typescript
// Tạo nhiều ghế
const response = await seatApi.bulkCreateSeatConfigurations({
  vehicleTypeId: 1,
  seatConfigurations: [
    { seatNumber: 'L1', rowNumber: 1, columnNumber: 1 },
    { seatNumber: 'L2', rowNumber: 1, columnNumber: 2 },
  ],
})
```

## Lưu ý

1. **Validation**: API sẽ validate dữ liệu đầu vào và trả về lỗi nếu không hợp lệ
2. **Constraints**: Không thể xóa ghế đang được sử dụng trong chuyến đi
3. **Performance**: Sử dụng bulk operations cho việc xử lý nhiều ghế cùng lúc
4. **Error Handling**: Luôn kiểm tra response code trước khi xử lý data
5. **Loading States**: Implement loading states trong frontend để UX tốt hơn
