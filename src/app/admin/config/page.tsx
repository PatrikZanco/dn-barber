'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Check } from 'lucide-react';

interface WorkingHoursDay {
  open: string;
  close: string;
  closed?: boolean;
}

interface ShopSettingsData {
  id?: string;
  shopName: string;
  phone?: string | null;
  whatsapp: string;
  address: string;
  instagram?: string | null;
  facebook?: string | null;
  workingHours: Record<string, WorkingHoursDay>;
}

const DAYS = [
  { key: 'monday', label: 'Segunda-feira' },
  { key: 'tuesday', label: 'Terça-feira' },
  { key: 'wednesday', label: 'Quarta-feira' },
  { key: 'thursday', label: 'Quinta-feira' },
  { key: 'friday', label: 'Sexta-feira' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' },
];

export default function ConfigPage() {
  const [activeTab, setActiveTab] = useState<'geral' | 'horarios'>('geral');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [settings, setSettings] = useState<ShopSettingsData>({
    shopName: 'DN Barbearia',
    phone: '(11) 98765-4321',
    whatsapp: '11987654321',
    address: 'Rua Exemplo, 123 - Centro, São Paulo - SP',
    instagram: '@dnbarbearia',
    facebook: '',
    workingHours: {
      monday: { open: '09:00', close: '20:00' },
      tuesday: { open: '09:00', close: '20:00' },
      wednesday: { open: '09:00', close: '20:00' },
      thursday: { open: '09:00', close: '20:00' },
      friday: { open: '09:00', close: '20:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: '09:00', close: '14:00', closed: true },
    },
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/settings');
      const json = await res.json();
      if (res.ok && json.data) {
        setSettings({
          ...json.data,
          workingHours: json.data.workingHours || settings.workingHours,
        });
      }
    } catch (err) {
      console.error('Erro ao carregar configurações:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Erro ao salvar configurações');
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const handleHourChange = (dayKey: string, field: 'open' | 'close' | 'closed', value: any) => {
    setSettings((prev) => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [dayKey]: {
          ...(prev.workingHours[dayKey] || { open: '09:00', close: '19:00' }),
          [field]: value,
        },
      },
    }));
  };

  if (loading) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 flex flex-col items-center justify-center text-zinc-500 gap-3">
        <Loader2 className="animate-spin text-amber-500" size={32} />
        <p>Carregando configurações...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Configurações da Barbearia</h1>
        <p className="text-zinc-400 mt-1 text-sm">Gerencie as informações exibidas no site e horários de atendimento</p>
      </div>

      <div className="flex gap-2 border-b border-zinc-800 pb-px">
        <button
          onClick={() => setActiveTab('geral')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'geral'
              ? 'border-amber-500 text-amber-500'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Dados Gerais
        </button>
        <button
          onClick={() => setActiveTab('horarios')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'horarios'
              ? 'border-amber-500 text-amber-500'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Horários de Funcionamento
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm">
            {errorMsg}
          </div>
        )}

        {savedSuccess && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-sm flex items-center gap-2">
            <Check size={18} />
            <span>Configurações salvas e atualizadas com sucesso!</span>
          </div>
        )}

        {activeTab === 'geral' ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Nome da Barbearia</label>
              <input
                required
                type="text"
                value={settings.shopName}
                onChange={(e) => setSettings({ ...settings, shopName: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Telefone de Contato</label>
                <input
                  type="text"
                  value={settings.phone || ''}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">WhatsApp (com DDD)</label>
                <input
                  required
                  type="text"
                  value={settings.whatsapp}
                  onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Endereço Completo</label>
              <input
                required
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Instagram (ex: @dnbarbearia)</label>
                <input
                  type="text"
                  value={settings.instagram || ''}
                  onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Facebook</label>
                <input
                  type="text"
                  value={settings.facebook || ''}
                  onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
            <p className="text-sm text-zinc-400 mb-4">
              Defina o horário de abertura e fechamento para cada dia da semana.
            </p>

            <div className="space-y-3">
              {DAYS.map((day) => {
                const dayHour = settings.workingHours[day.key] || { open: '09:00', close: '20:00' };
                const isClosed = dayHour.closed || false;

                return (
                  <div
                    key={day.key}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-zinc-800/40 rounded-lg border border-zinc-800 gap-3"
                  >
                    <div className="flex items-center gap-3 w-44">
                      <input
                        type="checkbox"
                        checked={!isClosed}
                        onChange={(e) => handleHourChange(day.key, 'closed', !e.target.checked)}
                        className="rounded bg-zinc-700 border-zinc-600 text-amber-500 focus:ring-amber-500"
                      />
                      <span className="text-sm font-medium text-zinc-200">{day.label}</span>
                    </div>

                    {!isClosed ? (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-zinc-400">Abertura:</span>
                          <input
                            type="time"
                            value={dayHour.open}
                            onChange={(e) => handleHourChange(day.key, 'open', e.target.value)}
                            className="bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                        <span className="text-zinc-600">—</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-zinc-400">Fechamento:</span>
                          <input
                            type="time"
                            value={dayHour.close}
                            onChange={(e) => handleHourChange(day.key, 'close', e.target.value)}
                            className="bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs font-medium text-red-400/80 bg-red-500/10 px-2.5 py-1 rounded">
                        Fechado
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-zinc-900 font-semibold rounded-lg px-6 py-2.5 flex items-center gap-2 transition-colors"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Salvar Configurações</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
