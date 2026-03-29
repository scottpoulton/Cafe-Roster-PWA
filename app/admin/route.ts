import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { format, parseISO } from 'date-fns'

export async function GET() {
  const supabase = await createClient()

  // 1. Fetch the exact same data we use on the Admin page
  const { data: shifts, error } = await (supabase.from('shifts') as any)
    .select(`
      id,
      date,
      start_time,
      end_time,
      status,
      profiles ( name )
    `)
    .eq('is_deleted', false)
    .order('date', { ascending: true })

  if (error || !shifts) {
    return new NextResponse("Failed to fetch data for export", { status: 500 })
  }

  // 2. Define the CSV column headers
  const headers = ['Staff Name', 'Date', 'Start Time', 'End Time', 'Status']
  const csvRows = [headers.join(',')]

  // 3. Loop through shifts and map them to CSV rows
  shifts.forEach((shift: any) => {
    const name = shift.profiles?.name || 'Unknown Staff'
    // Format the date cleanly
    const date = format(parseISO(shift.date), 'yyyy-MM-dd')
    
    const row = [
      `"${name}"`, // Wrap text in quotes to prevent names with commas from breaking the CSV
      date,
      shift.start_time.slice(0, 5),
      shift.end_time.slice(0, 5),
      shift.status
    ]
    
    csvRows.push(row.join(','))
  })

  // Join all rows with a newline character
  const csvContent = csvRows.join('\n')

  // 4. Return the response with the magical headers that trigger a file download!
  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="cafe-roster-${format(new Date(), 'yyyy-MM-dd')}.csv"`,
    },
  })
}