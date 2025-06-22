# Vehicle Booking System - App Flow Review

## Tổng quan hệ thống

Hệ thống đặt vé xe khách với các chức năng chính:

- **Quản lý loại xe** (Vehicle Types)
- **Cấu hình ghế ngồi** (Seat Configuration)
- **Quản lý chuyến xe** (Trips)
- **Đặt vé** (Tickets)
- **Thanh toán** (Payments)

## Kiến trúc hệ thống

### 1. Database Schema (Prisma)

```
Users (Người dùng)
├── Customers (Khách hàng)
├── Drivers (Tài xế)
└── Admins (Quản trị viên)

VehicleTypes (Loại xe)
├── name: Tên loại xe
├── seatCapacity: Số ghế
└── pricePerSeat: Giá mỗi ghế

Vehicles (Xe)
├── licensePlate: Biển số
└── vehicleTypeId: Loại xe

SeatConfigurations (Cấu hình ghế)
├── seatNumber: Số ghế
├── rowNumber: Hàng
├── columnNumber: Cột
└── isAvailable: Có sẵn

Trips (Chuyến xe)
├── vehicleId: Xe
├── driverId: Tài xế
├── status: Trạng thái
└── tripStops: Các điểm dừng

Tickets (Vé)
├── userId: Khách hàng
├── tripId: Chuyến xe
├── seatNumber: Số ghế
├── pickupStopId: Điểm đón
├── dropoffStopId: Điểm trả
└── status: Trạng thái

Payments (Thanh toán)
├── ticketId: Vé
├── amount: Số tiền
└── method: Phương thức
```

### 2. API Structure

```
/api
├── /vehicletypes - Quản lý loại xe
├── /vehicles - Quản lý xe
├── /seat-configurations - Cấu hình ghế
├── /trip - Quản lý chuyến xe
├── /tickets - Quản lý vé
├── /payments - Thanh toán
└── /locations - Địa điểm
```

## Luồng hoạt động chính

### 1. Quản lý Loại Xe (Vehicle Types)

**Luồng:**

1. Admin tạo loại xe mới với thông tin:
   - Tên loại xe
   - Số ghế
   - Giá mỗi ghế
2. Hệ thống tự động tạo cấu hình ghế cho loại xe
3. Admin có thể chỉnh sửa thông tin loại xe

**API Endpoints:**

- `GET /api/vehicletypes` - Lấy danh sách loại xe
- `POST /api/vehicletypes` - Tạo loại xe mới
- `PUT /api/vehicletypes/[id]` - Cập nhật loại xe
- `DELETE /api/vehicletypes/[id]` - Xóa loại xe

### 2. Cấu hình Ghế (Seat Configuration)

**Luồng:**

1. Khi tạo loại xe, hệ thống tự động tạo cấu hình ghế
2. Admin có thể:
   - Xem sơ đồ ghế
   - Bật/tắt ghế (maintenance)
   - Xem trạng thái ghế (available/booked)
3. Ghế được đánh số theo format: L{row}{column} (VD: L11, L12)

**API Endpoints:**

- `GET /api/seat-configurations` - Lấy cấu hình ghế
- `POST /api/seat-configurations/bulk` - Tạo hàng loạt
- `PUT /api/seat-configurations/availability` - Cập nhật trạng thái

### 3. Quản lý Chuyến Xe (Trips)

**Luồng:**

1. Admin tạo chuyến xe với:
   - Xe và tài xế
   - Các điểm dừng (pickup/dropoff)
   - Thời gian khởi hành
2. Hệ thống tạo TripSeats cho tất cả ghế
3. Chuyến xe có các trạng thái: upcoming, ongoing, completed, cancelled

**API Endpoints:**

- `GET /api/trip` - Lấy danh sách chuyến xe
- `POST /api/trip` - Tạo chuyến xe mới
- `PUT /api/trip/[id]` - Cập nhật chuyến xe
- `DELETE /api/trip/[id]` - Hủy chuyến xe

### 4. Đặt Vé (Tickets)

**Luồng:**

1. Khách hàng chọn chuyến xe và ghế
2. Hệ thống kiểm tra ghế có sẵn
3. Tạo vé với thông tin:
   - Khách hàng
   - Chuyến xe
   - Ghế
   - Điểm đón/trả
   - Giá vé
4. Cập nhật TripSeats (isBooked = true)
5. Vé có trạng thái: booked, completed, cancelled, refunded

**API Endpoints:**

- `GET /api/tickets` - Lấy danh sách vé
- `POST /api/tickets` - Tạo vé mới
- `PUT /api/tickets/[id]` - Cập nhật vé
- `DELETE /api/tickets/[id]` - Hủy vé

### 5. Thanh toán (Payments)

**Luồng:**

1. Sau khi đặt vé, khách hàng thanh toán
2. Hệ thống tạo payment record
3. Cập nhật trạng thái vé nếu cần
4. Hỗ trợ nhiều phương thức: cash, card, momo, banking

**API Endpoints:**

- `GET /api/payments` - Lấy danh sách thanh toán
- `POST /api/payments` - Tạo thanh toán mới

## Frontend Components

### 1. Admin Dashboard

**SeatConfigurationTab:**

- Hiển thị sơ đồ ghế theo loại xe
- Cho phép bật/tắt ghế
- Hiển thị trạng thái ghế (available/booked/maintenance)
- Tích hợp với chuyến xe để xem ghế đã đặt

**TicketsList:**

- Danh sách tất cả vé
- Tìm kiếm theo tên, email, địa điểm
- Lọc theo trạng thái
- Thao tác: xem chi tiết, hủy vé, hoàn tiền

**TripsList:**

- Quản lý chuyến xe
- Tạo, chỉnh sửa, hủy chuyến xe
- Xem thông tin xe, tài xế, điểm dừng

### 2. Data Flow

```
User Action → API Call → Database → Response → UI Update
```

**Ví dụ đặt vé:**

1. User chọn ghế → `POST /api/tickets`
2. API kiểm tra ghế sẵn → Tạo ticket + update TripSeats
3. Response success → UI hiển thị vé đã đặt

## Bảo mật và Validation

### 1. Input Validation

- Kiểm tra dữ liệu đầu vào ở cả frontend và backend
- Validate email, phone, số tiền, thời gian
- Kiểm tra ràng buộc business logic

### 2. Error Handling

- Sử dụng ApiResponseBuilder cho consistent response format
- Log lỗi chi tiết để debug
- Hiển thị thông báo lỗi thân thiện cho user

### 3. Data Integrity

- Foreign key constraints trong database
- Transaction để đảm bảo consistency
- Soft delete thay vì hard delete

## Performance Considerations

### 1. Database Optimization

- Index trên các trường thường query
- Pagination cho danh sách lớn
- Eager loading với include để giảm N+1 queries

### 2. Caching

- Cache vehicle types, locations
- Cache seat configurations
- Implement Redis nếu cần

### 3. API Optimization

- Pagination cho tất cả list APIs
- Search với full-text search
- Filtering và sorting

## Monitoring và Logging

### 1. API Logging

- Log tất cả API calls
- Log errors với stack trace
- Monitor performance metrics

### 2. Business Metrics

- Số vé đặt theo ngày/tháng
- Doanh thu theo chuyến xe
- Tỷ lệ hủy vé
- Ghế được sử dụng nhiều nhất

## Future Enhancements

### 1. Real-time Features

- WebSocket cho real-time seat updates
- Push notifications cho khách hàng
- Live tracking chuyến xe

### 2. Advanced Features

- Multi-language support
- Mobile app
- Payment gateway integration
- Email/SMS notifications
- Report generation

### 3. Scalability

- Microservices architecture
- Load balancing
- Database sharding
- CDN cho static assets

## Kết luận

Hệ thống được thiết kế với kiến trúc clean, dễ maintain và scale. Luồng hoạt động rõ ràng, API consistent, và UI intuitive. Có thể dễ dàng mở rộng thêm tính năng mới trong tương lai.
