import React from 'react';
import { Mic, Users, Wifi, WifiOff } from 'lucide-react';
import { getUserAvatar } from '../hooks/useUserProfile';

export function FamilyMembersList({
  roomUsers = [],
  isConnected = false,
  currentProfile,
  onOpenProfile,
  compact = false,
  vertical = false
}) {
  // 1. Deduplicação estrita de usuários por ID e papel
  const userMap = new Map();

  // Adiciona usuário local primeiro
  if (currentProfile) {
    const localKey = currentProfile.role === 'vovo' ? 'vovo_principal' : currentProfile.id;
    userMap.set(localKey, {
      ...currentProfile,
      id: localKey,
      isSpeaking: false
    });
  }

  // Mescla usuários da sala Socket.io (substituindo ou adicionando)
  roomUsers.forEach(u => {
    const key = u.role === 'vovo' ? 'vovo_principal' : (u.id || u.socketId);
    // Preserva estado de fala se vier do socket
    userMap.set(key, { ...u, id: key });
  });

  const displayUsers = Array.from(userMap.values());

  // 2. Modo Compacto (Barra horizontal para celular)
  if (compact) {
    return (
      <div className="flex items-center gap-2 overflow-x-auto py-1 px-1 scrollbar-none">
        {displayUsers.map((user) => {
          const isVovo = user.role === 'vovo';
          const isSpeaking = !!user.isSpeaking;
          const avatarSrc = getUserAvatar(user);

          return (
            <div
              key={user.id}
              onClick={onOpenProfile}
              className={`
                flex items-center gap-2 px-2.5 py-1 rounded-full cursor-pointer transition-all border flex-shrink-0
                ${isSpeaking
                  ? 'bg-emerald-950/90 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.6)] ring-2 ring-emerald-400 animate-pulse'
                  : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
                }
              `}
              title={`${user.name} (${isVovo ? 'Vovó' : 'Neto'}) - ${isSpeaking ? 'Falando no microfone' : 'Conectado'}`}
            >
              <div className="relative">
                <div
                  className={`
                    w-7 h-7 rounded-full overflow-hidden border-2 bg-slate-700
                    ${isSpeaking ? 'border-emerald-300' : isVovo ? 'border-amber-400' : 'border-emerald-500'}
                  `}
                >
                  <img
                    src={avatarSrc}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = '/default-avatar.svg'; }}
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

  // 3. Modo Vertical (Lateral esquerda do Tablet da Vovó)
  if (vertical) {
    return (
      <div className="w-full flex flex-col gap-2 select-none">
        <div className="flex items-center justify-between pb-1 border-b border-slate-700/60 px-1">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-300">
            <Users className="w-4 h-4 text-amber-400" />
            <span>Família na Mesa</span>
          </div>
          <span className="bg-slate-800 text-amber-300 px-2 py-0.5 rounded-full text-[10px] font-black border border-slate-700">
            {displayUsers.length}
          </span>
        </div>

        <div className="flex flex-col gap-2 max-h-[46vh] overflow-y-auto pr-0.5 scrollbar-thin">
          {displayUsers.map((user) => {
            const isVovo = user.role === 'vovo';
            const isSpeaking = !!user.isSpeaking;
            const avatarSrc = getUserAvatar(user);

            return (
              <div
                key={user.id}
                onClick={onOpenProfile}
                className={`
                  flex items-center gap-2.5 p-2 rounded-2xl cursor-pointer transition-all border text-left
                  ${isSpeaking
                    ? 'bg-emerald-950/90 border-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.6)] ring-3 ring-emerald-400/80 scale-[1.02]'
                    : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700/80'
                  }
                `}
                title={`${user.name} - Clique para ver perfil`}
              >
                {/* Foto Grande do Familiar */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`
                      w-11 h-11 rounded-full overflow-hidden border-2.5 bg-slate-900 shadow-md
                      ${isSpeaking
                        ? 'border-emerald-300 ring-2 ring-emerald-400'
                        : isVovo ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-emerald-500'
                      }
                    `}
                  >
                    <img
                      src={avatarSrc}
                      alt={user.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.src = '/default-avatar.svg'; }}
                    />
                  </div>
                  {isSpeaking && (
                    <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full text-slate-950 shadow">
                      <Mic className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>

                {/* Nome e Indicador de Voz */}
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-black text-sm text-white truncate leading-tight">
                      {user.name}
                    </span>
                    {isSpeaking && (
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] mt-0.5">
                    {isSpeaking ? (
                      <span className="text-emerald-300 font-extrabold flex items-center gap-1">
                        🎙️ Falando agora!
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium">
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

  // 4. Modo Padrão
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
              Online
            </span>
          ) : (
            <span className="flex items-center gap-1 text-slate-400 font-semibold">
              <WifiOff className="w-3.5 h-3.5" />
              Local
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {displayUsers.map((user) => {
          const isVovo = user.role === 'vovo';
          const isSpeaking = !!user.isSpeaking;
          const avatarSrc = getUserAvatar(user);

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
                    src={avatarSrc}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = '/default-avatar.svg'; }}
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
