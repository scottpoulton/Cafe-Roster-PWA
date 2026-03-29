import { redirect } from 'next/navigation'
import { getUserProfile } from '@/lib/supabase/user'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format, parseISO } from 'date-fns'

export default async function DashboardPage() {
  const session = await getUserProfile()

  if (!session) {
    redirect('/login')
  }

  // 1. Fetch only the shifts belonging to this specific logged-in user
  const supabase = await createClient()

  // Clean, single-chain query with the 'as any' fix
  const { data: shifts, error } = await (supabase.from('shifts') as any)
    .select('*')
    .eq('employee_id', session.user.id)
    .eq('is_deleted', false)
    .order('date', { ascending: true })

  return (
    <div className="flex flex-col py-10 space-y-8">
      
      {/* Header Section (Updated for Dark Mode) */}
      <div>
        <h1 className="text-4xl font-bold text-foreground">Staff Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your shift portal, <span className="font-semibold text-foreground">{session.profile.name}</span>.
        </p>
      </div>

      {/* Shifts Display Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Your Upcoming Shifts</h2>
        
        {shifts && shifts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* ADDED : any TO FIX THE BUILD ERROR */}
            {shifts.map((shift: any) => (
              <Card key={shift.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    {/* Format the date to look like "Friday, March 27th" */}
                    {format(parseISO(shift.date), 'EEEE, MMMM do')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-foreground">
                    {/* Slice removes the seconds from the DB time string (e.g., 09:00:00 -> 09:00) */}
                    {shift.start_time.slice(0, 5)} - {shift.end_time.slice(0, 5)}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize mt-2">
                    Status: {shift.status}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center border-2 border-dashed border-border rounded-lg bg-card/50 text-muted-foreground">
            You have no upcoming shifts assigned. Enjoy your time off!
          </div>
        )}
      </div>

    </div>
  )
}