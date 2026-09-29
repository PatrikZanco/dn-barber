'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface DataPoint {
  label: string;
  revenue: number;
  appointments?: number;
}

interface RevenueChartProps {
  data: DataPoint[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const [mounted, setMounted] = useState(false);
  const [metric, setMetric] = useState<'revenue' | 'appointments'>('revenue');

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (!mounted) {
    return (
      <div className="w-full h-[320px] flex items-center justify-center text-zinc-600">
        Carregando gráfico...
      </div>
    );
  }

  const isRevenue = metric === 'revenue';

  return (
    <div className="space-y-4">
      {/* Toggle View */}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setMetric('revenue')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            isRevenue
              ? 'bg-amber-500 text-zinc-950 shadow-sm'
              : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Faturamento (R$)
        </button>
        <button
          type="button"
          onClick={() => setMetric('appointments')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            !isRevenue
              ? 'bg-blue-500 text-white shadow-sm'
              : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Agendamentos (Qtd)
        </button>
      </div>

      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 15, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#a1a1aa', fontSize: 12 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#a1a1aa', fontSize: 11 }}
              tickFormatter={(v) => (isRevenue ? formatCurrency(v) : `${v}`)}
              width={isRevenue ? 75 : 35}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: '#27272a', opacity: 0.3 }}
              contentStyle={{
                backgroundColor: '#18181b',
                border: '1px solid #3f3f46',
                borderRadius: '8px',
                color: '#f4f4f5',
                fontSize: '12px',
              }}
              formatter={(value: any) => [
                isRevenue
                  ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
                  : `${value} agendamento(s)`,
                isRevenue ? 'Faturamento' : 'Agendamentos',
              ]}
            />
            <Bar
              dataKey={isRevenue ? 'revenue' : 'appointments'}
              radius={[4, 4, 0, 0]}
              maxBarSize={48}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={isRevenue ? '#f59e0b' : '#3b82f6'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
