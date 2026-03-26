import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/login/actions'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="text-xl font-bold tracking-tight text-foreground">
            Cafe Roster
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <form action={logout}>
            <Button variant="outline" size="sm" type="submit">
              Sign Out
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}