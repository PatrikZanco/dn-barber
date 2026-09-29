'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Calendar, Scissors, Users, Menu } from 'lucide-react';
import Sidebar from '@/components/admin/Sidebar';
import TopBar from '@/components/admin/TopBar';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login' || pathname === '/admin/login';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onMenuClick={() => setSidebarOpen(true)} title={getPageTitle(pathname)} />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-8 pb-24 md:pb-8">
          {children}
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800 flex items-center justify-around h-16 px-1 safe-area-inset-bottom shadow-lg">
          <Link
            href="/admin/dashboard"
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-1 transition-colors text-[11px] font-medium",
              pathname.includes('/dashboard') ? "text-amber-500 font-bold" : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <LayoutDashboard size={19} className="mb-0.5" />
            <span>Painel</span>
          </Link>

          <Link
            href="/admin/agenda"
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-1 transition-colors text-[11px] font-medium",
              pathname.includes('/agenda') ? "text-amber-500 font-bold" : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <Calendar size={19} className="mb-0.5" />
            <span>Agenda</span>
          </Link>

          <Link
            href="/admin/servicos"
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-1 transition-colors text-[11px] font-medium",
              pathname.includes('/servicos') ? "text-amber-500 font-bold" : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <Scissors size={19} className="mb-0.5" />
            <span>Serviços</span>
          </Link>

          <Link
            href="/admin/barbeiros"
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-1 transition-colors text-[11px] font-medium",
              pathname.includes('/barbeiros') ? "text-amber-500 font-bold" : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <Users size={19} className="mb-0.5" />
            <span>Equipe</span>
          </Link>

          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center justify-center flex-1 py-1 transition-colors text-[11px] font-medium text-zinc-400 hover:text-zinc-200"
          >
            <Menu size={19} className="mb-0.5" />
            <span>Mais</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

function getPageTitle(pathname: string) {
  if (pathname.includes('/dashboard')) return 'Dashboard';
  if (pathname.includes('/agenda')) return 'Agenda';
  if (pathname.includes('/servicos')) return 'Serviços';
  if (pathname.includes('/barbeiros')) return 'Barbeiros';
  if (pathname.includes('/galeria')) return 'Galeria';
  if (pathname.includes('/config')) return 'Configurações';
  return 'Painel Admin';
}
