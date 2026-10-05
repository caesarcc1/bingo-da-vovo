import React, { useState } from 'react';
import { Settings, ShieldAlert, Maximize, Minimize, User } from 'lucide-react';
import { FamilyMembersList } from './FamilyMembersList';
import { VoiceChatBar } from './VoiceChatBar';

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
    <aside className="hidden md:flex flex-col justify-between w-56 lg:w-64 h-full max-h-[min(540px,calc(100dvh-120px))] p-2.5 bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-700/60 select-none z-10 flex-shrink-0 shadow-xl overflow-hidden">
      {/* 1. Lista Vertical de Familiares na Lateral Esquerda */}
      <div className="flex-1 w-full overflow-hidden flex flex-col min-h-0">
        <FamilyMembersList
          roomUsers={roomUsers}
          isConnected={isConnected}
          currentProfile={currentProfile}
          onOpenProfile={onOpenProfile}
          vertical={true}
        />
      </div>

      {/* 2. Microfone Viva-Voz da Vovó */}
      {voiceProps && (
        <div className="py-2 border-t border-slate-800/60 flex-shrink-0">
          <VoiceChatBar
            isVovo={true}
            isMuted={voiceProps.isMuted}
            onToggleMute={() => voiceProps.setIsMuted(!voiceProps.isMuted)}
            isPushToTalk={false}
            onTogglePushToTalk={() => {}}
            isTalking={voiceProps.isTalking}
            hasMicPermission={voiceProps.hasMicPermission}
            onInitMic={voiceProps.initMicrophone}
            onPushToTalkStart={() => {}}
            onPushToTalkEnd={() => {}}
            peerCount={voiceProps.peerCount}
          />
        </div>
      )}

      {/* 3. Rodapé da Coluna Esquerda: Botões Discretos de Ajustes do Tablet */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1.5 flex-shrink-0">
        <button
          onClick={onOpenProfile}
          type="button"
          className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all active:scale-95 shadow-sm"
          title="Meu Perfil e Foto"
        >
          <User className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[10px] font-bold mt-0.5">Perfil</span>
        </button>

        <button
          onClick={onOpenSettings}
          type="button"
          className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all active:scale-95 shadow-sm"
          title="Opções & Som"
        >
          <Settings className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[10px] font-bold mt-0.5">Opções</span>
        </button>

        <button
          onClick={onOpenFamilyGuide}
          type="button"
          className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all active:scale-95 shadow-sm"
          title="Dicas de Fixação de App"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] font-bold mt-0.5">Blindar</span>
        </button>

        <button
          onClick={toggleFullscreen}
          type="button"
          className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all active:scale-95 shadow-sm"
          title="Alternar Tela Cheia"
        >
          {isFullscreen ? (
            <Minimize className="w-3.5 h-3.5 text-blue-400" />
          ) : (
            <Maximize className="w-3.5 h-3.5 text-blue-400" />
          )}
          <span className="text-[10px] font-bold mt-0.5">Tela</span>
        </button>
      </div>
    </aside>
  );
}
