'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// 1. Define our bulletproof schema
const shiftSchema = z.object({
  // Supabase uses UUIDs for profiles, so we enforce it here
  employee_id: z.string().uuid("Invalid employee ID"),
  date: z.string().min(1, "Date is required"),
  start_time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid start time format"),
  end_time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid end time format"),
}).refine((data) => {
  // Because your HTML time inputs use 24-hour format (e.g., "09:00" or "17:00"), 
  // a basic string comparison works perfectly to check time order!
  return data.end_time > data.start_time;
}, {
  message: "End time must be strictly after the start time.",
  path: ["end_time"],
});

// Extract the type from the schema for our function signature
export type ShiftPayload = z.infer<typeof shiftSchema>;

export async function createShift(payload: ShiftPayload) {
  // 2. Validate the incoming data BEFORE touching the database
  const validatedFields = shiftSchema.safeParse(payload);

  if (!validatedFields.success) {
    console.warn("Validation Error:", validatedFields.error.flatten());
    // Return the specific validation error message back to the client UI
    return { 
      success: false, 
      error: validatedFields.error.errors[0].message 
    };
  }

  const supabase = await createClient()

  // 3. Use the safe, validated data for the database insert
  const { error } = await (supabase.from('shifts') as any)
    .insert([
      {
        employee_id: validatedFields.data.employee_id,
        date: validatedFields.data.date,
        start_time: validatedFields.data.start_time,
        end_time: validatedFields.data.end_time,
        status: 'published'
      }
    ])

  if (error) {
    console.error("Database Error:", error.message)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin')
  return { success: true }
}

export async function deleteShift(shiftId: string) {
  const supabase = await createClient()

  const { error } = await (supabase.from('shifts') as any)
    .update({ is_deleted: true })
    .eq('id', shiftId)

  if (error) {
    console.error("Delete Error:", error.message)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin')
  return { success: true }
}

export async function updateShift(
  shiftId: string, 
  payload: { date: string; start_time: string; end_time: string }
) {
  const supabase = await createClient()

  const { error } = await (supabase.from('shifts') as any)
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

  revalidatePath('/admin')
  return { success: true }
}