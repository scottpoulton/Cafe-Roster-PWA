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

export async function deleteShift(shiftId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('shifts')
    .delete()
    .eq('id', shiftId)

  if (error) {
    console.error("Delete Error:", error.message)
    return { success: false, error: error.message }
  }

  // Refresh the admin page so the deleted shift disappears instantly
  revalidatePath('/admin')
  return { success: true }
}

export async function updateShift(
  shiftId: string, 
  payload: { date: string; start_time: string; end_time: string }
) {
  const supabase = await createClient()

  // Find the specific shift and update its values
  const { error } = await supabase
    .from('shifts')
    .update({
      date: payload.date,
      start_time: payload.start_time,
      end_time: payload.end_time,
    })
    .eq('id', shiftId)

  if (error) {
    console.error("Update Error:", error.message)
    return { success: false, error: error.message }
  }

  // Refresh the admin page so the UI instantly reflects the edited shift
  revalidatePath('/admin')
  return { success: true }
}