"use client"

export type NewsImage = {
    id: string;
    title: string;
    decsription?: string;
    image: string;
    url: string;
    category: 'Tin nổi bật' | 'Mới cập nhật';
    date?: string;
}
export const newsimage: NewsImage[] = [
  {
    id: '1',
    title: 'TOP 7 hãng xe từ bến xe An Sương đi Bà Rịa – Vũng Tàu chất lượng cao',
    image: 'https://newsapi.toanthangcar.com/imgs/1723543985499_xe-di-an-suong-vung-tau-1.jpg',
    url: '#',
    category: 'Tin nổi bật',
    date: '2025-06-10',
  },
  {
    id: '2',
    title: 'TOP 7 hãng xe từ bến xe Miền Đông đi Vũng Tàu: Nhà xe chất lượng, giá tốt',
    image: 'https://newsapi.toanthangcar.com/imgs/1723543990876_1-ben-xe-mien-dong-di-vung-tau.jpg',
    url: '#',
    category: 'Tin nổi bật',
    date: '2025-06-10',
  },
  {
    id: '3',
    title: 'Cập nhật chi tiết tuyến Bến xe Miền Tây đi Vũng Tàu: Xe giường nằm, giá vé, lịch trình',
    image: 'https://newsapi.toanthangcar.com/imgs/1723543996277_xe-tuyen-mien-tay-di-vung-tau.jpeg',
    url: '#',
    category: 'Tin nổi bật',
    date: '2025-06-09',
  },
  {
    id: '4',
    title: 'DATVEXE - Đơn vị uy tín trong dịch vụ thuê xe đưa đón theo tháng',
    image: 'https://newsapi.toanthangcar.com/imgs/1723544028034_xe-dua-don-theo-thang.jpg',
    url: '#',
    category: 'Mới cập nhật',
    date: '2025-06-08',
  },
  {
    id: '5',
    title: 'DATVEXE - Dịch vụ xe đưa đón nhân viên tại TPHCM uy tín, chuyên nghiệp',
    image: 'https://newsapi.toanthangcar.com/imgs/1723544020888_du-an-toan-thang-car-1.jpg',
    url: '#',
    category: 'Mới cập nhật',
    date: '2025-06-07',
  },
  {
    id: '6',
    title: 'Dịch vụ xe đưa đón công nhân viên tại Đồng Nai',
    image: 'https://newsapi.toanthangcar.com/imgs/1723544020101_doi-xe-da-dang.jpg',
    url: '#',
    category: 'Mới cập nhật',
    date: '2025-06-07',
  },
  {
    id: '7',
    title: 'Thuê xe 29 chỗ đi Vũng Tàu giá tốt, chất lượng cao',
    image: 'https://newsapi.toanthangcar.com/imgs/1723544043797_noi-that-xe-29-cho.jpeg',
    url: '#',
    category: 'Mới cập nhật',
    date: '2025-06-08',
  },
  {
    id: '8',
    title: 'Thuê xe 16 chỗ Sài Gòn đi Vũng Tàu Toàn Thắng giá rẻ, uy tín, chất lượng',
    image: 'https://newsapi.toanthangcar.com/imgs/1723544042790_noi-that-xe-16-cho.jpeg',
    url: '#',
    category: 'Mới cập nhật',
    date: '2025-06-07',
  },
  {
    id: '9',
    title: 'Bảng giá dịch vụ xe 47 chỗ Sài Gòn Vũng Tàu mới nhất',
    image: 'https://newsapi.toanthangcar.com/imgs/1723544045416_xe-thaco-blue-sky-47-cho-1024x768.png',
    url: '#',
    category: 'Mới cập nhật',
    date: '2025-06-07',
  },
  {
    id: '10',
    title: 'Chành xe Sài Gòn đi Vũng Tàu nhanh chóng, giá rẻ, an toàn',
    image: 'https://newsapi.toanthangcar.com/imgs/1723544000025_dich-vu-gui-hang-toan-thang.jpeg',
    url: '#',
    category: 'Mới cập nhật',
    date: '2025-06-07',
  },
  {
    id: '11',
    title: 'Xe Limousine DATVEXE | Giá vé, Lịch trình, cách đặt vé mới nhất',
    image: 'https://newsapi.toanthangcar.com/imgs/1723544089634_he-thong-xe-toan-thang-1.jpeg',
    url: '#',
    category: 'Mới cập nhật',
    date: '2025-06-07',
  },
  {
    id: '12',
    title: '[Giải đáp] DATVEXE có chạy tết không?',
    image: 'https://newsapi.toanthangcar.com/imgs/1723544088173_xe-toan-thang.jpeg',
    url: '#',
    category: 'Mới cập nhật',
    date: '2025-06-07',
  },
  {
    id: '13',
    title: 'Lịch chạy xe Toàn Thắng Vũng Tàu ⇔ Sài Gòn mới nhất',
    image: 'https://newsapi.toanthangcar.com/imgs/1723544038985_he-thong-xe-toan-thang.jpeg',
    url: '#',
    category: 'Mới cập nhật',
    date: '2025-06-07',
  },{
    id: '14',
    title: 'Top 3 dịch vụ thuê xe 7 chỗ uy tín từ Sài Gòn đến Vũng Tàu giá rẻ, uy tín 2024',
    image: 'https://newsapi.toanthangcar.com/imgs/1723544046346_dich-vu-xe-7-cho-cua-toan-thang-768x1024.jpg',
    url: '#',
    category: 'Mới cập nhật',
    date: '2025-06-07',
  },{
    id: '15',
    title: 'Xe từ Vũng Tàu đi Sài Gòn 24/24 - Đặt vé nhanh chóng, tiện lợi',
    image: 'https://newsapi.toanthangcar.com/imgs/1723544113382_1-xe-vung-tau-di-sai-gon-24-24.jpg',
    url: '#',
    category: 'Mới cập nhật',
    date: '2025-06-07',
  },

];


