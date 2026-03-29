"use client"

import { useState } from "react"
import { toast } from "sonner" 
import { Button } from "@/components/ui/button"
import { deleteShift } from "./actions"

export default function DeleteButton({ shiftId }: { shiftId: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this shift?")) return
    
    setIsDeleting(true)
    const result = await deleteShift(shiftId)
    
    if (result.success) {
      toast.success("Shift deleted") 
    } else {
      toast.error(result.error || "Failed to delete shift") 
  }

    setIsDeleting(false) 
  }

  return (
    <Button 
      variant="destructive" 
      size="sm" 
      onClick={handleDelete} 
      disabled={isDeleting}
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </Button>
  )
}