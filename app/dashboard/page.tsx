import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Grab the logged-in user securely from the server
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
      <h1 className="text-4xl font-bold text-zinc-900">Welcome to the Dashboard! 🎉</h1>
      <p className="text-zinc-500">
        You are successfully logged in as: <br/>
        <span className="font-mono text-zinc-800">{user.email}</span>
      </p>
    </div>
  )
}