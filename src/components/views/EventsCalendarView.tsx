import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  Check,
  Bell,
  Sparkles,
  Share2,
} from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';

export const EventsCalendarView: React.FC = () => {
  const { events, toggleEventRSVP, setModalPro, currentUser, users } = useChatStore();
  const [filter, setFilter] = useState<'all' | 'my'>('all');

  const filteredEvents =
    filter === 'my'
      ? events.filter((e) => e.attendees.includes(currentUser.id))
      : events;

  return (
    <div className="flex-1 h-full bg-[#1e1f22] flex flex-col overflow-y-auto select-none">
      {/* Top Header */}
      <div className="h-16 px-8 bg-[#2b2d31] border-b border-[#1f2023] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#5865f2]/20 text-[#5865f2] flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white">Calendario de Eventos Comunitarios</h1>
            <p className="text-xs text-[#949ba4]">
              {events.length} eventos programados para este servidor
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter pills */}
          <div className="flex items-center bg-[#1e1f22] p-1 rounded-xl border border-[#35373c]">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                filter === 'all' ? 'bg-[#5865f2] text-white shadow' : 'text-[#949ba4] hover:text-white'
              }`}
            >
              Todos ({events.length})
            </button>
            <button
              onClick={() => setFilter('my')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                filter === 'my' ? 'bg-[#5865f2] text-white shadow' : 'text-[#949ba4] hover:text-white'
              }`}
            >
              Mis Asistencias ({events.filter((e) => e.attendees.includes(currentUser.id)).length})
            </button>
          </div>

          <button
            onClick={() => setModalPro('event', true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-xl text-xs font-bold transition shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Evento</span>
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-6xl w-full mx-auto p-8">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 text-[#949ba4]">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-40 text-[#5865f2]" />
            <h3 className="text-sm font-bold text-white">No hay eventos en esta lista</h3>
            <p className="text-xs text-[#80848e] mt-1">Crea el primer evento para reunir a la comunidad.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEvents.map((event) => {
              const isAttending = event.attendees.includes(currentUser.id);
              const eventDate = new Date(event.startDate);
              const dateString = eventDate.toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={event.id}
                  className="bg-[#2b2d31] rounded-3xl overflow-hidden border border-[#35373c] hover:border-[#5865f2]/50 transition-all shadow-xl flex flex-col group"
                >
                  {/* Banner */}
                  <div className="h-44 w-full relative overflow-hidden bg-[#1e1f22]">
                    {event.bannerUrl ? (
                      <img
                        src={event.bannerUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#5865f2] to-[#eb459e] flex items-center justify-center">
                        <Sparkles className="w-10 h-10 text-white/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2b2d31] via-transparent to-black/30" />

                    {/* Date Pill Top Left */}
                    <div className="absolute top-3 left-3 bg-[#1e1f22]/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1.5 border border-[#35373c]">
                      <Clock className="w-3.5 h-3.5 text-[#5865f2]" />
                      <span className="capitalize">{dateString}</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#5865f2] mb-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{event.location}</span>
                      </div>
                      <h3 className="text-base font-bold text-white mb-2 leading-snug">
                        {event.title}
                      </h3>
                      <p className="text-xs text-[#949ba4] leading-relaxed line-clamp-2">
                        {event.description}
                      </p>
                    </div>

                    {/* Attendees & Actions Footer */}
                    <div className="mt-6 pt-4 border-t border-[#35373c] flex items-center justify-between">
                      {/* Attendees Avatars */}
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2 overflow-hidden">
                          {event.attendees.slice(0, 4).map((uid) => {
                            const u = users[uid];
                            return (
                              <img
                                key={uid}
                                src={u?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                                alt="Attendee"
                                className="inline-block h-6 w-6 rounded-full ring-2 ring-[#2b2d31] object-cover"
                              />
                            );
                          })}
                        </div>
                        <span className="text-xs text-[#949ba4] font-medium">
                          {event.attendees.length} asistirán
                        </span>
                      </div>

                      {/* RSVP Toggle Button */}
                      <button
                        onClick={() => toggleEventRSVP(event.id)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow ${
                          isAttending
                            ? 'bg-[#23a55a] text-white hover:bg-[#1a8044]'
                            : 'bg-[#5865f2] text-white hover:bg-[#4752c4]'
                        }`}
                      >
                        {isAttending ? <Check className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                        <span>{isAttending ? 'Asistirás' : 'Me Interesa'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
