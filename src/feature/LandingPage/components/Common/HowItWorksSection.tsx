'use client'
import { useRef } from 'react'
import { Calendar, MapPin, Car } from 'lucide-react'

const HowItWorksSection = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  const steps = [
    {
      icon: Calendar,
      title: 'Chọn thời gian',
      description: 'Tùy chọn lịch trình của bạn bằng cách chọn thời gian điểm xuất phát.',
      color: 'from-sky-400 to-sky-500',
    },
    {
      icon: MapPin,
      title: 'Chọn điểm đến',
      description: 'Khám phá các địa điểm hấp dẫn và đa dạng, chọn điểm đến mà bạn muốn khám phá.',
      color: 'from-sky-400 to-sky-500',
    },
    {
      icon: Car,
      title: 'Chọn chuyến',
      description: 'Tìm kiếm và chọn chuyến đi phù hợp với nhu cầu của bạn.',
      color: 'from-sky-400 to-sky-500',
    },
  ]

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-[120px]">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">Dễ Dàng Đặt Vé</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Bạn có thể dễ dàng sử dụng dịch vụ của chúng tôi chỉ với
            <br />
            vài thao tác !
          </p>
        </div>

        <div ref={containerRef} className="max-w-7xl mx-auto relative">
          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 relative z-10">
            {steps.map((step, index) => (
              <div
                key={index}
                className="text-center group"
                style={{ animationDelay: `${0.2 * index}s` }}
              >
                {/* Icon Container */}
                <div className="relative mb-8 flex justify-center">
                  <div className="relative">
                    {/* Glow effect */}
                    <div
                      className={`absolute inset-0 w-24 h-24 rounded-3xl bg-gradient-to-r ${step.color} opacity-20 blur-xl group-hover:opacity-30 transition-all duration-500`}
                    ></div>

                    {/* Main icon container */}
                    <div
                      className={`relative w-24 h-24 rounded-3xl bg-gradient-to-r ${step.color} flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:shadow-2xl transition-all duration-500 border-4 border-white`}
                      style={{
                        background: `linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)`,
                        boxShadow:
                          '0 20px 40px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <step.icon className="h-12 w-12 text-white drop-shadow-lg" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .group:hover .relative > div:first-child {
          animation: float 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-pulse {
          animation: pulse 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}

export default HowItWorksSection
