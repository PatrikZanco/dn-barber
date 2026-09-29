import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDayOfWeek } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const now = new Date();
    
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(startOfToday);
    endOfToday.setHours(23, 59, 59, 999);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Fetch data
    const [
      todayCompletedAppts,
      monthCompletedAppts,
      todayAppts,
      monthAppts,
      newClientsMonth,
      upcomingTodayAppts
    ] = await Promise.all([
      // todayRevenue
      prisma.appointment.findMany({
        where: { status: "COMPLETED", dateTime: { gte: startOfToday, lte: endOfToday } },
        select: { price: true }
      }),
      // monthRevenue
      prisma.appointment.findMany({
        where: { status: "COMPLETED", dateTime: { gte: startOfMonth, lte: endOfMonth } },
        select: { price: true }
      }),
      // todayAppointments
      prisma.appointment.count({
        where: { status: { not: "CANCELLED" }, dateTime: { gte: startOfToday, lte: endOfToday } }
      }),
      // monthAppointments
      prisma.appointment.count({
        where: { status: { not: "CANCELLED" }, dateTime: { gte: startOfMonth, lte: endOfMonth } }
      }),
      // newClientsMonth
      prisma.client.count({
        where: { createdAt: { gte: startOfMonth, lte: endOfMonth } }
      }),
      // upcoming
      prisma.appointment.findMany({
        where: { 
          status: { in: ["SCHEDULED", "IN_PROGRESS"] },
        },
        include: { client: true, barber: true, service: true },
        orderBy: { dateTime: "asc" },
        take: 10
      })
    ]);

    const todayRevenue = todayCompletedAppts.reduce((sum, appt) => sum + Number(appt.price), 0);
    const monthRevenue = monthCompletedAppts.reduce((sum, appt) => sum + Number(appt.price), 0);

    const upcomingToday = upcomingTodayAppts.map(appt => {
      const d = new Date(appt.dateTime);
      const isToday = d.toDateString() === now.toDateString();
      const timeStr = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
      const dateStr = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });

      return {
        id: appt.id,
        clientName: appt.client?.name || "Cliente",
        clientWhatsapp: appt.client?.whatsapp || "",
        serviceName: appt.service?.name || "Serviço",
        barberName: appt.barber?.name || "Barbeiro",
        status: appt.status,
        time: isToday ? `Hoje às ${timeStr}` : `${dateStr} às ${timeStr}`,
        notes: appt.notes || ""
      };
    });

    // weeklyData
    const ptDays: Record<string, string> = {
      sunday: "Dom",
      monday: "Seg",
      tuesday: "Ter",
      wednesday: "Qua",
      thursday: "Qui",
      friday: "Sex",
      saturday: "Sáb"
    };

    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(startOfToday);
      d.setDate(d.getDate() - i);
      const endD = new Date(d);
      endD.setHours(23, 59, 59, 999);

      const dayAppts = await prisma.appointment.findMany({
        where: { 
          dateTime: { gte: d, lte: endD },
          status: { not: "CANCELLED" }
        },
        select: { price: true, status: true }
      });

      const dayRevenue = dayAppts
        .filter(a => a.status === "COMPLETED")
        .reduce((sum, a) => sum + Number(a.price), 0);

      const dayOfWeekKey = getDayOfWeek(d);
      const dayLabel = ptDays[dayOfWeekKey] || dayOfWeekKey.substring(0, 3);
      const dayNum = String(d.getDate()).padStart(2, "0");

      weeklyData.push({
        label: `${dayLabel} (${dayNum})`,
        revenue: dayRevenue,
        appointments: dayAppts.length
      });
    }

    return NextResponse.json({
      data: {
        todayRevenue,
        monthRevenue,
        todayAppointments: todayAppts,
        monthAppointments: monthAppts,
        newClientsMonth,
        upcomingToday,
        weeklyData
      }
    });

  } catch (error) {
    console.error("GET /api/dashboard error:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
