import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDuration } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BarbersPage() {
  const barbers = await prisma.barber.findMany({
    where: { active: true },
    include: {
      services: {
        include: {
          service: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="pt-20 bg-zinc-950 min-h-screen">
      {/* Banner */}
      <div className="bg-zinc-900 border-b border-zinc-800 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Nossos Barbeiros</h1>
        <p className="text-zinc-400 max-w-2xl mx-auto px-4">
          Conheça nossa equipe de especialistas, prontos para oferecer o melhor atendimento.
        </p>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {barbers.map((barber) => (
            <div key={barber.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col group">
              <div className="aspect-[4/3] relative bg-zinc-800 flex items-center justify-center overflow-hidden">
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
              
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-white mb-1">{barber.name}</h3>
                {barber.specialty && (
                  <p className="text-amber-500 font-medium mb-6">{barber.specialty}</p>
                )}
                
                <div className="flex-grow">
                  <h4 className="text-zinc-300 font-semibold mb-3 border-b border-zinc-800 pb-2">Serviços Realizados</h4>
                  {barber.services.length > 0 ? (
                    <ul className="space-y-3 mb-6">
                      {barber.services.map(({ service }) => (
                        <li key={service.id} className="flex justify-between items-center text-sm">
                          <span className="text-zinc-400">{service.name}</span>
                          <span className="text-amber-500 font-medium">
                            {formatCurrency ? formatCurrency(Number(service.price)) : `R$ ${Number(service.price)},00`}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-zinc-500 text-sm mb-6">Nenhum serviço associado.</p>
                  )}
                </div>

                <Link
                  href={`/agendar?barber=${barber.id}`}
                  className="block w-full py-3 px-4 bg-zinc-800 hover:bg-amber-500 text-white hover:text-zinc-950 text-center font-bold rounded-lg transition-colors mt-auto"
                >
                  Agendar com {barber.name.split(' ')[0]}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {barbers.length === 0 && (
          <div className="text-center text-zinc-500 py-12">
            Nenhum barbeiro encontrado.
          </div>
        )}
      </div>
    </div>
  );
}
