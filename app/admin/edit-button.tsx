"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { updateShift } from "./actions"

export default function EditButton({ shift }: { shift: any }) {
  const [open, setOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // Initialize the form with the current shift data
  const [date, setDate] = useState(shift.date)
  const [startTime, setStartTime] = useState(shift.start_time.slice(0, 5))
  const [endTime, setEndTime] = useState(shift.end_time.slice(0, 5))

  const handleUpdate = async () => {
    setIsUpdating(true)
    
    // Call the server action you added in the last step
    const result = await updateShift(shift.id, {
      date,
      start_time: startTime,
      end_time: endTime,
    })
    
    setIsUpdating(false)

    if (result.success) {
      setOpen(false) // Close the modal on success
    } else {
      alert("Failed to update shift: " + result.error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Shift</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Date</label>
            <Input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Start Time</label>
              <Input 
                type="time" 
                value={startTime} 
                onChange={(e) => setStartTime(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">End Time</label>
              <Input 
                type="time" 
                value={endTime} 
                onChange={(e) => setEndTime(e.target.value)} 
              />
            </div>
          </div>
        </div>

        <Button onClick={handleUpdate} disabled={isUpdating} className="w-full">
          {isUpdating ? "Saving..." : "Save Changes"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}