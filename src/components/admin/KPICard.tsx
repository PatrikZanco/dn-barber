import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
}

export default function KPICard({ title, value, subtitle, icon: Icon, trend }: KPICardProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 sm:p-5 lg:p-6 flex flex-col transition-all">
      <div className="flex items-center justify-between mb-2 sm:mb-4 gap-2">
        <h3 className="text-xs sm:text-sm font-medium text-zinc-400 truncate">{title}</h3>
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
        </div>
      </div>
      
      <div className="flex items-end gap-2 mt-auto">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-100 truncate">{value}</h2>
      </div>
      
      <div className="mt-1 sm:mt-2 flex items-center gap-1.5 text-xs sm:text-sm">
        {trend === 'up' && <span className="text-emerald-500 font-medium">↑</span>}
        {trend === 'down' && <span className="text-red-500 font-medium">↓</span>}
        <span className="text-zinc-500 truncate">{subtitle}</span>
      </div>
    </div>
  );
}
