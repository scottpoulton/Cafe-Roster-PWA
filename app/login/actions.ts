'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserProfile } from '@/lib/supabase/user' // <-- Add this import

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect('/login?error=Could not authenticate user')
  }

  // --- NEW TRAFFIC COP LOGIC ---
  const session = await getUserProfile()
  
  revalidatePath('/', 'layout')

  // Direct traffic based on role
  if (session?.profile.role === 'manager') {
    redirect('/admin')
  } else {
    redirect('/dashboard')
  }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}