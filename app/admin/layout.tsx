import Navbar from '@/components/shared/Navbar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main className="container mx-auto p-4">
        {children}
      </main>
    </div>
  )
}