"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  Calendar,
  TrendingUp,
  Clock,
  Loader2,
  Phone,
  MessageSquare,
} from "lucide-react";
import KPICard from "@/components/admin/KPICard";
import RevenueChart from "@/components/admin/RevenueChart";
import { formatCurrency, getStatusLabel, getStatusColor } from "@/lib/utils";

interface DashboardData {
  todayRevenue: number;
  monthRevenue: number;
  todayAppointments: number;
  monthAppointments: number;
  weeklyData: { label: string; revenue: number; appointments: number }[];
  upcomingToday: {
    id: string;
    time: string;
    clientName: string;
    clientWhatsapp?: string;
    serviceName: string;
    barberName: string;
    status: string;
    notes?: string;
  }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/dashboard");
      const json = await res.json();
      setData(json.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Auto-refresh every 60s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-400 mt-4">Erro ao carregar dados.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <span className="text-sm text-zinc-500">
          Atualização automática a cada 60s
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Faturamento Hoje"
          value={formatCurrency(data.todayRevenue)}
          icon={DollarSign}
          subtitle="Concluídos"
        />
        <KPICard
          title="Faturamento Mês"
          value={formatCurrency(data.monthRevenue)}
          icon={TrendingUp}
          subtitle="Total do mês"
        />
        <KPICard
          title="Agendamentos Hoje"
          value={data.todayAppointments.toString()}
          icon={Calendar}
          subtitle="Hoje"
        />
        <KPICard
          title="Agendamentos Mês"
          value={data.monthAppointments.toString()}
          icon={Calendar}
          subtitle="Total do mês"
        />
      </div>

      {/* Chart + Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Faturamento Semanal
          </h2>
          <RevenueChart data={data.weeklyData} />
        </div>

        {/* Upcoming Today */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Próximos Clientes
            </h2>
            <span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded">
              {data.upcomingToday.length} agendamento(s)
            </span>
          </div>
          {data.upcomingToday.length === 0 ? (
            <p className="text-zinc-500 text-sm">Nenhum agendamento pendente hoje.</p>
          ) : (
            <div className="space-y-3">
              {data.upcomingToday.map((appt) => (
                <div
                  key={appt.id}
                  className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50 hover:border-zinc-600 transition"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-amber-500 font-semibold text-sm">
                      {appt.time}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(
                        appt.status
                      )}`}
                    >
                      {getStatusLabel(appt.status)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white font-medium">{appt.clientName}</p>
                    {appt.clientWhatsapp && (
                      <a
                        href={`https://wa.me/55${appt.clientWhatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                        title="Conversar no WhatsApp"
                      >
                        <Phone className="w-3 h-3" />
                        WhatsApp
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {appt.serviceName} • {appt.barberName}
                  </p>
                  {appt.notes && (
                    <div className="mt-2 text-xs bg-zinc-900/80 rounded p-2 text-zinc-300 border border-zinc-700/40 flex items-start gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{appt.notes}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
