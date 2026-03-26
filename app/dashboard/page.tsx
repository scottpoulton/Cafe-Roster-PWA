import { redirect } from 'next/navigation'
import { getUserProfile } from '@/lib/supabase/user'

export default async function DashboardPage() {
  const session = await getUserProfile()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
      <h1 className="text-4xl font-bold text-zinc-900">Staff Dashboard</h1>
      <p className="text-zinc-500">
        Welcome to your shift portal, <span className="font-semibold text-zinc-800">{session.profile.name}</span>.
      </p>
    </div>
  )
}