import React from 'react';
import {
  BarChart2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  UserCheck,
  Award,
} from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';
import { Poll } from '../../types';

interface PollCardProps {
  poll: Poll;
}

export const PollCard: React.FC<PollCardProps> = ({ poll }) => {
  const { votePoll, currentUser, users } = useChatStore();

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
  const userHasVoted = poll.options.some((opt) => opt.voters.includes(currentUser.id));

  return (
    <div className="my-2 bg-[#2b2d31] border border-[#35373c] hover:border-[#5865f2]/40 rounded-2xl p-4 max-w-lg w-full shadow-md transition">
      {/* Poll Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#5865f2] bg-[#5865f2]/10 px-2 py-0.5 rounded-full">
              <BarChart2 className="w-3 h-3" /> Encuesta Oficial
            </span>
            {poll.weightedByRole && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-[#fee75c] bg-[#fee75c]/10 px-2 py-0.5 rounded-full" title="Los votos de roles de mayor jerarquía tienen mayor peso">
                <Award className="w-3 h-3" /> Ponderada por Rol
              </span>
            )}
            {poll.isAnonymous && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-[#23a55a] bg-[#23a55a]/10 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" /> Anónima
              </span>
            )}
          </div>
          <h4 className="text-sm font-bold text-white leading-snug">{poll.question}</h4>
        </div>
      </div>

      {/* Options List */}
      <div className="space-y-2.5 my-3">
        {poll.options.map((option) => {
          const isSelected = option.voters.includes(currentUser.id);
          const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;

          return (
            <div
              key={option.id}
              onClick={() => votePoll(poll.channelId, poll.id, option.id)}
              className={`relative overflow-hidden cursor-pointer rounded-xl border p-3 transition-all ${
                isSelected
                  ? 'border-[#5865f2] bg-[#5865f2]/15 shadow-sm'
                  : 'border-[#3f4147]/60 hover:border-[#5865f2]/40 bg-[#1e1f22]/50 hover:bg-[#1e1f22]'
              }`}
            >
              {/* Progress Bar Fill */}
              {totalVotes > 0 && (
                <div
                  className={`absolute inset-y-0 left-0 transition-all duration-500 ${
                    isSelected ? 'bg-[#5865f2]/30' : 'bg-[#3f4147]/30'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              )}

              {/* Text & Stats */}
              <div className="relative z-10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${
                      isSelected
                        ? 'border-[#5865f2] bg-[#5865f2] text-white'
                        : 'border-[#4e5058] bg-transparent'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3 h-3" />}
                  </div>
                  <span className={`font-medium ${isSelected ? 'text-white font-bold' : 'text-[#dbdee1]'}`}>
                    {option.text}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono">
                  <span className="text-[#949ba4] text-[11px]">{option.votes} votos</span>
                  <span className="font-bold text-white text-xs">{percentage}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Poll Footer */}
      <div className="pt-2 border-t border-[#35373c] flex items-center justify-between text-[11px] text-[#949ba4]">
        <span>{totalVotes} {totalVotes === 1 ? 'voto total' : 'votos totales'}</span>
        <div className="flex items-center gap-1 text-[#80848e]">
          <Clock className="w-3 h-3" />
          <span>Finaliza en 2 días</span>
        </div>
      </div>
    </div>
  );
};
