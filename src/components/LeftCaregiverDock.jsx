import React, { useState } from 'react';
import { Settings, ShieldAlert, Maximize, Minimize } from 'lucide-react';

export function LeftCaregiverDock({
  onOpenSettings,
  onOpenFamilyGuide,
  onOpenProfile
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
    <aside className="hidden md:flex flex-col items-center justify-center gap-2 p-1.5 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/40 select-none z-10">
      {/* Botão Perfil da Família */}
      {onOpenProfile && (
        <button
          onClick={onOpenProfile}
          type="button"
          className="flex flex-col items-center justify-center w-13 h-12 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-600/60 text-slate-300 hover:text-white transition-all active:scale-95 p-1"
          title="Perfil e Foto"
        >
          <span className="text-base">👵</span>
          <span className="text-[9px] font-bold">Perfil</span>
        </button>
      )}

      {/* Botão Pequeno: Opções & Temas */}
      <button
        onClick={onOpenSettings}
        type="button"
        className="flex flex-col items-center justify-center w-13 h-12 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-600/60 text-slate-300 hover:text-white transition-all active:scale-95 p-1"
        title="Configurações e Temas"
      >
        <Settings className="w-4 h-4 text-amber-400" />
        <span className="text-[9px] font-bold mt-0.5">Opções</span>
      </button>

      {/* Botão Pequeno: Blindar Tablet */}
      <button
        onClick={onOpenFamilyGuide}
        type="button"
        className="flex flex-col items-center justify-center w-14 h-13 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-600/60 text-slate-300 hover:text-white transition-all active:scale-95 p-1"
        title="Dicas de Fixação de App"
      >
        <ShieldAlert className="w-4 h-4 text-emerald-400" />
        <span className="text-[10px] font-bold mt-0.5">Blindar</span>
      </button>

      {/* Botão Pequeno: Tela Cheia */}
      <button
        onClick={toggleFullscreen}
        type="button"
        className="flex flex-col items-center justify-center w-14 h-13 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-600/60 text-slate-300 hover:text-white transition-all active:scale-95 p-1"
        title="Alternar Tela Cheia"
      >
        {isFullscreen ? (
          <Minimize className="w-4 h-4 text-blue-400" />
        ) : (
          <Maximize className="w-4 h-4 text-blue-400" />
        )}
        <span className="text-[10px] font-bold mt-0.5">Tela</span>
      </button>
    </aside>
  );
}
