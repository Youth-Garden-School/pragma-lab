'use client'
import { Button } from '@/components/ui/button'
import { Phone, Mail, MapPin, Facebook, Youtube, Instagram } from 'lucide-react'
import { Icons } from '../Icon'

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="container mx-auto px-[120px] py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Icons.logocar width={40} height={40} />
              <div>
                <h3 className="text-xl font-bold text-blue-600">DATVEXE</h3>
                <p className="text-sm text-gray-500">Đặt vé xe khách online</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Nền tảng đặt vé xe khách hàng đầu Việt Nam, mang đến trải nghiệm di chuyển an toàn và
              tiện lợi.
            </p>
            <div className="flex space-x-2">
              <Button size="icon" variant="outline" className="w-8 h-8 p-0">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" className="w-8 h-8 p-0">
                <Youtube className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" className="w-8 h-8 p-0">
                <Instagram className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">Dịch vụ</h4>
            <ul className="space-y-2 text-gray-600">
              {['Đặt vé xe khách', 'Xe limousine', 'Xe giường nằm', 'Thuê xe riêng'].map(
                (service, index) => (
                  <li key={index}>
                    <a href="#" className="hover:text-blue-600 transition-colors">
                      {service}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">Hỗ trợ</h4>
            <ul className="space-y-2 text-gray-600">
              {[
                'Hướng dẫn đặt vé',
                'Chính sách hoàn tiền',
                'Điều khoản sử dụng',
                'Câu hỏi thường gặp',
              ].map((support, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    {support}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">Liên hệ</h4>
            <div className="space-y-3 text-gray-600">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-600" />
                <span>1900 6888</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <span>support@datvexe.vn</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span>123 Đường ABC, Quận 1, TP.HCM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 pt-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© 2024 DATVEXE. Tất cả quyền được bảo lưu.</p>
            <div className="flex space-x-4 text-sm text-gray-500 mt-2 md:mt-0">
              <a href="#" className="hover:text-blue-600 transition-colors">
                Chính sách bảo mật
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors">
                Điều khoản dịch vụ
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
