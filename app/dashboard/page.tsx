import { redirect } from 'next/navigation'
import { getUserProfile } from '@/lib/supabase/user'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format, parseISO } from 'date-fns'

// NEW IMPORTS FOR PHASE 1
import Timeclock from './timeclock'
import { getActiveTimesheet } from './actions'

export default async function DashboardPage() {
  const session = await getUserProfile()

  if (!session) {
    redirect('/login')
  }

  const supabase = await createClient()

  // 1. Fetch only the shifts belonging to this specific logged-in user
  const { data: shifts } = await (supabase.from('shifts') as any)
    .select('*')
    .eq('employee_id', session.user.id)
    .eq('is_deleted', false)
    .order('date', { ascending: true })

  // 2. Fetch their active timesheet (if they are currently clocked in)
  const activeTimesheet = await getActiveTimesheet(session.user.id)

  return (
    <div className="flex flex-col py-10 space-y-8">
      
      {/* Header Section */}
      <div>
        <h1 className="text-4xl font-bold text-foreground">Staff Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your shift portal, <span className="font-semibold text-foreground">{session.profile.name}</span>.
        </p>
      </div>

      {/* THE NEW TIMECLOCK COMPONENT */}
      <Timeclock 
        employeeId={session.user.id} 
        activeTimesheetId={activeTimesheet?.id || null} 
      />

      {/* Shifts Display Section */}
      <div className="space-y-4 pt-4">
        <h2 className="text-2xl font-semibold text-foreground">Your Upcoming Shifts</h2>
        
        {shifts && shifts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {shifts.map((shift: any) => (
              <Card key={shift.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    {format(parseISO(shift.date), 'EEEE, MMMM do')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-foreground">
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