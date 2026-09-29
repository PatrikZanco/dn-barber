import { MapPin, Clock, Phone, Mail } from "lucide-react";
import GalleryCarousel from "@/components/public/GalleryCarousel";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

export const dynamic = "force-dynamic";

export const revalidate = 60; // optionally revalidate every minute

export default async function AboutPage() {
  // Fetch shop settings
  const settings = await prisma.shopSettings.findUnique({
    where: { id: "main" },
  });

  // Fetch active barbers
  const barbers = await prisma.barber.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  const address = settings?.address || "Rua Exemplo, 123 - Centro\nSão Paulo, SP";
  const phone = settings?.phone || "(11) 98765-4321";
  const email = "contato@dnbarbearia.com"; // Default as it's not in schema
  
  // Handle working hours
  const rawHours = settings?.workingHours as any || {};
  const daysMap: Record<string, string> = {
    monday: "Segunda",
    tuesday: "Terça",
    wednesday: "Quarta",
    thursday: "Quinta",
    friday: "Sexta",
    saturday: "Sábado",
    sunday: "Domingo"
  };

  const workingHoursList = Object.keys(daysMap).map(dayKey => {
    const dayData = rawHours[dayKey];
    if (dayData && dayData.open && dayData.close) {
      return { day: daysMap[dayKey], time: `${dayData.open} às ${dayData.close}` };
    }
    return { day: daysMap[dayKey], time: "Fechado" };
  });

  return (
    <div className="pt-20 bg-zinc-950 min-h-screen">
      {/* Banner */}
      <div className="bg-zinc-900 border-b border-zinc-800 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Sobre Nós</h1>
        <p className="text-zinc-400 max-w-2xl mx-auto px-4">
          Conheça mais sobre nossa história e nosso compromisso com a excelência.
        </p>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Nossa História</h2>
            <div className="w-16 h-1 bg-amber-500 rounded-full"></div>
            <div className="space-y-4 text-zinc-300 text-lg leading-relaxed">
              <p>
                A DN Barbearia nasceu da paixão pela arte da barbearia clássica, combinada com as tendências contemporâneas. Nosso objetivo sempre foi proporcionar mais do que um simples corte de cabelo, mas uma verdadeira experiência de cuidado masculino.
              </p>
              <p>
                Nossos profissionais são altamente qualificados e estão em constante atualização para oferecer os melhores serviços, técnicas e produtos disponíveis no mercado.
              </p>
              <p>
                Valorizamos um ambiente acolhedor, descontraído e premium, onde você pode relaxar, tomar uma bebida gelada e sair com a autoestima renovada.
              </p>
            </div>
          </div>
          <div className="bg-zinc-900 rounded-2xl p-2 border border-zinc-800">
            <GalleryCarousel />
          </div>
        </div>

        {/* Nossos Profissionais Section */}
        {barbers.length > 0 && (
          <div className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Nossos Profissionais</h2>
              <div className="w-16 h-1 bg-amber-500 rounded-full mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {barbers.map((barber) => (
                <div key={barber.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group hover:border-amber-500/30 transition-colors">
                  <div className="aspect-square relative bg-zinc-800 flex items-center justify-center overflow-hidden">
                    {barber.photo ? (
                      <img
                        src={barber.photo}
                        alt={barber.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 gap-2">
                        <span className="text-4xl">✂️</span>
                        <span className="text-sm">Sem foto</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-white mb-1">{barber.name}</h3>
                    {barber.specialty && (
                      <p className="text-amber-500 text-sm">{barber.specialty}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl text-center group hover:border-amber-500/50 transition-colors">
            <MapPin className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Localização</h3>
            <p className="text-zinc-400 whitespace-pre-line leading-relaxed">{address}</p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=R.+Mar+Del+Plata,+843+-+Barreiros,+S%C3%A3o+Jos%C3%A9+-+SC,+88117-410"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-500 hover:text-amber-400 mt-3 underline"
            >
              Ver rotas no Google Maps &rarr;
            </a>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl text-center group hover:border-amber-500/50 transition-colors">
            <Clock className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-4">Horário de Funcionamento</h3>
            <div className="space-y-2 text-sm">
              {workingHoursList.map((wh, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-zinc-800/50 pb-2 last:border-0 last:pb-0">
                  <span className="text-zinc-300">{wh.day}</span>
                  <span className={wh.time === "Fechado" ? "text-red-400" : "text-zinc-400"}>{wh.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl text-center group hover:border-amber-500/50 transition-colors">
            <Phone className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Contato & Redes</h3>
            <p className="text-zinc-400 mb-3">{phone}</p>
            <a
              href="https://www.instagram.com/dnbarbearia01/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-amber-500 rounded-lg text-sm font-medium transition-colors"
            >
              <span>📷 @dnbarbearia01</span>
            </a>
          </div>
        </div>

        {/* Real Google Maps Embed */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h2 className="text-2xl font-bold text-white">Como Chegar</h2>
              <p className="text-zinc-400 text-sm">R. Mar Del Plata, 843 - Barreiros, São José - SC</p>
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=R.+Mar+Del+Plata,+843+-+Barreiros,+S%C3%A3o+Jos%C3%A9+-+SC,+88117-410"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
            >
              <MapPin size={16} />
              <span>Abrir no GPS</span>
            </a>
          </div>

          <div className="w-full h-[420px] bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden relative shadow-xl">
            <iframe
              src="https://maps.google.com/maps?q=R.+Mar+Del+Plata,+843+-+Barreiros,+S%C3%A3o+Jos%C3%A9+-+SC,+88117-410&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização DN Barbearia no Google Maps"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
