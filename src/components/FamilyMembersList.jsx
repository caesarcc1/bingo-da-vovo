import React from 'react';
import { Mic, Volume2, Users, Wifi, WifiOff } from 'lucide-react';

export function FamilyMembersList({
  roomUsers = [],
  isConnected = false,
  currentProfile,
  onOpenProfile,
  compact = false
}) {
  // Se não houver outros usuários conectados na sala Socket.io,
  // exibe pelo menos o perfil atual localmente para feedback imediato
  const displayUsers = roomUsers.length > 0 ? roomUsers : [
    {
      id: currentProfile?.id || 'local',
      name: currentProfile?.name || 'Vovó',
      role: currentProfile?.role || 'vovo',
      photo: currentProfile?.photo || '/vovo.jpg',
      isSpeaking: false
    }
  ];

  if (compact) {
    return (
      <div className="flex items-center gap-2 overflow-x-auto py-1 px-1 scrollbar-none">
        {displayUsers.map((user) => {
          const isVovo = user.role === 'vovo';
          const isSpeaking = !!user.isSpeaking;

          return (
            <div
              key={user.id}
              onClick={onOpenProfile}
              className={`
                flex items-center gap-2 px-2.5 py-1 rounded-full cursor-pointer transition-all border
                ${isSpeaking
                  ? 'bg-emerald-950/80 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)] ring-2 ring-emerald-400 animate-pulse'
                  : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
                }
              `}
              title={`${user.name} (${isVovo ? 'Vovó' : 'Neto'}) - ${isSpeaking ? 'Falando no microfone' : 'Online'}`}
            >
              <div className="relative">
                <div
                  className={`
                    w-7 h-7 rounded-full overflow-hidden border-2 bg-slate-700
                    ${isSpeaking ? 'border-emerald-300' : isVovo ? 'border-amber-400' : 'border-emerald-500'}
                  `}
                >
                  <img
                    src={user.photo || (isVovo ? '/vovo.jpg' : '/vovo.jpg')}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/vovo.jpg';
                    }}
                  />
                </div>
                {isSpeaking && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 animate-ping" />
                )}
              </div>

              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-black text-white max-w-[90px] truncate leading-tight">
                    {user.name}
                  </span>
                  {isSpeaking && (
                    <Mic className="w-3 h-3 text-emerald-400 animate-bounce" />
                  )}
                </div>
                <span className="text-[10px] text-slate-400 font-bold leading-tight">
                  {isSpeaking ? (
                    <span className="text-emerald-300 font-extrabold">Falando...</span>
                  ) : (
                    isVovo ? '👵 Vovó' : '📱 Neto'
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900/90 rounded-2xl p-2.5 sm:p-3 border border-slate-800 shadow-lg">
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800 text-xs font-bold text-slate-400">
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-amber-400" />
          <span className="text-slate-200">Família no Jogo</span>
          <span className="bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded-full text-[10px] font-black">
            {displayUsers.length}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px]">
          {isConnected ? (
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Servidor Conectado
            </span>
          ) : (
            <span className="flex items-center gap-1 text-slate-400 font-semibold" title="Jogando offline ou aguardando conexão com servidor">
              <WifiOff className="w-3.5 h-3.5" />
              Modo Local
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {displayUsers.map((user) => {
          const isVovo = user.role === 'vovo';
          const isSpeaking = !!user.isSpeaking;

          return (
            <div
              key={user.id}
              onClick={onOpenProfile}
              className={`
                flex items-center gap-2.5 px-3 py-1.5 rounded-2xl cursor-pointer transition-all border
                ${isSpeaking
                  ? 'bg-emerald-950/90 border-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.6)] ring-3 ring-emerald-400 scale-105'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700'
                }
              `}
            >
              <div className="relative">
                <div
                  className={`
                    w-9 h-9 rounded-full overflow-hidden border-2 bg-slate-700
                    ${isSpeaking ? 'border-emerald-300 ring-2 ring-emerald-400' : isVovo ? 'border-amber-400' : 'border-emerald-500'}
                  `}
                >
                  <img
                    src={user.photo || (isVovo ? '/vovo.jpg' : '/vovo.jpg')}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/vovo.jpg';
                    }}
                  />
                </div>
                {isSpeaking && (
                  <span className="absolute -bottom-1 -right-1 p-0.5 bg-emerald-500 rounded-full text-slate-950">
                    <Mic className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>

              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm text-white">
                    {user.name}
                  </span>
                  {isSpeaking && (
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </div>
                <div className="flex items-center gap-1 text-[11px]">
                  {isSpeaking ? (
                    <span className="text-emerald-400 font-black animate-pulse">
                      🎙️ Falando agora!
                    </span>
                  ) : (
                    <span className="text-slate-400 font-semibold">
                      {isVovo ? '👵 Vovó' : '📱 Neto(a)'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
