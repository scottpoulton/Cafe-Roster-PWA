import Navbar from '@/components/shared/Navbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <main className="container mx-auto p-4">
        {children}
      </main>
    </div>
  )
}