"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { updateTimesheetStatus } from "./actions"

export default function TimesheetButtons({ 
  timesheetId, 
  currentStatus 
}: { 
  timesheetId: string; 
  currentStatus: string;
}) {
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdate = async (status: 'approved' | 'rejected') => {
    setIsLoading(true)
    const result = await updateTimesheetStatus(timesheetId, status)
    setIsLoading(false)

    if (result.success) {
      toast.success(`Timesheet marked as ${status}!`)
    } else {
      toast.error(result.error || "Failed to update timesheet")
    }
  }

  // If it's already approved or rejected, just show the text instead of buttons
  if (currentStatus !== 'pending') {
    return (
      <span className={`text-sm font-semibold uppercase tracking-wider ${
        currentStatus === 'approved' ? 'text-green-600' : 'text-red-600'
      }`}>
        {currentStatus}
      </span>
    )
  }

  return (
    <div className="flex gap-2">
      <Button 
        size="sm" 
        variant="outline" 
        className="border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950" 
        onClick={() => handleUpdate('approved')} 
        disabled={isLoading}
      >
        Approve
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        className="border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-950" 
        onClick={() => handleUpdate('rejected')} 
        disabled={isLoading}
      >
        Reject
      </Button>
    </div>
  )
}