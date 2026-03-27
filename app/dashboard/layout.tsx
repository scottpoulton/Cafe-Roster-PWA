import Navbar from '@/components/shared/Navbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Changed bg-zinc-50 to bg-background here!
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main className="container mx-auto p-4">
        {children}
      </main>
    </div>
  )
}