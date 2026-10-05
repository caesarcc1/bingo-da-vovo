import React, { useState } from 'react';
import { Settings, ShieldAlert, Maximize, Minimize, User, Mic, MicOff } from 'lucide-react';
import { FamilyMembersList } from './FamilyMembersList';

export function LeftCaregiverDock({
  onOpenSettings,
  onOpenFamilyGuide,
  onOpenProfile,
  roomUsers = [],
  isConnected = false,
  currentProfile,
  voiceProps
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <aside className="hidden md:flex flex-col justify-between items-center w-16 sm:w-18 lg:w-20 h-full max-h-full py-1 px-1 bg-slate-950/75 backdrop-blur-md rounded-2xl border border-amber-500/30 select-none z-10 flex-shrink-0 shadow-2xl overflow-hidden">
      {/* 1. Lista Vertical Ultra-Compacta de Familiares (Avatares Empilhados) */}
      <div className="flex-1 w-full overflow-hidden flex flex-col items-center min-h-0">
        <FamilyMembersList
          roomUsers={roomUsers}
          isConnected={isConnected}
          currentProfile={currentProfile}
          onOpenProfile={onOpenProfile}
          vertical={true}
        />
      </div>

      {/* 2. Microfone Viva-Voz Redondo da Vovó */}
      {voiceProps && (
        <div className="py-1 border-t border-amber-500/20 w-full flex flex-col items-center flex-shrink-0">
          {!voiceProps.hasMicPermission ? (
            <button
              onClick={voiceProps.initMicrophone}
              type="button"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex flex-col items-center justify-center shadow-lg active:scale-95 animate-pulse transition-all"
              title="Ativar Microfone para falar com a família"
            >
              <Mic className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              <span className="text-[7px] font-black leading-none mt-0.5">Voz</span>
            </button>
          ) : (
            <button
              onClick={() => voiceProps.setIsMuted(!voiceProps.isMuted)}
              type="button"
              className={`
                w-9 h-9 sm:w-10 sm:h-10 rounded-full flex flex-col items-center justify-center transition-all shadow-md active:scale-95 border-2
                ${!voiceProps.isMuted
                  ? 'bg-emerald-600/30 border-emerald-400 text-emerald-300 ring-2 ring-emerald-400/40 shadow-[0_0_10px_rgba(52,211,153,0.6)]'
                  : 'bg-rose-950/60 border-rose-500/80 text-rose-300'
                }
              `}
              title={voiceProps.isMuted ? 'Microfone Mutado (Clique para falar)' : 'Viva-Voz Aberto (Mãos Livres)'}
            >
              {!voiceProps.isMuted ? (
                <>
                  <Mic className={`w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-400 ${voiceProps.isTalking ? 'animate-bounce' : ''}`} />
                  <span className="text-[6.5px] font-black uppercase text-emerald-300 leading-none mt-0.5">
                    {voiceProps.isTalking ? 'Fala' : 'Aberto'}
                  </span>
                </>
              ) : (
                <>
                  <MicOff className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-rose-400" />
                  <span className="text-[6.5px] font-black uppercase text-rose-300 leading-none mt-0.5">Mudo</span>
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* 3. Rodapé Compacto (Grade 2x2 de Atalhos Discretos) */}
      <div className="pt-1 border-t border-amber-500/20 grid grid-cols-2 gap-1 w-full px-0.5 flex-shrink-0">
        <button
          onClick={onOpenProfile}
          type="button"
          className="h-7 w-full flex items-center justify-center rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-amber-400 hover:text-amber-300 transition-all active:scale-95 shadow-sm"
          title="Meu Perfil e Foto"
        >
          <User className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onOpenSettings}
          type="button"
          className="h-7 w-full flex items-center justify-center rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-all active:scale-95 shadow-sm"
          title="Opções & Som"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onOpenFamilyGuide}
          type="button"
          className="h-7 w-full flex items-center justify-center rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-emerald-400 hover:text-emerald-300 transition-all active:scale-95 shadow-sm"
          title="Dicas de Fixação de App"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={toggleFullscreen}
          type="button"
          className="h-7 w-full flex items-center justify-center rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-blue-400 hover:text-blue-300 transition-all active:scale-95 shadow-sm"
          title="Alternar Tela Cheia"
        >
          {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
        </button>
      </div>
    </aside>
  );
}
