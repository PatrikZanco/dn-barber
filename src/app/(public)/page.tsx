import { prisma } from "@/lib/prisma";
import ServicesShowcase from "@/components/public/ServicesShowcase";
import BookingSection from "@/components/public/booking/BookingSection";
import GalleryCarousel from "@/components/public/GalleryCarousel";
import BarbersShowcase from "@/components/public/BarbersShowcase";
import { Scissors, Clock, MapPin, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch active services
  const rawServices = await prisma.service.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });

  const services = rawServices.map((s) => ({
    id: s.id,
    name: s.name,
    price: Number(s.price),
    durationMinutes: s.durationMinutes,
    description: s.icon,
    photo: s.photo,
  }));

  // Fetch active barbers
  const barbers = await prisma.barber.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  // Fetch shop settings
  const settings = await prisma.shopSettings.findFirst();

  const address = settings?.address || "R. Mar Del Plata, 843 - Barreiros, São José - SC, 88117-410";
  const rawHours = (settings?.workingHours as any) || {};

  const daysMap: Record<string, string> = {
    monday: "Segunda-feira",
    tuesday: "Terça-feira",
    wednesday: "Quarta-feira",
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado",
    sunday: "Domingo",
  };

  const workingHoursList = Object.keys(daysMap).map((dayKey) => {
    const dayData = rawHours[dayKey];
    if (dayData && dayData.open && dayData.close && !dayData.closed) {
      return { day: daysMap[dayKey], time: `${dayData.open} às ${dayData.close}`, isOpen: true };
    }
    return { day: daysMap[dayKey], time: "Fechado", isOpen: false };
  });

  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen">
      {/* 1. Cortes & Serviços (Primeira coisa ao acessar o site) */}
      <section id="servicos" className="pt-28 pb-20 sm:pb-24 bg-zinc-950 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Scissors size={14} />
              <span>Nossos Serviços</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Escolha seu Serviço
            </h1>
            <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full mt-4 mb-5"></div>
            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
              Confira os serviços disponíveis e clique em agendar para escolher seu profissional e horário:
            </p>
          </div>

          <ServicesShowcase services={services} />
        </div>
      </section>

      {/* 2. Agende seu Horário (Fluxo Interativo) */}
      <section id="agendar" className="py-20 sm:py-24 bg-zinc-900/60 relative border-t border-zinc-800/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Clock size={14} />
              <span>Agendamento Rápido</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Reserve seu Horário
            </h2>
            <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full mt-4 mb-5"></div>
            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
              Escolha o barbeiro, a data e a hora ideal pra você. Sem fila, sem estresse e com confirmação na hora!
            </p>
          </div>

          <BookingSection />
        </div>
      </section>

      {/* 3. Sobre Nós (A Barbearia) */}
      <section id="sobre" className="py-20 sm:py-24 bg-zinc-950 relative border-t border-zinc-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Texto Sobre Nós */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles size={14} />
                <span>A Barbearia</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Sobre a <span className="text-amber-500">DN Barbearia</span>
              </h2>
              <div className="w-16 h-1 bg-amber-500 rounded-full"></div>
              
              <div className="space-y-4 text-zinc-300 text-base sm:text-lg leading-relaxed">
                <p>
                  Na <strong>DN Barbearia</strong> cuidamos do seu visual com atenção a cada detalhe, combinando tradição e técnicas modernas de corte e barba.
                </p>
                <p>
                  Criamos um espaço agradável e acolhedor para você relaxar enquanto nossos profissionais cuidam do seu atendimento com pontualidade e dedicação.
                </p>
              </div>
            </div>

            {/* Carrossel de Fotos na lateral */}
            <div className="lg:col-span-6 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3 shadow-2xl">
              <GalleryCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Fotos da Barbearia & Galeria */}
      <section id="galeria" className="py-20 sm:py-24 bg-zinc-900/40 relative border-t border-zinc-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles size={14} />
              <span>Nosso Espaço & Cortes</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Galeria de Fotos
            </h2>
            <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full mt-4 mb-5"></div>
            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
              Dá uma espiada no ambiente preparado pra você e nos cortes que saem daqui todos os dias:
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-2 sm:p-4 shadow-xl">
            <GalleryCarousel />
          </div>
        </div>
      </section>

      {/* 6. Nossos Barbeiros */}
      {barbers.length > 0 && (
        <section id="barbeiros" className="py-20 sm:py-24 bg-zinc-950 relative border-t border-zinc-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
                <Scissors size={14} />
                <span>Especialistas na Régua</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Nossos Barbeiros
              </h2>
              <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full mt-4 mb-5"></div>
              <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
                A tropa responsável por manter seu estilo impecável. Escolha seu barbeiro e garanta sua cadeira:
              </p>
            </div>

            <BarbersShowcase barbers={barbers} />
          </div>
        </section>
      )}

      {/* 7. Horários de Atendimento */}
      <section id="horarios" className="py-20 sm:py-24 bg-zinc-900/60 relative border-t border-zinc-800/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Clock size={14} />
              <span>Funcionamento</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Horários de Atendimento
            </h2>
            <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full mt-4 mb-5"></div>
            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
              Confira os horários em que estamos de portas abertas pra te receber com aquela resenha boa:
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="space-y-3">
              {workingHoursList.map((wh, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center py-3 px-4 rounded-xl bg-zinc-800/40 border border-zinc-800/60 text-sm"
                >
                  <span className="font-semibold text-zinc-200">{wh.day}</span>
                  <span
                    className={
                      wh.isOpen
                        ? "font-bold text-amber-400"
                        : "text-xs font-semibold text-red-400 bg-red-500/10 px-2.5 py-1 rounded"
                    }
                  >
                    {wh.time}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <a
                href="#agendar"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition-all shadow-md"
              >
                <span>Agendar no melhor horário</span>
                <Scissors size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Localização & Google Maps */}
      <section id="localizacao" className="py-20 sm:py-24 bg-zinc-950 relative border-t border-zinc-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <MapPin size={14} />
              <span>Onde Estamos</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Como Chegar
            </h2>
            <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full mt-4 mb-5"></div>
            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
              Fácil acesso e bem localizada no bairro Barreiros em São José - SC:
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-6">
            {/* Endereço + Botão GPS */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-900 border border-zinc-800 p-5 rounded-2xl shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">{address}</h3>
                  <p className="text-xs sm:text-sm text-zinc-400">Barreiros, São José - SC • 88117-410</p>
                </div>
              </div>

              <a
                href="https://www.google.com/maps/search/?api=1&query=R.+Mar+Del+Plata,+843+-+Barreiros,+S%C3%A3o+Jos%C3%A9+-+SC,+88117-410"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-md flex-shrink-0"
              >
                <MapPin size={18} />
                <span>Abrir no GPS / Traçar Rota</span>
              </a>
            </div>

            {/* Iframe Interativo do Google Maps */}
            <div className="w-full h-[400px] sm:h-[480px] bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden relative shadow-2xl">
              <iframe
                src="https://maps.google.com/maps?q=R.+Mar+Del+Plata,+843+-+Barreiros,+S%C3%A3o+Jos%C3%A9+-+SC,+88117-410&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa de Localização DN Barbearia"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

