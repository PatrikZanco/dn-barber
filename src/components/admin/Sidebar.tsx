'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  Calendar, 
  Scissors, 
  Users, 
  Image as ImageIcon, 
  Settings, 
  LogOut,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/agenda', label: 'Agenda', icon: Calendar },
  { href: '/admin/servicos', label: 'Serviços', icon: Scissors },
  { href: '/admin/barbeiros', label: 'Barbeiros', icon: Users },
  { href: '/admin/galeria', label: 'Galeria', icon: ImageIcon },
  { href: '/admin/config', label: 'Configurações', icon: Settings },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:static inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-800">
          <Image src="/logo.png" alt="DN Barbearia" width={100} height={50} className="h-10 w-auto object-contain" />
          <button onClick={onClose} className="md:hidden text-zinc-400 hover:text-zinc-100">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname === '/admin' && item.href === '/admin/dashboard');
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium",
                  isActive 
                    ? "text-amber-500 bg-amber-500/10" 
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
                )}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg transition-colors text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-400/10"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}
