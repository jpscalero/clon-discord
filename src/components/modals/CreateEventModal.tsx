import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Image,
  Sparkles,
} from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';

export const CreateEventModal: React.FC = () => {
  const { isCreateEventOpen, setModalPro, createEvent, activeGuildId } = useChatStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Escenario Principal (Live)');
  const [startDate, setStartDate] = useState(
    new Date(Date.now() + 86400000).toISOString().slice(0, 16)
  );
  const [bannerUrl, setBannerUrl] = useState(
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'
  );

  if (!isCreateEventOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createEvent({
      guildId: activeGuildId,
      title: title.trim(),
      description: description.trim() || 'Evento de la comunidad Discord Pro',
      location: location.trim(),
      startDate: new Date(startDate).toISOString(),
      bannerUrl: bannerUrl.trim() || undefined,
    });

    setTitle('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#313338] w-full max-w-lg rounded-2xl shadow-2xl border border-[#3f4147] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-[#2b2d31] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#5865f2]/20 text-[#5865f2] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Programar Evento</h2>
              <p className="text-xs text-[#949ba4]">Reúne a tu comunidad en un canal de voz o escenario</p>
            </div>
          </div>
          <button
            onClick={() => setModalPro('event', false)}
            className="p-1.5 text-[#949ba4] hover:text-white rounded-lg hover:bg-[#35373c] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#b5bac1] mb-2">
              Tema / Título del Evento
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Torneo de Gaming, Charla de Arquitectura..."
              required
              className="w-full bg-[#1e1f22] text-sm text-[#dbdee1] p-3 rounded-xl border border-[#3f4147] focus:outline-none focus:border-[#5865f2]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#b5bac1] mb-2">
              Ubicación
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Escenario Principal o Sala de Voz"
              required
              className="w-full bg-[#1e1f22] text-xs text-[#dbdee1] p-2.5 rounded-xl border border-[#3f4147] focus:outline-none focus:border-[#5865f2]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#b5bac1] mb-2">
              Fecha y Hora de Inicio
            </label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full bg-[#1e1f22] text-xs text-[#dbdee1] p-2.5 rounded-xl border border-[#3f4147] focus:outline-none focus:border-[#5865f2]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#b5bac1] mb-2">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalla de qué tratará este encuentro comunitario..."
              rows={3}
              className="w-full bg-[#1e1f22] text-xs text-[#dbdee1] p-2.5 rounded-xl border border-[#3f4147] focus:outline-none focus:border-[#5865f2]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#b5bac1] mb-2">
              URL del Banner (Opcional)
            </label>
            <input
              type="url"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              className="w-full bg-[#1e1f22] text-xs text-[#dbdee1] p-2.5 rounded-xl border border-[#3f4147] focus:outline-none focus:border-[#5865f2]"
            />
          </div>

          {/* Footer */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalPro('event', false)}
              className="px-4 py-2 text-xs font-semibold text-[#dbdee1] hover:underline"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-xl text-xs font-bold transition shadow-md"
            >
              Crear Evento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
