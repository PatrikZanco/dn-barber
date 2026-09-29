'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, X, User, Scissors, Loader2, Upload, Camera } from 'lucide-react';

interface Service {
  id: string;
  name: string;
}

interface Barber {
  id: string;
  name: string;
  specialty?: string | null;
  photo?: string | null;
  active: boolean;
  services?: Service[];
}

export default function BarbeirosPage() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBarber, setCurrentBarber] = useState<Partial<Barber> & { serviceIds?: string[] } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchBarbers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/barbers');
      const json = await res.json();
      if (res.ok) {
        setBarbers(Array.isArray(json) ? json : (json.data || []));
      }
    } catch (err) {
      console.error('Erro ao buscar barbeiros:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services?active=true');
      const json = await res.json();
      if (res.ok) {
        setAvailableServices(Array.isArray(json) ? json : (json.data || []));
      }
    } catch (err) {
      console.error('Erro ao buscar serviços:', err);
    }
  };

  useEffect(() => {
    fetchBarbers();
    fetchServices();
  }, []);

  const handleOpenModal = (barber?: Barber) => {
    setErrorMsg(null);
    setCurrentBarber(
      barber
        ? {
            ...barber,
            serviceIds: barber.services?.map((s) => s.id) || [],
          }
        : {
            name: '',
            specialty: '',
            photo: '',
            active: true,
            serviceIds: [],
          }
    );
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBarber?.name) {
      setErrorMsg('O nome do barbeiro é obrigatório.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    try {
      const payload = {
        name: currentBarber.name,
        specialty: currentBarber.specialty || '',
        photo: currentBarber.photo || '',
        active: currentBarber.active ?? true,
        serviceIds: currentBarber.serviceIds || [],
      };

      let res: Response;
      if (currentBarber.id) {
        res = await fetch(`/api/barbers/${currentBarber.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/barbers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Erro ao salvar barbeiro');
      }

      setIsModalOpen(false);
      await fetchBarbers();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao salvar barbeiro');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este barbeiro?')) return;

    try {
      const res = await fetch(`/api/barbers/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setBarbers((prev) => prev.filter((b) => b.id !== id));
        await fetchBarbers();
      } else {
        const json = await res.json();
        alert(json.error || 'Erro ao excluir');
      }
    } catch (err) {
      console.error('Erro ao excluir barbeiro:', err);
    }
  };

  const toggleService = (serviceId: string) => {
    if (!currentBarber) return;
    const current = currentBarber.serviceIds || [];
    const updated = current.includes(serviceId)
      ? current.filter((id) => id !== serviceId)
      : [...current, serviceId];
    setCurrentBarber({ ...currentBarber, serviceIds: updated });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('A foto deve ter no máximo 8MB.');
      return;
    }

    try {
      setUploadingPhoto(true);
      setErrorMsg(null);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.url) {
        throw new Error(json.error || 'Erro ao enviar imagem');
      }

      setCurrentBarber((prev) => (prev ? { ...prev, photo: json.url } : null));
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao fazer upload da foto');
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Gerenciar Barbeiros</h1>
          <p className="text-zinc-400 text-sm mt-1">Cadastre os profissionais da equipe e seus serviços</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-amber-500 hover:bg-amber-600 text-zinc-900 font-semibold rounded-lg px-4 py-2.5 flex items-center gap-2 transition-colors ml-auto md:ml-0"
        >
          <Plus size={20} />
          <span>Novo Barbeiro</span>
        </button>
      </div>

      {loading ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 flex flex-col items-center justify-center text-zinc-500 gap-3">
          <Loader2 className="animate-spin text-amber-500" size={32} />
          <p>Carregando equipe de barbeiros...</p>
        </div>
      ) : barbers.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center text-zinc-500">
          <User className="mx-auto mb-3 opacity-30" size={40} />
          <p className="text-lg">Nenhum barbeiro cadastrado.</p>
          <p className="text-sm text-zinc-600 mt-1">Clique em "Novo Barbeiro" para começar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {barbers.map((barber) => (
            <div key={barber.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {barber.photo ? (
                    <img src={barber.photo} alt={barber.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={32} className="text-zinc-500" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenModal(barber)}
                    className="p-1.5 text-zinc-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-md transition-colors"
                    title="Editar"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(barber.id)}
                    className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-zinc-100">{barber.name}</h3>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      barber.active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-700/50 text-zinc-400'
                    }`}
                  >
                    {barber.active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <p className="text-zinc-400 text-sm mt-1">{barber.specialty || 'Barbeiro Profissional'}</p>
              </div>

              {barber.services && barber.services.length > 0 && (
                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <div className="text-xs text-zinc-500 mb-2 flex items-center gap-1">
                    <Scissors size={12} />
                    <span>Serviços que realiza:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {barber.services.map((s) => (
                      <span
                        key={s.id}
                        className="bg-zinc-800 text-zinc-300 text-xs px-2 py-0.5 rounded border border-zinc-700/50"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-zinc-800 flex-shrink-0">
              <h2 className="text-xl font-semibold text-zinc-100">
                {currentBarber?.id ? 'Editar Barbeiro' : 'Novo Barbeiro'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-100">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1">
              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Nome</label>
                <input
                  required
                  type="text"
                  value={currentBarber?.name || ''}
                  onChange={(e) => setCurrentBarber({ ...currentBarber, name: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 focus:border-amber-500 focus:outline-none"
                  placeholder="Ex: João da Silva"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Especialidade</label>
                <input
                  type="text"
                  value={currentBarber?.specialty || ''}
                  onChange={(e) => setCurrentBarber({ ...currentBarber, specialty: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 focus:border-amber-500 focus:outline-none"
                  placeholder="Ex: Cortes Clássicos, Barboterapia"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Foto do Barbeiro</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />

                {currentBarber?.photo ? (
                  <div className="flex items-center gap-4 p-3 bg-zinc-800/80 rounded-xl border border-zinc-700">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-900 border-2 border-amber-500 flex-shrink-0">
                      <img
                        src={currentBarber.photo}
                        alt="Foto do barbeiro"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-200 truncate">Foto carregada</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingPhoto}
                          className="text-xs px-2.5 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded-md transition-colors font-medium flex items-center gap-1.5"
                        >
                          <Upload size={13} />
                          <span>Trocar Imagem</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrentBarber({ ...currentBarber, photo: '' })}
                          className="text-xs px-2.5 py-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => !uploadingPhoto && fileInputRef.current?.click()}
                    className="border-2 border-dashed border-zinc-700 hover:border-amber-500/80 bg-zinc-800/40 hover:bg-zinc-800/80 rounded-xl p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 group"
                  >
                    {uploadingPhoto ? (
                      <>
                        <Loader2 className="animate-spin text-amber-500" size={28} />
                        <span className="text-sm text-zinc-400">Enviando imagem do barbeiro...</span>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-zinc-800 group-hover:bg-amber-500/10 text-zinc-400 group-hover:text-amber-500 flex items-center justify-center transition-colors">
                          <Upload size={22} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-zinc-200 group-hover:text-amber-400">
                            Clique para selecionar ou arraste uma foto
                          </p>
                          <p className="text-xs text-zinc-500 mt-1">PNG, JPG ou WebP (máx. 8MB)</p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {availableServices.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Serviços que realiza:</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto p-2 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                    {availableServices.map((svc) => {
                      const isChecked = currentBarber?.serviceIds?.includes(svc.id) || false;
                      return (
                        <label
                          key={svc.id}
                          className="flex items-center gap-2.5 text-sm text-zinc-300 hover:text-white cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleService(svc.id)}
                            className="rounded bg-zinc-700 border-zinc-600 text-amber-500 focus:ring-amber-500"
                          />
                          <span>{svc.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={currentBarber?.active ?? true}
                    onChange={(e) => setCurrentBarber({ ...currentBarber, active: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  <span className="ml-3 text-sm font-medium text-zinc-300">Barbeiro Ativo</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
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
