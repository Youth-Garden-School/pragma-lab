# Seat Configuration & Trip Management Guide

## Tổng quan

Hệ thống booking xe khách đã được cập nhật với các tính năng mới:

1. **Seat Configuration Management**: Quản lý cấu hình ghế cho từng loại xe
2. **Trip Management**: Quản lý chuyến đi với API đầy đủ
3. **Real-time Seat Status**: Hiển thị trạng thái ghế theo thời gian thực
4. **Trip Integration**: Kết nối seat configuration với trips

## Các thay đổi chính

### 1. SeatConfigurationTab Component

**Vấn đề đã sửa:**

- ❌ Hardcode trip ID (trip 8)
- ❌ Không có selector để chọn trip
- ❌ Không hiển thị thông tin trip

**Giải pháp:**

- ✅ Thêm selector để chọn trip
- ✅ Kết nối với TripApi để lấy danh sách active trips
- ✅ Hiển thị thông tin trip khi được chọn
- ✅ Sử dụng constants để dễ customize

**Tính năng mới:**

```typescript
// Constants for easy customization
const SEAT_CONFIG_CONSTANTS = {
  DEFAULT_VEHICLE_TYPE: '1',
  DEFAULT_TRIP_ID: null,
  SEAT_GRID_GAP: 'gap-3',
  MAX_WIDTH: 'max-w-4xl',
  // ... more constants
}
```

### 2. TripApi Class

**API Endpoints:**

- `GET /api/trip` - Lấy danh sách trips với pagination
- `GET /api/trip/[id]` - Lấy trip theo ID
- `POST /api/trip` - Tạo trip mới
- `PUT /api/trip/[id]` - Cập nhật trip
- `DELETE /api/trip/[id]` - Xóa trip

**Features:**

- Pagination support
- Filtering by status, vehicle, driver
- Search functionality
- Full CRUD operations

### 3. TripsList Component

**Cập nhật:**

- ✅ Sử dụng TripApi thay vì mock data
- ✅ Pagination support
- ✅ Real-time data fetching
- ✅ Error handling
- ✅ Loading states

### 4. Database Schema

**Đã có sẵn trong schema.prisma:**

- Users (admin, employee, customer)
- VehicleTypes (loại xe)
- SeatConfigurations (cấu hình ghế)
- Vehicles (xe)
- Trips (chuyến đi)
- TripStops (điểm dừng)
- TripSeats (ghế trong chuyến đi)
- Tickets (vé)
- Payments (thanh toán)

## Hướng dẫn sử dụng

### 1. Seed dữ liệu mẫu

```bash
# Gọi API để tạo dữ liệu mẫu
curl -X POST http://localhost:3000/api/seed-data
```

**Dữ liệu mẫu bao gồm:**

- 4 users (1 admin, 2 drivers, 1 customer)
- 4 locations (bến xe)
- 2 vehicle types (22 chỗ, 45 chỗ)
- Seat configurations cho từng loại xe
- 2 vehicles
- 2 trips với trip stops
- Trip seats và tickets

### 2. Sử dụng Seat Configuration

1. **Chọn Vehicle Type**: Chọn loại xe để xem cấu hình ghế
2. **Chọn Trip (tùy chọn)**: Chọn chuyến đi để xem trạng thái booking
3. **Quản lý ghế**: Toggle availability của từng ghế
4. **Xem thống kê**: Số ghế available/booked/maintenance

### 3. Quản lý Trips

1. **Xem danh sách**: Trang `/trips` hiển thị tất cả trips
2. **Filter & Search**: Lọc theo status, tìm kiếm
3. **CRUD Operations**: Tạo, sửa, xóa trips
4. **Pagination**: Phân trang cho danh sách lớn

## API Endpoints

### Trip Management

```
GET    /api/trip                    # Lấy danh sách trips
POST   /api/trip                    # Tạo trip mới
GET    /api/trip/[id]               # Lấy trip theo ID
PUT    /api/trip/[id]               # Cập nhật trip
DELETE /api/trip/[id]               # Xóa trip
```

### Seat Management

```
GET    /api/seat-configurations     # Lấy cấu hình ghế
POST   /api/seat-configurations     # Tạo cấu hình ghế
PUT    /api/seat-configurations/[id] # Cập nhật cấu hình ghế
DELETE /api/seat-configurations/[id] # Xóa cấu hình ghế
GET    /api/seat-configurations/availability # Lấy trạng thái ghế
PUT    /api/seat-configurations/availability # Cập nhật trạng thái ghế
```

### Trip Seats

```
GET    /api/trip-seats              # Lấy ghế trong chuyến đi
POST   /api/trip-seats              # Tạo ghế cho chuyến đi
PUT    /api/trip-seats              # Cập nhật trạng thái ghế
```

## Luồng hoạt động

### 1. Tạo Trip

1. Admin tạo trip với vehicle, driver, trip stops
2. Hệ thống tự động tạo trip seats từ seat configurations
3. Trip sẵn sàng để booking

### 2. Booking Process

1. Customer chọn trip và ghế
2. Hệ thống kiểm tra availability
3. Tạo ticket và cập nhật trip seat status
4. Xử lý payment

### 3. Seat Management

1. Admin có thể disable/enable ghế trong seat configuration
2. Ghế bị disable không thể được book
3. Ghế đã book không thể bị disable

## Constants & Customization

### Seat Configuration Constants

```typescript
const SEAT_CONFIG_CONSTANTS = {
  DEFAULT_VEHICLE_TYPE: '1',
  DEFAULT_TRIP_ID: null,
  SEAT_GRID_GAP: 'gap-3',
  MAX_WIDTH: 'max-w-4xl',
  STATS_GRID_COLS: 'grid-cols-3',
  STATS_GAP: 'gap-4',
  CARD_PADDING: 'p-3',
  HOVER_EFFECT: 'hover:shadow-md',
  TRANSITION: 'transition-all',
}
```

### Trip List Constants

```typescript
const TRIPS_LIST_CONSTANTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  STATUS_BADGE_VARIANTS: {
    upcoming: 'default',
    ongoing: 'secondary',
    completed: 'outline',
    cancelled: 'destructive',
    delayed: 'destructive',
  },
  STATUS_COLORS: {
    upcoming: 'bg-blue-100 text-blue-800',
    ongoing: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
    delayed: 'bg-yellow-100 text-yellow-800',
  },
}
```

## Troubleshooting

### Seat Configuration không hiển thị

1. Kiểm tra database có dữ liệu vehicle types
2. Gọi API `/api/seed-data` để tạo dữ liệu mẫu
3. Kiểm tra console errors

### Trip API không hoạt động

1. Kiểm tra database connection
2. Verify Prisma schema đã được generate
3. Kiểm tra API endpoints trong Network tab

### Seat Status không cập nhật

1. Kiểm tra trip seats đã được tạo
2. Verify seat configuration exists
3. Kiểm tra API response trong console

## Next Steps

1. **Booking Flow**: Implement complete booking process
2. **Payment Integration**: Connect with payment gateways
3. **Real-time Updates**: Add WebSocket for live updates
4. **Mobile App**: Create mobile booking interface
5. **Analytics**: Add booking analytics and reports
