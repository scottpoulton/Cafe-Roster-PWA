import Navbar from '@/components/shared/Navbar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      <Navbar />
      <main className="container mx-auto p-4">
        {children}
      </main>
    </div>
  )
}