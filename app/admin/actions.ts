'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface ShiftPayload {
  employee_id: string
  date: string
  start_time: string
  end_time: string
}

export async function createShift(payload: ShiftPayload) {
  const supabase = await createClient()

  // Insert the payload into the Supabase 'shifts' table
  const { error } = await supabase
    .from('shifts')
    .insert([
      {
        employee_id: payload.employee_id,
        date: payload.date,
        start_time: payload.start_time,
        end_time: payload.end_time,
        status: 'published' // Defaulting to published so staff can see it immediately
      }
    ])

  if (error) {
    console.error("Database Error:", error.message)
    return { success: false, error: error.message }
  }

  // Tell Next.js to refresh the cache for the admin page so new data shows up
  revalidatePath('/admin')
  return { success: true }
}