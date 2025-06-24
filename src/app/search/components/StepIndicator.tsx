// StepIndicator.tsx
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import React from "react"

const steps = [
  { step: 1, label: "Điểm đón trả" },
  { step: 2, label: "Nhập thông tin" },
]

export default function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-between mb-4">
      {steps.map((s, i) => (
        <React.Fragment key={s.step}>
          <div className="flex items-center space-x-2">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold",
                step === s.step ? "bg-cyan-500" : "bg-gray-500"
              )}
            >
              {s.step}
            </div>
            <span
              className={cn(
                "font-medium",
                step === s.step ? "text-cyan-600" : "text-gray-700"
              )}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <Separator className="w-12 mx-2 bg-gray-400 h-px" />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
