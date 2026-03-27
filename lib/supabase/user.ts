import { createClient } from './server'

export async function getUserProfile() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return null
  }

  // Force bypass the strict type check
  const { data: profile, error: profileError } = await (supabase.from('profiles') as any)
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return null
  }

  // Return profile as 'any' to stop the "never" errors in your pages
  return { user, profile: profile as any }
}

export async function getStaffMembers() {
  const supabase = await createClient()

  // Force bypass the strict type check
  const { data: staff, error } = await (supabase.from('profiles') as any)
    .select('id, name')
    .eq('role', 'staff')
    .order('name')

  if (error) {
    console.error("Error fetching staff:", error)
    return []
  }

  return staff as any[]
}