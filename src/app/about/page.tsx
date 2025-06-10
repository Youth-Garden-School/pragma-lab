import { Card, CardContent } from '@/components/ui/card'
import Footer from '@/components/Common/Layout/Footer'
import Header from '@/components/Common/Layout/Header'
import {
  Building,
  MapPin,
  Phone,
  Bus,
  Route,
  Car,
  Award,
  Users,
  Target,
  Eye,
  Calendar,
  CheckCircle,
} from 'lucide-react'

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-[120px]">
      <Header />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="absolute inset-0 bg-black/10"></div>{' '}
        <div className="container mx-auto px-[120px] relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              DATVEXE
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Đặt vé xe khách online - Kết nối mọi hành trình
            </p>
            <div
              className="flex flex-wrap justify-center gap-8 text-sm px-[120px] md:px-[120px]"
              style={{ paddingLeft: 120, paddingRight: 120 }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-300" />
                <span>500+ xe đời mới</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-300" />
                <span>64 tỉnh thành</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-300" />
                <span>20+ năm kinh nghiệm</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </section>{' '}
      <div className="container mx-auto px-[120px] -mt-10 relative z-20">
        {/* Overview Section */}
        <section className="mb-20">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20 backdrop-blur-sm">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                DATVEXE
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-gray-700 text-lg leading-relaxed">
                  Là một trong những công ty hàng đầu về uy tín chất lượng với hơn{' '}
                  <span className="font-bold text-blue-600">500 xe ô tô đời mới</span> được sản xuất
                  năm 2019 – 2021 thiết kế sắc sảo, an toàn, không gian nội thất rộng rãi thoải mái.
                  Chúng tôi có kinh nghiệm trong việc cung cấp dịch vụ cho thuê xe đi công tác, du
                  lịch từ <span className="font-bold text-blue-600">4 chỗ đến 47 chỗ</span>.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Thêm vào đó, chúng tôi cung cấp nhân lực, thiết bị, và nhà ở cho các khu công
                  nghiệp, các dự án lớn chủ yếu là cho các công ty nước ngoài, nhà thầu rộng khắp{' '}
                  <span className="font-bold text-blue-600">64 tỉnh thành</span>.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl text-center">
                  <Bus className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-blue-600">500+</div>
                  <div className="text-sm text-gray-600">Xe đời mới</div>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl text-center">
                  <MapPin className="h-12 w-12 text-indigo-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-indigo-600">64</div>
                  <div className="text-sm text-gray-600">Tỉnh thành</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl text-center">
                  <Users className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-purple-600">20+</div>
                  <div className="text-sm text-gray-600">Năm kinh nghiệm</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl text-center">
                  <Award className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-green-600">100%</div>
                  <div className="text-sm text-gray-600">Uy tín</div>
                </div>
              </div>
            </div>

            <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border border-blue-100">
              <p className="text-gray-700 text-lg leading-relaxed">
                Qua hơn nhiều năm nhờ có những nỗ lực liên tục của tất cả nhân viên, chúng tôi không
                ngừng nâng cao chất lượng dịch vụ cũng như nắm bắt những cơ hội trong các dự án FDI
                của tỉnh Bà Rịa Vũng Tàu để xe Toàn Thắng ngày càng hoàn thiện và phát triển vượt
                trội. DATVEXE à một trong những hãng xe được nhiều du khách tin tưởng sử dụng dịch
                vụ, đang nhận được sự đánh giá rất cao từ các khách hàng.
              </p>
            </div>
          </div>
        </section>

        {/* Development History Section */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Lịch sử hình thành và phát triển
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
          </div>

          <div className="relative max-w-6xl mx-auto">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-400 via-indigo-400 to-purple-400 rounded-full"></div>

            {[
              {
                year: '2004',
                title: 'Bắt đầu hành trình',
                desc: 'DATVEXE ttnh lập với dịch vụ đưa đón nhân viên của các dự án ở khu vực miền Nam.',
                side: 'left',
              },
              {
                year: '2006',
                title: 'Mở rộng dịch vụ',
                desc: 'Phát triển đội xe và mở rộng phạm vi hoạt động',
                side: 'right',
              },
              {
                year: '2008',
                title: 'Mở rộng tuyến đường',
                desc: 'Thêm các tuyến đường mới phục vụ nhiều khu vực hơn',
                side: 'left',
              },
              {
                year: '2009-2010',
                title: 'Phát triển vận chuyển hành khách',
                desc: 'Chuyển trọng tâm sang dịch vụ vận chuyển hành khách',
                side: 'right',
              },
              {
                year: '2011',
                title: 'Mở rộng quy mô',
                desc: 'Tăng cường đầu tư và mở rộng quy mô hoạt động',
                side: 'left',
              },
              {
                year: '7/2014',
                title: 'Nâng cao chất lượng',
                desc: 'Đầu tư nâng cao chất lượng dịch vụ và đội xe',
                side: 'right',
              },
              {
                year: '8/2014',
                title: 'Mở rộng đội xe',
                desc: 'Bổ sung thêm nhiều xe mới và tuyến đường',
                side: 'left',
              },
              {
                year: '03/2019',
                title: 'Đổi mới công nghệ',
                desc: 'Ứng dụng công nghệ mới và cập nhật phương tiện',
                side: 'right',
              },
              {
                year: '07/2023',
                title: 'Mở rộng dịch vụ mới',
                desc: 'Ra mắt các dịch vụ mới đáp ứng nhu cầu khách hàng',
                side: 'left',
              },
              {
                year: '01/2024',
                title: 'Nền tảng trực tuyến',
                desc: 'Phát triển nền tảng đặt vé trực tuyến DATVEXE',
                side: 'right',
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`flex items-center mb-12 ${item.side === 'left' ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div
                  className={`w-5/12 ${item.side === 'left' ? 'pr-8 text-right' : 'pl-8 text-left'}`}
                >
                  <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <div className="text-2xl font-bold text-blue-600 mb-2">{item.year}</div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>

                <div className="w-2/12 flex justify-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg z-10">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                </div>

                <div className="w-5/12"></div>
              </div>
            ))}
          </div>
        </section>

        {/* Vision - Mission Section */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Tầm nhìn - Sứ mệnh
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 border-0 shadow-2xl rounded-3xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-500 p-3 rounded-2xl mr-4">
                    <Eye className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-800">Tầm nhìn</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Mang tới dịch vụ vận tải hành khách chất lượng cao để mỗi người Việt Nam đều được
                  trải nghiệm những chuyến xe an toàn, thoải mái, di chuyển dễ dàng và nhanh chóng
                  với mức giá phải chăng.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-50 via-purple-100 to-pink-100 border-0 shadow-2xl rounded-3xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-indigo-500 p-3 rounded-2xl mr-4">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-indigo-800">Sứ mệnh</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Góp phần vào sự phát triển của đất nước trong việc phát triển văn hóa giao thông
                  lành mạnh, những chuyến xe an toàn, tuân thủ luật giao thông, xây dựng hình ảnh
                  đẹp trong mắt khách hàng trong nước và quốc tế.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            <p className="text-gray-700 text-lg leading-relaxed text-center italic">
              "Ban lãnh đạo và đội ngũ DATVEXE tin tưởng rằng: Khi làm việc và cống hiến một cách tử
              tế, nỗ lực hết mình, chúng tôi đã và đang góp phần sức lực nhỏ bé của mình vào sự phát
              triển của Việt Nam."
            </p>
          </div>
        </section>

        {/* Organizational Structure Section */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Cơ cấu tổ chức
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
            <div className="flex justify-center mb-12">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg">
                <h3 className="font-bold text-xl text-center">Ban Giám đốc</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {['Phòng Kinh doanh', 'Phòng Kỹ thuật', 'Phòng Hành chính'].map((dept, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl text-center shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <h3 className="font-bold text-lg text-blue-800">{dept}</h3>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['Đội xe', 'Bộ phận Dịch vụ khách hàng'].map((dept, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl text-center shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <h3 className="font-bold text-lg text-indigo-800">{dept}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Member Units Section */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Đơn vị thành viên
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Trụ sở chính Vũng Tàu',
                address:
                  '439 Bình Giã, phường Nguyễn An Ninh, TP. Vũng Tàu, Tỉnh Bà Rịa - Vũng Tàu',
                phone: '0254.3853710',
                gradient: 'from-blue-500 to-indigo-600',
              },
              {
                title: 'Văn phòng đại diện Quảng Ngãi',
                address: '32 Hai Bà Trưng, phường Lê Hồng Phong, TP. Quảng Ngãi',
                phone: '(84-55) -3711 955',
                gradient: 'from-indigo-500 to-purple-600',
              },
              {
                title: 'Văn phòng đại diện Hồ Chí Minh',
                address: '11 Nguyễn Thái Bình, phường Nguyễn Thái Bình, Quận 1, TP. Hồ Chí Minh',
                phone: '(02838)-211-775',
                gradient: 'from-purple-500 to-pink-600',
              },
            ].map((office, index) => (
              <Card
                key={index}
                className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <CardContent className="p-8">
                  <div className="flex items-start mb-6">
                    <div
                      className={`bg-gradient-to-r ${office.gradient} p-3 rounded-2xl mr-4 shrink-0`}
                    >
                      <Building className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-800 leading-tight">
                      {office.title}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 mr-3 text-gray-500 shrink-0 mt-1" />
                      <p className="text-gray-700 text-sm leading-relaxed">{office.address}</p>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 mr-3 text-gray-500" />
                      <p className="text-gray-700 font-semibold">{office.phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Services Section */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Những Dịch vụ của chúng tôi
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Bus,
                title: 'Xe Đi liên tỉnh',
                desc: 'Dịch vụ vận chuyển hành khách giữa các tỉnh thành với chất lượng cao và giá cả hợp lý',
                gradient: 'from-blue-400 to-blue-600',
                bgGradient: 'from-blue-50 to-blue-100',
              },
              {
                icon: Route,
                title: 'Xe đi các tuyến',
                desc: 'Phục vụ đa dạng các tuyến đường với lịch trình đều đặn và đáng tin cậy',
                gradient: 'from-indigo-400 to-indigo-600',
                bgGradient: 'from-indigo-50 to-indigo-100',
              },
              {
                icon: Car,
                title: 'Xe thuê cá nhân công việc',
                desc: 'Dịch vụ cho thuê xe phục vụ nhu cầu cá nhân và công việc với nhiều lựa chọn',
                gradient: 'from-purple-400 to-purple-600',
                bgGradient: 'from-purple-50 to-purple-100',
              },
            ].map((service, index) => (
              <Card
                key={index}
                className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`h-48  flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                  <div
                    className={`bg-gradient-to-r ${service.gradient} p-6 rounded-3xl shadow-lg relative z-10`}
                  >
                    <service.icon className="h-16 w-16 text-white" />
                  </div>
                </div>
                <CardContent className="p-8">
                  <h3 className="font-bold text-xl mb-4 text-gray-800 text-center">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">{service.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Certifications Section */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Giấy chứng nhận
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'BLUESCOPE STEEL',
                years: '2004 - 2018',
                gradient: 'from-blue-400 to-blue-600',
              },
              {
                name: 'TECHNIP CONSORTIUM DUNGQUAT REFINERY PROJECT',
                years: '2006 - 2018',
                gradient: 'from-indigo-400 to-indigo-600',
              },
              {
                name: 'DOOSAN THANH HOA, QUANG NINH VINH TAN, HO CHI MINH, SONG HAU',
                years: '2008 - 2018',
                gradient: 'from-purple-400 to-purple-600',
              },
              {
                name: 'TECHNIP ITALY S.p.A',
                years: '2001 - 2018',
                gradient: 'from-pink-400 to-pink-600',
              },
              {
                name: 'JGCS CONSORTIUM NGHI SON – THANH HOA',
                years: '2013 - 2018',
                gradient: 'from-green-400 to-green-600',
              },
            ].map((cert, index) => (
              <Card
                key={index}
                className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`bg-gradient-to-r ${cert.gradient} p-4 rounded-3xl inline-block mb-6 shadow-lg`}
                  >
                    <Award className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-4 text-gray-800 leading-tight">
                    {cert.name}
                  </h3>
                  <p className="text-gray-600 font-semibold">Year in cooperation: {cert.years}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
