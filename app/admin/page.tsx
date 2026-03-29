import { Button } from '@/components/ui/button' 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserProfile, getStaffMembers } from '@/lib/supabase/user'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { format, parseISO } from 'date-fns'
import RosterBuilder from './roster-builder'
import DeleteButton from './delete-button'
import EditButton from './edit-button'
import TimesheetButtons from './timesheet-buttons'

export default async function AdminPage() {
  const session = await getUserProfile()

  if (!session || session.profile.role !== 'manager') {
    redirect('/dashboard')
  }

  const staffList = await getStaffMembers()
  const supabase = await createClient()
  
  // 1. Fetch Shifts
  const { data: shifts } = await (supabase.from('shifts') as any)
    .select('id, date, start_time, end_time, status, profiles ( name )')
    .eq('is_deleted', false)
    .order('date', { ascending: true })

  // 2. Fetch Timesheets
  const { data: timesheets } = await (supabase.from('timesheets') as any)
    .select('id, clock_in, clock_out, status, profiles ( name )')
    .order('clock_in', { ascending: false })

  return (
    <div className="flex flex-col py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Manager Admin Panel</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, <span className="font-semibold text-foreground">{session.profile.name}</span>.
          </p>
        </div>
        <Button asChild variant="outline">
          <a href="/admin/export" download>Export to CSV</a>
        </Button>
      </div>
      
      {/* SHADCN TABS CAKE */}
      <Tabs defaultValue="rosters" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-8">
          <TabsTrigger value="rosters">Shift Rosters</TabsTrigger>
          <TabsTrigger value="timesheets">Timesheet Review</TabsTrigger>
        </TabsList>

        {/* TAB 1: ROSTERS (Your existing code) */}
        <TabsContent value="rosters" className="space-y-12 outline-none">
          <RosterBuilder staffList={staffList} />

          <div className="space-y-6 pt-8 border-t border-border">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Master Roster</h2>
              <p className="text-sm text-muted-foreground">All assigned shifts across the cafe.</p>
            </div>
            
            {shifts && shifts.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {shifts.map((shift: any) => (
                  <div key={shift.id} className="flex flex-col justify-between p-5 bg-card border border-border rounded-xl shadow-sm">
                    <div>
                      <p className="font-semibold text-foreground text-lg">{shift.profiles?.name || 'Unknown Staff'}</p>
                      <p className="text-sm text-muted-foreground">{format(parseISO(shift.date), 'EEEE, MMM do, yyyy')}</p>
                      <p className="text-foreground font-medium mt-3">{shift.start_time.slice(0, 5)} - {shift.end_time.slice(0, 5)}</p>
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{shift.status}</span>
                      <div className="flex gap-2">
                        <EditButton shift={shift} />
                        <DeleteButton shiftId={shift.id} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center border-2 border-dashed border-border rounded-lg bg-card/50 text-muted-foreground">
                No shifts have been assigned yet.
              </div>
            )}
          </div>
        </TabsContent>

        {/* TAB 2: TIMESHEETS (The new hotness) */}
        <TabsContent value="timesheets" className="space-y-6 outline-none">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Timesheet Review</h2>
            <p className="text-sm text-muted-foreground">Approve or reject staff clock-in records.</p>
          </div>

          {timesheets && timesheets.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {timesheets.map((ts: any) => (
                <div key={ts.id} className="flex flex-col justify-between p-5 bg-card border border-border rounded-xl shadow-sm">
                  <div>
                    <p className="font-semibold text-foreground text-lg">{ts.profiles?.name || 'Unknown Staff'}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(parseISO(ts.clock_in), 'MMM do, yyyy')}
                    </p>
                    <div className="mt-3 space-y-1">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">In:</span> {format(parseISO(ts.clock_in), 'h:mm a')}
                      </p>
                      <p className="text-sm text-foreground">
                        <span className="font-medium">Out:</span> {ts.clock_out ? format(parseISO(ts.clock_out), 'h:mm a') : <span className="text-amber-500 font-medium animate-pulse">Ongoing...</span>}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Status:</span>
                    <TimesheetButtons timesheetId={ts.id} currentStatus={ts.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center border-2 border-dashed border-border rounded-lg bg-card/50 text-muted-foreground">
              No timesheets recorded yet.
            </div>
          )}
        </TabsContent>

      </Tabs>
    </div>
  )
}