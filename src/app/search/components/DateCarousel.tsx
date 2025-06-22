import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format, isSameDay } from "date-fns"
import React from "react"

interface DateSelectorProps {
  dateOptions: Date[]
  departureDate: Date
  setDepartureDate: (date: Date) => void
  activeDateIndex: number | null
  setActiveDateIndex: (index: number | null) => void
}

const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]

export default function DateSelector({
  dateOptions,
  departureDate,
  setDepartureDate,
  activeDateIndex,
  setActiveDateIndex,
}: DateSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto">
      {dateOptions.map((date, i) => (
        <Button
          key={i}
          variant={i === activeDateIndex ? "default" : "outline"}
          className={i === activeDateIndex ? "bg-cyan-500 text-white hover:bg-cyan-500" : ""}
          onClick={() => {
            setDepartureDate(date)
            setActiveDateIndex(i)
          }}
        >
          {weekDays[date.getDay()]} {format(date, "dd-MM-yyyy")}
        </Button>
      ))}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <CalendarIcon className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white">
          <Calendar
            mode="single"
            selected={departureDate}
            onSelect={(date) => {
              if (date) {
                setDepartureDate(date)
                const index = dateOptions.findIndex((d) => isSameDay(d, date))
                setActiveDateIndex(index >= 0 ? index : null)
              }
            }}
            disabled={(date) => date < new Date()}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
