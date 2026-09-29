'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import TopBar from '@/components/admin/TopBar';

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
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
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
