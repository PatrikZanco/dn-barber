'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Loader2, Upload } from 'lucide-react';

interface GalleryImage {
  id: string;
  url: string;
  caption?: string | null;
  order: number;
  active: boolean;
}

export default function GaleriaPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImg, setCurrentImg] = useState<Partial<GalleryImage> | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/gallery');
      const json = await res.json();
      if (res.ok) {
        setImages(Array.isArray(json) ? json : (json.data || []));
      }
    } catch (err) {
      console.error('Erro ao buscar fotos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleOpenModal = (img?: GalleryImage) => {
    setErrorMsg(null);
    setCurrentImg(
      img || {
        url: '',
        caption: '',
        order: images.length + 1,
        active: true,
      }
    );
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentImg?.url) {
      setErrorMsg('A URL da imagem é obrigatória.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    try {
      const payload = {
        url: currentImg.url,
        caption: currentImg.caption || '',
        order: Number(currentImg.order) || 1,
        active: currentImg.active ?? true,
      };

      let res: Response;
      if (currentImg.id) {
        res = await fetch(`/api/gallery/${currentImg.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Erro ao salvar imagem');
      }

      setIsModalOpen(false);
      await fetchImages();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao salvar imagem');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('A imagem deve ter no máximo 10MB.');
      return;
    }

    try {
      setUploadingImage(true);
      setErrorMsg(null);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.url) {
        throw new Error(json.error || 'Erro ao fazer upload da imagem');
      }

      setCurrentImg((prev) => (prev ? { ...prev, url: json.url } : null));
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha no upload da foto');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta foto da galeria?')) return;

    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setImages((prev) => prev.filter((i) => i.id !== id));
        await fetchImages();
      } else {
        const json = await res.json();
        alert(json.error || 'Erro ao excluir imagem');
      }
    } catch (err) {
      console.error('Erro ao excluir foto:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Galeria de Fotos</h1>
          <p className="text-zinc-400 text-sm mt-1">Gerencie as fotos exibidas no carrossel e na página Sobre Nós</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-amber-500 hover:bg-amber-600 text-zinc-900 font-semibold rounded-lg px-4 py-2.5 flex items-center gap-2 transition-colors ml-auto md:ml-0"
        >
          <Plus size={20} />
          <span>Nova Foto</span>
        </button>
      </div>

      {loading ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 flex flex-col items-center justify-center text-zinc-500 gap-3">
          <Loader2 className="animate-spin text-amber-500" size={32} />
          <p>Carregando galeria...</p>
        </div>
      ) : images.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center text-zinc-500">
          <ImageIcon className="mx-auto mb-3 opacity-30" size={40} />
          <p className="text-lg">Nenhuma imagem cadastrada na galeria.</p>
          <p className="text-sm text-zinc-600 mt-1">Clique em "Nova Foto" para começar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img) => (
            <div
              key={img.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col group hover:border-zinc-700 transition-colors"
            >
              <div className="relative aspect-video w-full bg-zinc-800 overflow-hidden">
                <img
                  src={img.url}
                  alt={img.caption || 'Foto'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span
                  className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-medium backdrop-blur-md ${
                    img.active ? 'bg-emerald-500/80 text-white' : 'bg-zinc-900/80 text-zinc-400'
                  }`}
                >
                  {img.active ? 'Ativa' : 'Inativa'}
                </span>
                <span className="absolute top-3 left-3 bg-zinc-950/70 text-zinc-300 text-xs px-2 py-0.5 rounded font-mono">
                  #{img.order}
                </span>
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between">
                <p className="text-zinc-200 text-sm font-medium">{img.caption || 'Sem legenda'}</p>
                <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-zinc-800">
                  <button
                    onClick={() => handleOpenModal(img)}
                    className="p-1.5 text-zinc-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-md transition-colors"
                    title="Editar"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center p-6 border-b border-zinc-800">
              <h2 className="text-xl font-semibold text-zinc-100">
                {currentImg?.id ? 'Editar Foto' : 'Adicionar Foto'}
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
                <label className="block text-sm font-medium text-zinc-300 mb-2">Foto da Galeria</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {currentImg?.url ? (
                  <div className="space-y-3">
                    <div className="rounded-xl overflow-hidden border border-zinc-700 aspect-video bg-zinc-950 max-h-48 relative">
                      <img
                        src={currentImg.url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="text-xs px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md transition-colors font-medium flex items-center gap-1.5"
                      >
                        <Upload size={13} />
                        <span>Trocar Imagem</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentImg({ ...currentImg, url: '' })}
                        className="text-xs px-3 py-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => !uploadingImage && fileInputRef.current?.click()}
                    className="border-2 border-dashed border-zinc-700 hover:border-amber-500/80 bg-zinc-800/40 hover:bg-zinc-800/80 rounded-xl p-8 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 group"
                  >
                    {uploadingImage ? (
                      <>
                        <Loader2 className="animate-spin text-amber-500" size={32} />
                        <span className="text-sm text-zinc-400">Enviando foto da galeria...</span>
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
                          <p className="text-xs text-zinc-500 mt-1">PNG, JPG ou WebP (máx. 10MB)</p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Legenda / Descrição</label>
                <input
                  type="text"
                  value={currentImg?.caption || ''}
                  onChange={(e) => setCurrentImg({ ...currentImg, caption: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 focus:border-amber-500 focus:outline-none"
                  placeholder="Ex: Espaço lounge da barbearia"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Ordem de Exibição</label>
                <input
                  required
                  type="number"
                  min="1"
                  value={currentImg?.order || 1}
                  onChange={(e) => setCurrentImg({ ...currentImg, order: parseInt(e.target.value, 10) || 1 })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={currentImg?.active ?? true}
                    onChange={(e) => setCurrentImg({ ...currentImg, active: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  <span className="ml-3 text-sm font-medium text-zinc-300">Foto Ativa no Site</span>
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
