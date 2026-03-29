"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { clockIn, clockOut } from "./actions"

export default function Timeclock({ 
  employeeId, 
  activeTimesheetId 
}: { 
  employeeId: string; 
  activeTimesheetId: string | null;
}) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClockIn = async () => {
    setIsLoading(true)
    const result = await clockIn(employeeId)
    setIsLoading(false)

    if (result.success) {
      toast.success("Clocked in successfully! Have a great shift.")
    } else {
      toast.error(result.error || "Failed to clock in.")
    }
  }

  const handleClockOut = async () => {
    if (!activeTimesheetId) return
    
    setIsLoading(true)
    const result = await clockOut(activeTimesheetId)
    setIsLoading(false)

    if (result.success) {
      toast.success("Clocked out. Great work today!")
    } else {
      toast.error(result.error || "Failed to clock out.")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-card border border-border rounded-xl shadow-sm space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Timeclock</h2>
      
      {activeTimesheetId ? (
        <>
          <p className="text-muted-foreground">You are currently clocked in.</p>
          <Button 
            variant="destructive" 
            size="lg" 
            className="w-full sm:w-64 h-24 text-2xl font-bold transition-all hover:scale-105 active:scale-95"
            onClick={handleClockOut}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Clock Out"}
          </Button>
        </>
      ) : (
        <>
          <p className="text-muted-foreground">Ready to start your shift?</p>
          <Button 
            size="lg" 
            // We force a custom green background since Shadcn doesn't have a default "success" variant
            className="w-full sm:w-64 h-24 text-2xl font-bold bg-green-600 hover:bg-green-700 text-white transition-all hover:scale-105 active:scale-95"
            onClick={handleClockIn}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Clock In"}
          </Button>
        </>
      )}
    </div>
  )
}