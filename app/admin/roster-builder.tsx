"use client"

import { useState } from "react"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface StaffMember {
  id: string
  name: string
}

interface RosterBuilderProps {
  staffList: StaffMember[]
}

export default function RosterBuilder({ staffList }: RosterBuilderProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedStaffId, setSelectedStaffId] = useState<string>("")

  return (
    <div className="flex flex-col space-y-6 mt-8">
      
      {/* Control Panel */}
      <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-lg border shadow-sm">
        
        {/* Date Picker */}
        <div className="flex-1 space-y-2">
          <h2 className="text-sm font-semibold text-foreground">Select Date</h2>
          <DatePicker date={selectedDate} setDate={setSelectedDate} />
        </div>

        {/* Staff Dropdown */}
        <div className="flex-1 space-y-2">
          <h2 className="text-sm font-semibold text-foreground">Assign Staff</h2>
          <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
            <SelectTrigger className="w-full sm:w-[280px]">
              <SelectValue placeholder="Select a team member" />
            </SelectTrigger>
            <SelectContent>
              {staffList.map((staff) => (
                <SelectItem key={staff.id} value={staff.id}>
                  {staff.name}
                </SelectItem>
              ))}
              {staffList.length === 0 && (
                <div className="p-2 text-sm text-muted-foreground text-center">No staff found.</div>
              )}
            </SelectContent>
          </Select>
        </div>

      </div>

      {/* Roster Display Box */}
      <div className="bg-muted/10 border-2 border-dashed border-border rounded-lg p-12 text-center text-muted-foreground">
        {selectedDate && selectedStaffId ? (
          <p>Ready to assign <strong className="text-foreground">{staffList.find(s => s.id === selectedStaffId)?.name}</strong> a shift on: <strong className="text-foreground">{selectedDate.toDateString()}</strong></p>
        ) : (
          <p>Please select a date and a staff member above.</p>
        )}
      </div>
      
    </div>
  )
}