'use client'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Star } from 'lucide-react'
import { Marquee } from '@/components/magicui/marquee'

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Nguyễn Văn An',
      location: 'Hà Nội',
      rating: 5,
      comment:
        'Dịch vụ tuyệt vời! Xe đúng giờ, tài xế lịch sự, ghế ngồi rất thoải mái. Tôi sẽ sử dụng lại dịch vụ này.',
      avatar: 'NA',
    },
    {
      name: 'Trần Thị Mai',
      location: 'TP. Hồ Chí Minh',
      rating: 5,
      comment:
        'Đặt vé online rất dễ dàng, thanh toán nhanh chóng. Chuyến đi Hà Nội - Sài Gòn tuyệt vời, sẽ giới thiệu cho bạn bè.',
      avatar: 'TM',
    },
    {
      name: 'Lê Minh Tuấn',
      location: 'Đà Nẵng',
      rating: 5,
      comment:
        'Chất lượng dịch vụ vượt mong đợi. Xe limousine cao cấp, wifi mạnh, phục vụ chu đáo. Rất hài lòng!',
      avatar: 'LT',
    },
    {
      name: 'Phạm Thị Hoa',
      location: 'Cần Thơ',
      rating: 5,
      comment:
        'Giá cả hợp lý, dịch vụ chuyên nghiệp. Hệ thống đặt vé rất tiện lợi, không cần phải ra bến xe.',
      avatar: 'PH',
    },
    {
      name: 'Hoàng Văn Nam',
      location: 'Hải Phòng',
      rating: 5,
      comment:
        'Xe sạch sẽ, thoải mái. Tài xế lái xe an toàn, đúng giờ. Rất recommend cho mọi người.',
      avatar: 'HN',
    },
    {
      name: 'Võ Thị Lan',
      location: 'Nha Trang',
      rating: 5,
      comment:
        'App đặt vé dễ sử dụng, thanh toán online tiện lợi. Chuyến đi rất thoải mái và an toàn.',
      avatar: 'VL',
    },
    {
      name: 'Hoàng Văn Nam',
      location: 'Hải Phòng',
      rating: 5,
      comment:
        'Xe sạch sẽ, thoải mái. Tài xế lái xe an toàn, đúng giờ. Rất recommend cho mọi người.',
      avatar: 'HN',
    },
    {
      name: 'Hoàng Văn Nam',
      location: 'Hải Phòng',
      rating: 5,
      comment:
        'Xe sạch sẽ, thoải mái. Tài xế lái xe an toàn, đúng giờ. Rất recommend cho mọi người.',
      avatar: 'HN',
    },
    {
      name: 'Hoàng Văn Nam',
      location: 'Hải Phòng',
      rating: 5,
      comment:
        'Xe sạch sẽ, thoải mái. Tài xế lái xe an toàn, đúng giờ. Rất recommend cho mọi người.',
      avatar: 'HN',
    },
    {
      name: 'Hoàng Văn Nam',
      location: 'Hải Phòng',
      rating: 5,
      comment:
        'Xe sạch sẽ, thoải mái. Tài xế lái xe an toàn, đúng giờ. Rất recommend cho mọi người.',
      avatar: 'HN',
    },
  ]

  const TestimonialCard = ({ testimonial }: { testimonial: (typeof testimonials)[0] }) => (
    <Card className="glass-card border-0 hover-lift w-80 mx-4">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Avatar className="h-12 w-12 mr-4">
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
              {testimonial.avatar}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
            <p className="text-sm text-muted-foreground">{testimonial.location}</p>
          </div>
        </div>

        <div className="flex mb-3">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>

        <p className="text-muted-foreground italic">&quot;{testimonial.comment}&quot;</p>
      </CardContent>
    </Card>
  )

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 mb-16">
        <div className="text-center animate-fade-in">
          <h2 className="text-4xl font-bold gradient-text mb-4">Khách hàng nói gì về chúng tôi</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hàng nghìn khách hàng đã tin tưởng và lựa chọn dịch vụ của chúng tôi
          </p>
        </div>
      </div>

      <div className="relative">
        <Marquee pauseOnHover className="[--duration:30s]">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:30s] mt-4">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </Marquee>
      </div>
    </section>
  )
}

export default TestimonialsSection
