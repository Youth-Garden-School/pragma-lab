import { Button } from "@/components/ui/button"
import React from "react"

interface SortOptionsProps {
  sortOptions: string[]
  activeSort: string | null
  setActiveSort: (value: string) => void
}

const SortOptions: React.FC<SortOptionsProps> = ({ sortOptions, activeSort, setActiveSort }) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="whitespace-nowrap">Sắp xếp theo: </div>
      {sortOptions.map((label, i) => (
        <Button
          key={i}
          className={`rounded-full border font-medium ${
            activeSort === label
              ? "bg-cyan-400 hover:bg-cyan-400 text-white border-transparent"
              : "bg-white hover:bg-white text-gray-800 border-gray-300"
          }`}
          onClick={() => setActiveSort(label)}
        >
          {label}
        </Button>

      ))}
    </div>
  )
}

export default SortOptions
