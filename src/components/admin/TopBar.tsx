import { Menu, Bell } from 'lucide-react';

interface TopBarProps {
  title: string;
  onMenuClick: () => void;
}

export default function TopBar({ title, onMenuClick }: TopBarProps) {
  return (
    <header className="h-16 bg-zinc-900/50 backdrop-blur border-b border-zinc-800 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden text-zinc-400 hover:text-zinc-100"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-semibold text-zinc-100">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-zinc-400 hover:text-amber-500 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-amber-500 rounded-full border-2 border-zinc-900"></span>
        </button>
        <div className="h-6 w-px bg-zinc-800 mx-2"></div>
        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-zinc-200">Admin</p>
            <p className="text-xs text-zinc-500">admin@dnbarbearia.com</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-amber-500 font-bold">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
