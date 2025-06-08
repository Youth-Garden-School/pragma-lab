'use client'
import { useRef } from 'react'
import { Search, CreditCard, BusIcon } from 'lucide-react'
import { AnimatedBeam } from '@/components/magicui/animated-beam'

const HowItWorksSection = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const div1Ref = useRef<HTMLDivElement>(null)
  const div2Ref = useRef<HTMLDivElement>(null)
  const div3Ref = useRef<HTMLDivElement>(null)

  const steps = [
    {
      icon: Search,
      title: 'Tìm kiếm chuyến xe',
      description: 'Chọn điểm đi, điểm đến và ngày khởi hành phù hợp',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: CreditCard,
      title: 'Thanh toán an toàn',
      description: 'Thanh toán nhanh chóng qua nhiều phương thức',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: BusIcon,
      title: 'Lên xe và khởi hành',
      description: 'Đến điểm đón theo giờ và tận hưởng hành trình',
      color: 'from-purple-500 to-purple-600',
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      <div className="container mx-auto px-[120px]">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold gradient-text mb-4">Đặt vé chỉ với 3 bước đơn giản</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Quy trình đặt vé nhanh chóng, thuận tiện, chỉ cần vài phút
          </p>
        </div>

        <div ref={containerRef} className="max-w-6xl mx-auto relative">
          {/* Staggered Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Step 1 - Top */}
            <div
              ref={div1Ref}
              className="text-center animate-fade-in relative z-10 md:mt-0"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="relative mb-8 flex justify-center">
                <div
                  className={`w-20 h-20 rounded-full bg-gradient-to-r ${steps[0].color} flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 relative`}
                >
                  <Search className="h-10 w-10 text-white" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                    <span className="text-sm font-bold gradient-text">1</span>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-3 text-foreground">{steps[0].title}</h3>
              <p className="text-muted-foreground">{steps[0].description}</p>
            </div>

            {/* Step 2 - Middle (offset down) */}
            <div
              ref={div2Ref}
              className="text-center animate-fade-in relative z-10 md:mt-16"
              style={{ animationDelay: '0.4s' }}
            >
              <div className="relative mb-8 flex justify-center">
                <div
                  className={`w-20 h-20 rounded-full bg-gradient-to-r ${steps[1].color} flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 relative`}
                >
                  <CreditCard className="h-10 w-10 text-white" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                    <span className="text-sm font-bold gradient-text">2</span>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-3 text-foreground">{steps[1].title}</h3>
              <p className="text-muted-foreground">{steps[1].description}</p>
            </div>

            {/* Step 3 - Bottom (offset up slightly) */}
            <div
              ref={div3Ref}
              className="text-center animate-fade-in relative z-10 md:mt-8"
              style={{ animationDelay: '0.6s' }}
            >
              <div className="relative mb-8 flex justify-center">
                <div
                  className={`w-20 h-20 rounded-full bg-gradient-to-r ${steps[2].color} flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 relative`}
                >
                  <BusIcon className="h-10 w-10 text-white" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                    <span className="text-sm font-bold gradient-text">3</span>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-3 text-foreground">{steps[2].title}</h3>
              <p className="text-muted-foreground">{steps[2].description}</p>
            </div>
          </div>

          {/* Enhanced Animated Beams with custom positioning */}
          <div className="absolute inset-0 pointer-events-none hidden md:block">
            {containerRef.current && div1Ref.current && div2Ref.current && (
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={div1Ref}
                toRef={div2Ref}
                duration={2}
                delay={1}
                curvature={30}
                gradientStartColor="#3b82f6"
                gradientStopColor="#10b981"
                pathWidth={3}
                pathOpacity={0.6}
              />
            )}
            {containerRef.current && div2Ref.current && div3Ref.current && (
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={div2Ref}
                toRef={div3Ref}
                duration={2}
                delay={2}
                curvature={-30}
                gradientStartColor="#10b981"
                gradientStopColor="#8b5cf6"
                pathWidth={3}
                pathOpacity={0.6}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection
