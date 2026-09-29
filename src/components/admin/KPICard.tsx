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
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-zinc-400">{title}</h3>
        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-amber-500" />
        </div>
      </div>
      
      <div className="flex items-end gap-3 mt-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-zinc-100">{value}</h2>
      </div>
      
      <div className="mt-2 flex items-center gap-2 text-sm">
        {trend === 'up' && <span className="text-emerald-500 font-medium">↑</span>}
        {trend === 'down' && <span className="text-red-500 font-medium">↓</span>}
        <span className="text-zinc-500">{subtitle}</span>
      </div>
    </div>
  );
}
