'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import {
  Calendar as CalendarIcon,
  Users,
  Sparkles,
  Shield,
  Clock,
  X,
  Minus,
  Plus,
} from 'lucide-react'
import { format } from 'date-fns'
import { RetroGrid } from '@/components/magicui/retro-grid'

const HeroSection = () => {
  const [fromLocation, setFromLocation] = useState('')
  const [toLocation, setToLocation] = useState('')
  const [departureDate, setDepartureDate] = useState<Date>(new Date())
  const [adultCount, setAdultCount] = useState(1)
  const [childCount, setChildCount] = useState(0)
  const [showTicketPopover, setShowTicketPopover] = useState(false)

  const handleSearch = () => {
    console.log('Tìm kiếm:', { fromLocation, toLocation, departureDate, adultCount, childCount })
  }

  const incrementAdult = () => setAdultCount((prev) => prev + 1)
  const decrementAdult = () => setAdultCount((prev) => Math.max(1, prev - 1))
  const incrementChild = () => setChildCount((prev) => prev + 1)
  const decrementChild = () => setChildCount((prev) => Math.max(0, prev - 1))

  const totalTickets = adultCount + childCount

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32">
      <RetroGrid className="opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full mb-6 animate-bounce-in">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Đặt vé xe khách #1 Việt Nam</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="gradient-text">Đặt vé xe khách</span>
            <br />
            <span className="text-foreground">nhanh chóng & an toàn</span>
          </h1>

          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Hệ thống đặt vé xe khách hiện đại nhất Việt Nam. Hơn{' '}
            <span className="font-semibold text-blue-600">10,000</span> chuyến xe mỗi ngày, phục vụ{' '}
            <span className="font-semibold text-purple-600">1M+</span> khách hàng tin tưởng.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Bảo hiểm 100%</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>Đúng giờ 99%</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4 text-purple-500" />
              <span>Hỗ trợ 24/7</span>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <div
          className="glass-card max-w-5xl mx-auto p-6 rounded-2xl animate-fade-in"
          style={{
            animationDelay: '0.3s',
            border: '0.5px solid #3b82f6',
            boxShadow: '0 0 0 2px #3b82f6',
          }}
        >
          <div className="flex flex-wrap gap-4">
            {/* Điểm đón */}
            <div className="flex-1 min-w-[200px]">
              <div className="mb-2">
                <p className="text-sm font-medium text-muted-foreground">Điểm đón</p>
              </div>
              <div>
                <Input
                  placeholder="Chọn điểm xuất phát"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  className="h-11 border-2 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Điểm đến */}
            <div className="flex-1 min-w-[200px]">
              <div className="mb-2">
                <p className="text-sm font-medium text-muted-foreground">Điểm đến</p>
              </div>
              <div>
                <Input
                  placeholder="Chọn điểm đến"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  className="h-11 border-2 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Ngày giờ đi */}
            <div className="flex-1 min-w-[200px]">
              <div className="mb-2">
                <p className="text-sm font-medium text-muted-foreground">Ngày giờ đi</p>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-11 justify-start text-left font-normal border-2 hover:border-blue-500 transition-colors"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(departureDate, 'dd-MM-yyyy')}
                    <X className="ml-auto h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white" align="start">
                  <Calendar
                    mode="single"
                    selected={departureDate}
                    onSelect={(date) => date && setDepartureDate(date)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Số vé */}
            <div className="flex-1 min-w-[150px]">
              <div className="mb-2">
                <p className="text-sm font-medium text-muted-foreground">Số vé</p>
              </div>
              <Popover open={showTicketPopover} onOpenChange={setShowTicketPopover}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-11 justify-between border-2 hover:border-blue-500 transition-colors"
                  >
                    <span>{totalTickets} vé</span>
                    <X className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4 bg-white" align="start">
                  <div className="space-y-4">
                    {/* Người lớn/Trẻ em */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium">Người lớn/Trẻ em</p>
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={decrementAdult}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{adultCount}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={incrementAdult}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Từ đúng 5 tuổi trở lên vào ngày khởi hành
                      </p>
                    </div>

                    {/* Em bé */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium">Em bé</p>
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={decrementChild}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{childCount}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={incrementChild}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">Từ 1 tháng đến 5 tuổi</p>
                    </div>

                    <Button className="w-full" onClick={() => setShowTicketPopover(false)}>
                      Xong
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Tìm chuyến */}
            <div className="flex-1 min-w-[120px]">
              <div className="mb-2">
                <p className="text-sm font-medium text-muted-foreground">Tìm chuyến</p>
              </div>
              <Button
                onClick={handleSearch}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Tìm vé
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
