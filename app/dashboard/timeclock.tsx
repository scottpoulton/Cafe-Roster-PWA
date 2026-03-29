"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { clockIn, clockOut } from "./actions"
import { MapPin, MapPinOff, Loader2 } from "lucide-react"

// Your Testing Coordinates (We'll update these to the real Cafe later)
const CAFE_LAT = -33.9652577702523
const CAFE_LNG = 151.13555277116413
const ALLOWED_RADIUS_METERS = 100

// The Haversine Formula (Calculates distance in meters between two GPS coordinates)
function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3 // Earth's radius in meters
  const p1 = lat1 * Math.PI / 180
  const p2 = lat2 * Math.PI / 180
  const dp = (lat2 - lat1) * Math.PI / 180
  const dl = (lon2 - lon1) * Math.PI / 180

  const a = Math.sin(dp / 2) * Math.sin(dp / 2) +
            Math.cos(p1) * Math.cos(p2) *
            Math.sin(dl / 2) * Math.sin(dl / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

export default function Timeclock({ 
  employeeId, 
  activeTimesheetId 
}: { 
  employeeId: string; 
  activeTimesheetId: string | null;
}) {
  const [isLoading, setIsLoading] = useState(false)
  
  // New Geolocation States
  const [isCheckingLocation, setIsCheckingLocation] = useState(true)
  const [isWithinRange, setIsWithinRange] = useState(false)
  const [locationMessage, setLocationMessage] = useState<string>("Verifying your location...")

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationMessage("Geolocation is not supported by your browser.")
      setIsCheckingLocation(false)
      return
    }

    // Ask the browser for the user's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const distance = getDistanceInMeters(
          CAFE_LAT, 
          CAFE_LNG, 
          position.coords.latitude, 
          position.coords.longitude
        )
        
        if (distance <= ALLOWED_RADIUS_METERS) {
          setIsWithinRange(true)
          setLocationMessage("You are at the cafe. Ready to work!")
        } else {
          setIsWithinRange(false)
          setLocationMessage(`You are ${Math.round(distance)}m away. You must be within ${ALLOWED_RADIUS_METERS}m of the cafe.`)
        }
        setIsCheckingLocation(false)
      },
      (error) => {
        setIsWithinRange(false)
        setLocationMessage("Please allow location access in your browser to clock in.")
        setIsCheckingLocation(false)
      },
      { enableHighAccuracy: true } // Force the browser to use GPS, not just rough IP estimation
    )
  }, [])

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

  // Prevent clicking if location is still checking OR if they are outside the radius
  const isButtonDisabled = isLoading || isCheckingLocation || !isWithinRange

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-card border border-border rounded-xl shadow-sm space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Timeclock</h2>
        
        {/* Geolocation Status Indicator */}
        <div className={`flex items-center justify-center gap-2 text-sm font-medium ${
          isCheckingLocation ? "text-amber-500" : isWithinRange ? "text-green-600" : "text-destructive"
        }`}>
          {isCheckingLocation ? (
            <Loader2 className="size-4 animate-spin" />
          ) : isWithinRange ? (
            <MapPin className="size-4" />
          ) : (
            <MapPinOff className="size-4" />
          )}
          <span>{locationMessage}</span>
        </div>
      </div>
      
      {activeTimesheetId ? (
        <Button 
          variant="destructive" 
          size="lg" 
          className="w-full sm:w-64 h-24 text-2xl font-bold transition-all hover:scale-105 active:scale-95"
          onClick={handleClockOut}
          disabled={isButtonDisabled}
        >
          {isLoading ? "Processing..." : "Clock Out"}
        </Button>
      ) : (
        <Button 
          size="lg" 
          className={`w-full sm:w-64 h-24 text-2xl font-bold transition-all ${
            isButtonDisabled 
              ? "bg-muted text-muted-foreground" 
              : "bg-green-600 hover:bg-green-700 text-white hover:scale-105 active:scale-95"
          }`}
          onClick={handleClockIn}
          disabled={isButtonDisabled}
        >
          {isLoading ? "Processing..." : "Clock In"}
        </Button>
      )}
    </div>
  )
}