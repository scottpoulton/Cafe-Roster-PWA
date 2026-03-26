import { getUserProfile } from '@/lib/supabase/user'
import { redirect } from 'next/navigation'
import RosterBuilder from './roster-builder'

export default async function AdminPage() {
  const session = await getUserProfile()

  if (!session || session.profile.role !== 'manager') {
    redirect('/dashboard')
  }

  return (
    <div className="flex flex-col py-10 space-y-4">
      <h1 className="text-4xl font-bold text-zinc-900">Manager Admin Panel 👑</h1>
      <p className="text-zinc-500">
        Welcome back, <span className="font-semibold text-zinc-800">{session.profile.name}</span>. Let's build some rosters.
      </p>
      
      {/* Our interactive client component drops in here! */}
      <RosterBuilder />
    </div>
  )
}