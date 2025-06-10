import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Phone, Mail, MessageCircle, HelpCircle, CreditCard, MapPin, Clock, Users, Smartphone, Car } from "lucide-react"
import Footer from '@/components/Common/Layout/Footer'
import Header from '@/components/Common/Layout/Header'

export default function SupportPage() {
  const faqSections = [
    {
      title: "Câu hỏi liên quan đến giá vé, hành trình, quy định",
      icon: HelpCircle,
      questions: [
        {
          question: "Nếu có thay đổi trong lịch trình chuyến xe đã đặt, tôi sẽ nhận được thông báo như thế nào?",
          answer:
            "Trong trường hợp có bất kỳ thay đổi nào về thời gian khởi hành hoặc các chi tiết khác của chuyến xe, công ty sẽ chủ động liên hệ với quý khách thông qua điện thoại hoặc email đã đăng ký. Chúng tôi cam kết cung cấp thông tin kịp thời và đề xuất các phương án thay thế phù hợp để đảm bảo quý khách có thể sắp xếp lại kế hoạch của mình một cách thuận tiện nhất.",
        },
        {
          question: "Công ty áp dụng chính sách vé xe cho trẻ em như thế nào?",
          answer:
            "Theo quy định của Công ty:\n• Trẻ em từ 5 tuổi trở lên: Vé tương đương với giá vé người lớn thông thường.\n• Trẻ em dưới 5 tuổi, chiều cao dưới 1.3m, cân nặng dưới 30kg: Có thể đi kèm với người lớn (2 người lớn chỉ được kèm 1 trẻ).",
        },
        {
          question: "Quý khách có thể sử dụng những phương thức nào để mua vé xe của Toàn Thắng Car?",
          answer:
            "• Đến trực tiếp các điểm bán vé của Toàn Thắng.\n• Đặt mua online thông qua website DATVEXE hoặc ứng dụng di động.\n• Gọi đến Trung Tâm Tổng Đài để đăng ký giữ chỗ và thanh toán qua QR code.",
        },
        {
          question: "Tôi có thể thanh toán vé mua online bằng những phương thức nào?",
          answer:
            "• Thẻ tín dụng VISA/MASTER.\n• Thẻ ATM nội địa có đăng ký internet banking.\n• Ví điện tử như Momo, ZaloPay, ShopeePay, VNPAY",
        },
        {
          question:
            "Tôi đi xe thường xuyên giữa các tỉnh, công ty có chính sách ưu đãi gì cho khách hàng như tôi không?",
          answer:
            "Công ty thường xuyên cung cấp các chương trình khuyến mãi đặc biệt cho khách hàng thường xuyên thông qua các app liên kết như Momo, ZaloPay, VN Pay. Thông tin chi tiết về các chương trình khuyến mãi luôn được cập nhật trên website và fanpage của công ty.",
        },
        {
          question: "Khi mua vé qua website, tôi có thể tự chọn chỗ ngồi không?",
          answer:
            "Quý khách có quyền chủ động chọn vị trí chỗ ngồi khi đặt vé qua website hoặc app. Đối với việc đăng ký vé qua tổng đài hoặc mua trực tiếp tại văn phòng, quý khách cũng có thể yêu cầu chỗ ngồi theo nhu cầu cá nhân.",
        },
        {
          question: "Giá vé được hiển thị trên website đã bao gồm những phí gì?",
          answer: "Giá vé xe của Công ty đã bao gồm thuế VAT, phí bảo hiểm du lịch và không phát sinh thêm phụ phí.",
        },
        {
          question: "Trong trường hợp tôi có nhu cầu cần hủy vé, tôi phải làm gì?",
          answer:
            "Thời gian hủy vé:\n• Từ 1-3 vé: trước ít nhất 4 tiếng giờ khởi hành\n• Từ 4-9 vé: trước ít nhất 24 tiếng giờ khởi hành\n• Từ 10 vé trở lên: trước ít nhất 48 tiếng giờ khởi hành\n\nPhí hủy áp dụng:\n• Trước ít nhất 4 tiếng: 10%/vé\n• Trước ít nhất 30 phút: 30%/vé\n• Sau 30 phút: Không hỗ trợ hủy",
        },
      ],
    },
    {
      title: "Câu hỏi liên quan đến APP DATVEXE",
      icon: Smartphone,
      questions: [
        {
          question: "APP DATVEXE được dùng với mục đích gì?",
          answer:
            "App DATVEXE giúp khách hàng đặt mua vé xe dễ dàng ở mọi nơi, với nhiều lựa chọn thanh toán tiện lợi. Người dùng có thể quản lý vé đã mua, xem lịch trình xe, kiểm tra vị trí ghế ngồi, giá vé và cập nhật thông tin về các chương trình khuyến mãi của công ty.",
        },
        {
          question: "Tôi có thể hủy vé đã đặt trên App DATVEXE và được hoàn tiền không?",
          answer:
            "Quý khách có thể hủy vé chưa được chuyển đổi thành vé giấy thông qua App bằng cách truy cập vào mục 'Lịch sử'. Lưu ý:\n• Khi hủy, tất cả các vé trong cùng một mã đặt chỗ sẽ được hủy đồng loạt\n• Đối với 1-3 vé, hủy trước ít nhất 24 giờ sẽ chịu phí 10%\n• Tiền hoàn sẽ được chuyển về tài khoản ban đầu trong 7-15 ngày",
        },
      ],
    },
    {
      title: "Câu hỏi liên quan đến quy định trung chuyển",
      icon: Car,
      questions: [
        {
          question: "Dịch vụ trung chuyển được áp dụng tại khu vực nào?",
          answer:
            "Dịch vụ trung chuyển của Công ty hiện đang áp dụng tại các khu vực Bà Rịa và Vũng Tàu. Trung chuyển tận nơi đối với khu vực Vũng Tàu và trung chuyển trong bán kính 7km đối với khu vực Bà Rịa.",
        },
        {
          question: "Liệu có dịch vụ trung chuyển tận nơi tại TPHCM không?",
          answer:
            "Hiện nay, Toàn Thắng chưa cung cấp dịch vụ trung chuyển tận nơi tại TPHCM. Quý khách hàng vui lòng tới các bến xe, trạm hoặc điểm đón gần nhất để sử dụng dịch vụ xe.",
        },
        {
          question: "Dịch vụ này có mất phí không?",
          answer: "Dịch vụ trung chuyển là dịch vụ miễn phí đi kèm dành cho khách hàng.",
        },
        {
          question: "Tôi có được liên hệ để cập nhật điểm đón trung chuyển không?",
          answer:
            "Đối với các tuyến xe từ các tỉnh thành, nhân viên sẽ liên hệ đến quý khách để tư vấn hỗ trợ cập nhật điểm đón. Tuy nhiên, chúng tôi khuyến khích quý khách chủ động liên hệ trực tiếp đến văn phòng vé để cung cấp điểm đón.",
        },
      ],
    },
  ]

  const contactMethods = [
    {
      icon: Phone,
      title: "Tổng đài hỗ trợ",
      content: "19006968",
      description: "Hỗ trợ 24/7",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Mail,
      title: "Email hỗ trợ",
      content: "support@datvexe.com",
      description: "Phản hồi trong 24h",
      color: "from-blue-600 to-blue-700",
    },
    {
      icon: MessageCircle,
      title: "Chat trực tuyến",
      content: "Messenger/Zalo",
      description: "Phản hồi nhanh",
      color: "from-blue-700 to-blue-800",
    },
  ]

  return (
    <div className="min-h-screen bg-blue-gradient-soft pt-[120px]">
      {/* Hero Section */}
      <Header />
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-blue-300/10 opacity-20" />

        <div className="container mx-auto px-4 md:px-[120px] relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block p-4 bg-blue-500/20 rounded-3xl mb-6">
              <HelpCircle className="h-16 w-16 text-blue-200" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
              Trung tâm hỗ trợ
            </h1>
            <div className="w-32 h-1.5 bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 mx-auto rounded-full mb-6"></div>
            <p className="text-xl md:text-2xl text-blue-100 font-light">Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7</p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-blue-50 to-transparent"></div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-300/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-500"></div>
      </section>

      <div className="container mx-auto px-4 md:px-[120px] -mt-10 relative z-20">
        {/* Contact Methods */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <Card
                key={index}
                className="bg-white/90 backdrop-blur-sm border-0 shadow-blue-lg rounded-3xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300"
              >
                <CardContent className="p-8 text-center">
                  <div className={`bg-gradient-to-r ${method.color} p-4 rounded-3xl inline-block mb-6 shadow-lg`}>
                    <method.icon className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-800 mb-2">{method.title}</h3>
                  <p className="text-2xl font-bold text-blue-600 mb-2">{method.content}</p>
                  <p className="text-gray-600">{method.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Sections */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-blue-gradient">Câu hỏi thường gặp</h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 mx-auto rounded-full mb-4"></div>
            <p className="text-xl text-blue-700 max-w-2xl mx-auto">Tìm câu trả lời cho những thắc mắc phổ biến</p>
          </div>

          <div className="space-y-12">
            {faqSections.map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-blue-lg p-8 border border-blue-100/30"
              >
                <div className="flex items-center mb-8">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-2xl mr-4">
                    <section.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-800">{section.title}</h3>
                </div>

                <Accordion type="single" collapsible className="space-y-4">
                  {section.questions.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`${sectionIndex}-${index}`}
                      className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200 px-6"
                    >
                      <AccordionTrigger className="text-left hover:no-underline py-6">
                        <span className="text-blue-800 font-semibold pr-4">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-6">
                        <div className="text-gray-700 leading-relaxed whitespace-pre-line bg-white/80 p-6 rounded-xl border border-blue-100">
                          {faq.answer}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </section>

        {/* Additional Support */}
        <section className="mb-20">
          <Card className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 border-0 shadow-blue-lg rounded-3xl overflow-hidden text-white">
            <CardContent className="p-12 text-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-blue-300/10 opacity-20" />
              <div className="relative z-10">
                <div className="inline-block p-4 bg-white/10 rounded-3xl mb-6">
                  <MessageCircle className="h-12 w-12 text-blue-200" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Cần hỗ trợ thêm?</h3>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                  Đội ngũ chăm sóc khách hàng của chúng tôi luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                    <span className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Hỗ trợ 24/7
                    </span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                    <span className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Đội ngũ chuyên nghiệp
                    </span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                    <span className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      Phản hồi nhanh chóng
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Quick Links */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-blue-800 mb-4">Liên kết hữu ích</h3>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: CreditCard, title: "Hướng dẫn thanh toán", desc: "Các phương thức thanh toán" },
              { icon: MapPin, title: "Điểm đón trả", desc: "Danh sách điểm đón trả khách" },
              { icon: Phone, title: "Liên hệ", desc: "Thông tin liên hệ chi tiết" },
              { icon: HelpCircle, title: "Chính sách", desc: "Điều khoản và chính sách" },
            ].map((link, index) => (
              <Card
                key={index}
                className="bg-white/80 backdrop-blur-sm border-0 shadow-blue rounded-2xl overflow-hidden hover:shadow-blue-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              >
                <CardContent className="p-6 text-center">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-2xl inline-block mb-4">
                    <link.icon className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-bold text-blue-800 mb-2">{link.title}</h4>
                  <p className="text-gray-600 text-sm">{link.desc}</p>
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
