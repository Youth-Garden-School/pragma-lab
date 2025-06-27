// StepIndicator.tsx
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import React from "react"
import { Check } from "lucide-react"

const steps = [
  { step: 1, label: "Điểm đón trả" },
  { step: 2, label: "Nhập thông tin" },
]

export default function StepIndicator({ step }: { step: number }) {
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex items-center relative">
        {/* Progress line background */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 -z-10"></div>
        
        {/* Active progress line */}
        <div 
          className={cn(
            "absolute top-4 left-4 h-0.5 bg-gradient-to-r from-cyan-500 to-cyan-400 -z-10 transition-all duration-500 ease-out",
            step === 1 ? "w-0" : "right-4"
          )}
        ></div>

        {steps.map((s, i) => (
          <React.Fragment key={s.step}>
            <div className="flex flex-col items-center relative">
              {/* Step circle */}
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ease-out border-2 relative overflow-hidden",
                  step > s.step
                    ? "bg-cyan-500 border-cyan-500 text-white scale-110 shadow-lg shadow-cyan-500/30"
                    : step === s.step
                    ? "bg-cyan-500 border-cyan-500 text-white scale-110 shadow-lg shadow-cyan-500/30"
                    : "bg-white border-gray-300 text-gray-400 hover:border-gray-400"
                )}
              >
                {step > s.step ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="transition-all duration-200">{s.step}</span>
                )}
              </div>

              {/* Step label */}
              <div className="mt-3 text-center min-h-[2.5rem] flex items-center">
                <span
                  className={cn(
                    "text-sm font-medium transition-all duration-300 px-2 py-1 rounded-md whitespace-nowrap",
                    step >= s.step
                      ? "text-cyan-600 bg-cyan-50 font-semibold"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  {s.label}
                </span>
              </div>

              {/* Step description (subtle) */}
              <div className="mt-1 text-center">
                <span
                  className={cn(
                    "text-xs transition-all duration-300",
                    step >= s.step
                      ? "text-cyan-500 opacity-70"
                      : "text-gray-400 opacity-0"
                  )}
                >
                </span>
              </div>
            </div>
            
            {/* Connecting line */}
            {i < steps.length - 1 && (
              <div className="flex-1 h-0.5 bg-gray-200 mx-4 mt-4 relative">
                <div 
                  className={cn(
                    "h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-500 ease-out",
                    step > s.step ? "w-full" : "w-0"
                  )}
                ></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>


    </div>
  )
}