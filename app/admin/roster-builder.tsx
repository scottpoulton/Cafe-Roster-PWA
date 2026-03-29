import { toast } from "sonner"

"use client"

import { useState } from "react"
import { format } from "date-fns"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createShift } from "./actions"

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
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("17:00")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSaveShift = async () => {
    if (!selectedDate || !selectedStaffId || !startTime || !endTime) return

    setIsSubmitting(true)

    // Format the date to YYYY-MM-DD for PostgreSQL
    const formattedDate = format(selectedDate, "yyyy-MM-dd")

    // Call our secure Server Action
    const result = await createShift({
      employee_id: selectedStaffId,
      date: formattedDate,
      start_time: startTime,
      end_time: endTime,
    })

    setIsSubmitting(false)

    if (result.success) {
      toast.success("Shift saved successfully") 
      setSelectedStaffId("")
    } else {
      toast.error(result.error || "Failed to save shift") // <-- Shows our Zod errors perfectly!
    }
  }

  return (
    <div className="flex flex-col space-y-6 mt-8">
      
      {/* Control Panel */}
      <div className="flex flex-col gap-6 bg-card p-6 rounded-lg border shadow-sm">
        
        {/* Row 1: Date and Staff */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <h2 className="text-sm font-semibold text-foreground">Select Date</h2>
            <DatePicker date={selectedDate} setDate={setSelectedDate} />
          </div>

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

        {/* Row 2: Times */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <h2 className="text-sm font-semibold text-foreground">Start Time</h2>
            <Input 
              type="time" 
              value={startTime} 
              onChange={(e) => setStartTime(e.target.value)} 
              className="w-full sm:w-[280px]"
            />
          </div>

          <div className="flex-1 space-y-2">
            <h2 className="text-sm font-semibold text-foreground">End Time</h2>
            <Input 
              type="time" 
              value={endTime} 
              onChange={(e) => setEndTime(e.target.value)} 
              className="w-full sm:w-[280px]"
            />
          </div>
        </div>

        {/* Row 3: Submit Action */}
        <div className="pt-2">
          <Button 
            onClick={handleSaveShift}
            disabled={!selectedDate || !selectedStaffId || !startTime || !endTime || isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? "Saving..." : "Save Shift"}
          </Button>
        </div>

      </div>

      {/* Roster Display Box */}
      <div className="bg-muted/10 border-2 border-dashed border-border rounded-lg p-12 text-center text-muted-foreground flex flex-col items-center justify-center space-y-2">
        {selectedDate && selectedStaffId ? (
          <>
            <p>
              Ready to assign <strong className="text-foreground">{staffList.find(s => s.id === selectedStaffId)?.name}</strong> a shift on <strong className="text-foreground">{selectedDate.toDateString()}</strong>
            </p>
            <p className="text-sm">
              From <strong className="text-foreground">{startTime}</strong> to <strong className="text-foreground">{endTime}</strong>
            </p>
          </>
        ) : (
          <p>Please select a date and a staff member above.</p>
        )}
      </div>
      
    </div>
  )
}