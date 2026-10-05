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

  // 3. Modo Vertical Ultra-Compacto (Barra lateral esguia para tablet)
  if (vertical) {
    return (
      <div className="w-full flex flex-col items-center gap-2.5 select-none py-1">
        {/* Título Compacto */}
        <div className="flex flex-col items-center justify-center pb-1 border-b border-amber-500/20 w-full text-center">
          <span className="text-[9px] font-black text-amber-300 uppercase tracking-wider">
            Família
          </span>
          <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded-full text-[9px] font-bold mt-0.5">
            {displayUsers.length}
          </span>
        </div>

        {/* Lista de Avatares Empilhados Verticalmente */}
        <div className="flex flex-col items-center gap-3 max-h-[50vh] overflow-y-auto w-full scrollbar-none py-1">
          {displayUsers.map((user) => {
            const isVovo = user.role === 'vovo';
            const isSpeaking = !!user.isSpeaking;
            const avatarSrc = getUserAvatar(user);
            const firstName = user.name ? user.name.split(' ')[0] : (isVovo ? 'Vovó' : 'Neto');

            return (
              <div
                key={user.id}
                onClick={onOpenProfile}
                className="flex flex-col items-center cursor-pointer transition-all active:scale-95 group relative"
                title={`${user.name} (${isVovo ? 'Vovó' : 'Neto'}) ${isSpeaking ? '- Falando no microfone' : ''}`}
              >
                {/* Foto Redonda do Familiar com Indicador de Voz */}
                <div className="relative">
                  <div
                    className={`
                      w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2.5 bg-slate-900 shadow-md transition-all
                      ${isSpeaking
                        ? 'border-emerald-400 ring-4 ring-emerald-400/80 shadow-[0_0_15px_rgba(52,211,153,0.8)] scale-110'
                        : isVovo ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-slate-500/70 group-hover:border-amber-400'
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
                    <span className="absolute -bottom-1 -right-1 p-0.5 bg-emerald-500 rounded-full text-slate-950 shadow-md animate-bounce">
                      <Mic className="w-3 h-3 text-slate-950" />
                    </span>
                  )}
                </div>

                {/* Primeiro Nome em Miniatura */}
                <span className={`text-[10px] font-black truncate max-w-[62px] text-center mt-1 leading-none ${isSpeaking ? 'text-emerald-300' : 'text-slate-200'}`}>
                  {firstName}
                </span>
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
