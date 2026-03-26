"use client"

import { useState } from "react"
import { DatePicker } from "@/components/ui/date-picker"

export default function RosterBuilder() {
  // This state holds the currently selected date. It defaults to today!
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  return (
    <div className="flex flex-col space-y-6 mt-8">
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-zinc-800">Select Date</h2>
          <p className="text-sm text-zinc-500">Choose a day to view or assign shifts.</p>
        </div>
        
        <DatePicker date={selectedDate} setDate={setSelectedDate} />
      </div>

      {/* A placeholder for where our shifts will go next! */}
      <div className="bg-zinc-100 border-2 border-dashed border-zinc-200 rounded-lg p-12 text-center text-zinc-500">
        {selectedDate ? (
          <p>Ready to build the roster for: <strong className="text-zinc-800">{selectedDate.toDateString()}</strong></p>
        ) : (
          <p>Please select a date above.</p>
        )}
      </div>
    </div>
  )
}