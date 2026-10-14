import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  QrCode,
  Flame,
  KeyRound,
  CheckCircle2,
  Lock,
  Copy,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';

export const E2EESafetyModal: React.FC = () => {
  const { isE2EESafetyOpen, setModalPro } = useChatStore();
  const [ephemeralTime, setEphemeralTime] = useState<string>('off');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);

  if (!isE2EESafetyOpen) return null;

  const safetyNumbers = '48291 03948 19283 84729 93847 28472 84920 18274 93820 48291 19384 57291';

  const handleCopySafetyNumbers = () => {
    navigator.clipboard.writeText(safetyNumbers);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#313338] w-full max-w-lg rounded-3xl shadow-2xl border border-[#3f4147] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 border-b border-[#2b2d31] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#23a55a]/20 text-[#23a55a] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Bóveda Criptográfica E2EE</h2>
              <p className="text-xs text-[#949ba4]">Signal Protocol & Discord DAVE MLS v1.0</p>
            </div>
          </div>
          <button
            onClick={() => setModalPro('e2ee', false)}
            className="p-1.5 text-[#949ba4] hover:text-white rounded-lg hover:bg-[#35373c] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Status Badge */}
          <div className="bg-[#23a55a]/10 border border-[#23a55a]/30 rounded-2xl p-4 flex items-center gap-3">
            <Lock className="w-5 h-5 text-[#23a55a] shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-white block">Cifrado de Extremo a Extremo Verificado</span>
              <span className="text-[#b5bac1]">
                Tus mensajes y transmisiones de voz viajan cifrados con Double Ratchet. Ni los servidores de Discord pueden leer tus comunicaciones.
              </span>
            </div>
          </div>

          {/* Safety Numbers Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#b5bac1] flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#5865f2]" />
                Números de Seguridad (Safety Numbers)
              </label>
              <button
                onClick={handleCopySafetyNumbers}
                className="text-[11px] text-[#5865f2] hover:underline flex items-center gap-1 font-semibold"
              >
                {isCopied ? <Check className="w-3 h-3 text-[#23a55a]" /> : <Copy className="w-3 h-3" />}
                <span>{isCopied ? 'Copiados' : 'Copiar'}</span>
              </button>
            </div>

            <div className="p-4 bg-[#1e1f22] rounded-2xl border border-[#3f4147] font-mono text-center text-xs tracking-wider text-[#dbdee1] leading-relaxed">
              {safetyNumbers}
            </div>
          </div>

          {/* Ephemeral Messages (Burn-After-Reading) */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#b5bac1] flex items-center gap-1.5 mb-2">
              <Flame className="w-3.5 h-3.5 text-[#da373c]" />
              Mensajes Efímeros (Burn-After-Reading)
            </label>
            <p className="text-xs text-[#949ba4] mb-3">
              Los mensajes se autodestruyen criptográficamente en ambos dispositivos tras el tiempo seleccionado:
            </p>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'off', label: 'Desactivado' },
                { id: '5s', label: '5 Segundos' },
                { id: '1m', label: '1 Minuto' },
                { id: '1h', label: '1 Hora' },
                { id: '24h', label: '24 Horas' },
                { id: '7d', label: '7 Días' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setEphemeralTime(opt.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                    ephemeralTime === opt.id
                      ? 'border-[#da373c] bg-[#da373c]/20 text-white shadow'
                      : 'border-[#3f4147] bg-[#1e1f22] text-[#949ba4] hover:text-white hover:bg-[#2b2d31]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Verification Confirmation */}
          <div className="pt-2 border-t border-[#3f4147] flex items-center justify-between">
            <button
              onClick={() => setIsVerified(!isVerified)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                isVerified
                  ? 'bg-[#23a55a] text-white'
                  : 'bg-[#35373c] text-[#dbdee1] hover:bg-[#3f4147]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isVerified ? 'Huella Verificada' : 'Marcar como Verificado'}</span>
            </button>

            <button
              onClick={() => setModalPro('e2ee', false)}
              className="px-5 py-2.5 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-xl text-xs font-bold transition shadow-md"
            >
              Cerrar Bóveda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
