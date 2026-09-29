'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Scissors, Loader2 } from 'lucide-react';
import { formatCurrency, formatDuration } from '@/lib/utils';

interface Service {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  active: boolean;
  icon?: string | null;
  photo?: string | null;
}

export default function ServicosPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<Service> | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/services');
      const json = await res.json();
      if (res.ok) {
        setServices(Array.isArray(json) ? json : (json.data || []));
      }
    } catch (err) {
      console.error('Erro ao buscar serviços:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenModal = (service?: Service) => {
    setErrorMsg(null);
    setCurrentService(
      service || {
        name: '',
        price: 35,
        durationMinutes: 30,
        active: true,
      }
    );
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentService?.name || currentService?.price === undefined) {
      setErrorMsg('Preencha os campos obrigatórios.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    try {
      const payload = {
        name: currentService.name,
        price: Number(currentService.price),
        durationMinutes: Number(currentService.durationMinutes) || 30,
        active: currentService.active ?? true,
      };

      let res: Response;
      if (currentService.id) {
        // Update
        res = await fetch(`/api/services/${currentService.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // Create
        res = await fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Erro ao salvar serviço');
      }

      setIsModalOpen(false);
      await fetchServices();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao salvar serviço');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return;

    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.id !== id));
        await fetchServices();
      } else {
        const json = await res.json();
        alert(json.error || 'Erro ao excluir');
      }
    } catch (err) {
      console.error('Erro ao excluir serviço:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Gerenciar Serviços</h1>
          <p className="text-zinc-400 text-sm mt-1">Cadastre e altere os serviços disponíveis para agendamento</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-amber-500 hover:bg-amber-600 text-zinc-900 font-semibold rounded-lg px-4 py-2.5 flex items-center gap-2 transition-colors ml-auto md:ml-0"
        >
          <Plus size={20} />
          <span>Novo Serviço</span>
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-zinc-500 gap-3">
            <Loader2 className="animate-spin text-amber-500" size={32} />
            <p>Carregando serviços do banco de dados...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            <Scissors className="mx-auto mb-3 opacity-30" size={40} />
            <p className="text-lg">Nenhum serviço cadastrado.</p>
            <p className="text-sm text-zinc-600 mt-1">Clique em "Novo Serviço" para começar.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/50">
                  <th className="px-6 py-4 text-sm font-medium text-zinc-400">Nome</th>
                  <th className="px-6 py-4 text-sm font-medium text-zinc-400">Preço</th>
                  <th className="px-6 py-4 text-sm font-medium text-zinc-400">Duração</th>
                  <th className="px-6 py-4 text-sm font-medium text-zinc-400">Status</th>
                  <th className="px-6 py-4 text-sm font-medium text-zinc-400 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-zinc-100 flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
                        <Scissors size={16} />
                      </div>
                      <span>{service.name}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-300 font-semibold text-amber-400">
                      {formatCurrency(service.price)}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-300">
                      {formatDuration(service.durationMinutes)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          service.active
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-zinc-700/50 text-zinc-400'
                        }`}
                      >
                        {service.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(service)}
                          className="p-1.5 text-zinc-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-md transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center p-6 border-b border-zinc-800">
              <h2 className="text-xl font-semibold text-zinc-100">
                {currentService?.id ? 'Editar Serviço' : 'Novo Serviço'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-100">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Nome do Serviço</label>
                <input
                  required
                  type="text"
                  value={currentService?.name || ''}
                  onChange={(e) => setCurrentService({ ...currentService, name: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 focus:border-amber-500 focus:outline-none"
                  placeholder="Ex: Corte Degradê"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">Preço (R$)</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    value={currentService?.price !== undefined ? currentService.price : ''}
                    onChange={(e) =>
                      setCurrentService({ ...currentService, price: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">Duração (min)</label>
                  <input
                    required
                    type="number"
                    step="5"
                    min="15"
                    max="480"
                    value={currentService?.durationMinutes || 30}
                    onChange={(e) =>
                      setCurrentService({
                        ...currentService,
                        durationMinutes: parseInt(e.target.value, 10) || 30,
                      })
                    }
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={currentService?.active ?? true}
                    onChange={(e) => setCurrentService({ ...currentService, active: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  <span className="ml-3 text-sm font-medium text-zinc-300">Serviço Ativo</span>
                </label>
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg px-4 py-2.5 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-zinc-900 rounded-lg px-4 py-2.5 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <span>Salvar</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
