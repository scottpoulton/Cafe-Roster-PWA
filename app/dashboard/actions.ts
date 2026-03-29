'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// 1. Check if the staff member is currently clocked in
export async function getActiveTimesheet(employeeId: string) {
  const supabase = await createClient()
  
  // We look for a timesheet for this employee where clock_out is still empty
  const { data, error } = await (supabase.from('timesheets') as any)
    .select('id, clock_in')
    .eq('employee_id', employeeId)
    .is('clock_out', null)
    .single()

  // PGRST116 just means "no rows found" (which is normal if they aren't clocked in)
  if (error && error.code !== 'PGRST116') {
    console.error("Error fetching active timesheet:", error.message)
    return null
  }
  
  return data
}

// 2. Clock In
export async function clockIn(employeeId: string) {
  const supabase = await createClient()
  
  const { error } = await (supabase.from('timesheets') as any)
    .insert([{
      employee_id: employeeId,
      clock_in: new Date().toISOString(), // Standard UTC time
      status: 'pending' // Manager has to approve it later
    }])

  if (error) {
    console.error("Clock In Error:", error.message)
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

// 3. Clock Out
export async function clockOut(timesheetId: string) {
  const supabase = await createClient()
  
  const { error } = await (supabase.from('timesheets') as any)
    .update({ clock_out: new Date().toISOString() })
    .eq('id', timesheetId)

  if (error) {
    console.error("Clock Out Error:", error.message)
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}