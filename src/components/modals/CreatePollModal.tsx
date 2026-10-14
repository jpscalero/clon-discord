import React, { useState } from 'react';
import {
  X,
  BarChart2,
  Plus,
  Trash2,
  ShieldCheck,
  Award,
  Sparkles,
} from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';

export const CreatePollModal: React.FC = () => {
  const { isCreatePollOpen, setModalPro, createPoll, activeChannelId } = useChatStore();

  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [weightedByRole, setWeightedByRole] = useState(false);

  if (!isCreatePollOpen) return null;

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validOptions = options.map((o) => o.trim()).filter((o) => o.length > 0);
    if (!question.trim() || validOptions.length < 2) return;

    createPoll(activeChannelId, question.trim(), validOptions, isAnonymous, weightedByRole);
    setQuestion('');
    setOptions(['', '']);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#313338] w-full max-w-lg rounded-2xl shadow-2xl border border-[#3f4147] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-[#2b2d31] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#5865f2]/20 text-[#5865f2] flex items-center justify-center">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Crear Nueva Encuesta</h2>
              <p className="text-xs text-[#949ba4]">Consulta la opinión de tu comunidad</p>
            </div>
          </div>
          <button
            onClick={() => setModalPro('poll', false)}
            className="p-1.5 text-[#949ba4] hover:text-white rounded-lg hover:bg-[#35373c] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Question */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#b5bac1] mb-2">
              Pregunta de la Encuesta
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="¿Qué te gustaría ver en el próximo evento?"
              required
              className="w-full bg-[#1e1f22] text-sm text-[#dbdee1] p-3 rounded-xl border border-[#3f4147] focus:outline-none focus:border-[#5865f2]"
            />
          </div>

          {/* Options */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#b5bac1] mb-2">
              Opciones de Respuesta (Mínimo 2)
            </label>
            <div className="space-y-2">
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`Opción ${idx + 1}`}
                    required
                    className="flex-1 bg-[#1e1f22] text-xs text-[#dbdee1] p-2.5 rounded-xl border border-[#3f4147] focus:outline-none focus:border-[#5865f2]"
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(idx)}
                      className="p-2 text-[#949ba4] hover:text-[#da373c] rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {options.length < 6 && (
              <button
                type="button"
                onClick={handleAddOption}
                className="mt-2.5 flex items-center gap-1.5 text-xs text-[#5865f2] hover:text-[#4752c4] font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir otra opción</span>
              </button>
            )}
          </div>

          {/* Settings / Flags */}
          <div className="pt-2 border-t border-[#3f4147] space-y-2.5">
            <label className="flex items-center gap-2 text-xs text-[#dbdee1] cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded accent-[#5865f2]"
              />
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#23a55a]" /> Voto Anónimo (Ocultar identidades)
              </span>
            </label>

            <label className="flex items-center gap-2 text-xs text-[#dbdee1] cursor-pointer">
              <input
                type="checkbox"
                checked={weightedByRole}
                onChange={(e) => setWeightedByRole(e.target.checked)}
                className="rounded accent-[#5865f2]"
              />
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-[#fee75c]" /> Voto Ponderado (Multiplicador por Roles VIP)
              </span>
            </label>
          </div>

          {/* Footer */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalPro('poll', false)}
              className="px-4 py-2 text-xs font-semibold text-[#dbdee1] hover:underline"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-xl text-xs font-bold transition shadow-md"
            >
              Publicar Encuesta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
