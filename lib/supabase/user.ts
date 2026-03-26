import { createClient } from './server'

export async function getUserProfile() {
  const supabase = await createClient()

  // 1. Get the current logged-in user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return null
  }

  // 2. Fetch their role from our custom 'profiles' table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return null
  }

  return { user, profile }
}
export async function getStaffMembers() {
  const supabase = await createClient()

  const { data: staff, error } = await supabase
    .from('profiles')
    .select('id, name')
    .eq('role', 'staff')
    .order('name')

  if (error) {
    console.error("Error fetching staff:", error)
    return []
  }

  return staff
}