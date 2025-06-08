'use client'
import { Shield, Clock, CreditCard, Headphones, MapPin, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const ANIMATION_DELAY_STEP = 0.1

const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: 'An toàn tuyệt đối',
      description: 'Đội ngũ tài xế chuyên nghiệp, xe được bảo dưỡng định kỳ',
      color: 'from-green-500 to-emerald-600',
    },
    {
      icon: Clock,
      title: 'Đúng giờ',
      description: 'Cam kết đúng giờ khởi hành, theo dõi hành trình realtime',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      icon: CreditCard,
      title: 'Thanh toán dễ dàng',
      description: 'Hỗ trợ đa dạng phương thức thanh toán an toàn',
      color: 'from-purple-500 to-violet-600',
    },
    {
      icon: Headphones,
      title: 'Hỗ trợ 24/7',
      description: 'Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ',
      color: 'from-orange-500 to-red-600',
    },
    {
      icon: MapPin,
      title: 'Mạng lưới rộng khắp',
      description: 'Phủ sóng toàn quốc với hơn 500 tuyến đường',
      color: 'from-pink-500 to-rose-600',
    },
    {
      icon: Star,
      title: 'Chất lượng cao',
      description: 'Xe limousine cao cấp, ghế massage, wifi miễn phí',
      color: 'from-yellow-500 to-amber-600',
    },
  ]

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-r from-blue-100/50 to-purple-100/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-r from-green-100/50 to-blue-100/50 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-[120px] relative">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
            <span className="text-sm font-medium gradient-text">Ưu điểm vượt trội</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold gradient-text mb-4">
            Tại sao chọn chúng tôi?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Trải nghiệm dịch vụ xe khách hàng đầu với những ưu điểm vượt trội
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="glass-card border-0 hover-lift animate-fade-in group relative overflow-hidden"
              style={{ animationDelay: `${index * ANIMATION_DELAY_STEP}s` }}
            >
              <CardContent className="p-8 text-center relative z-10">
                <div
                  className={`mx-auto w-20 h-20 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg`}
                >
                  <feature.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground group-hover:text-foreground transition-colors">
                  {feature.description}
                </p>
              </CardContent>
              {/* Hover Effect Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              ></div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
