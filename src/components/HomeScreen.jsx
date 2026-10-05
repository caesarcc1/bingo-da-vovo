import React from 'react';
import { Play, Settings, ShieldCheck, Heart, Sparkles, User, Users, Smartphone, Tablet } from 'lucide-react';
import { VirtualPlayerAvatar } from './VirtualPlayerAvatar';
import { FamilyMembersList } from './FamilyMembersList';
import { getUserAvatar } from '../hooks/useUserProfile';

export function HomeScreen({
  vovoName,
  onStartGame,
  onOpenSettings,
  onOpenFamilyGuide,
  profile,
  onOpenProfile,
  roomUsers = [],
  isConnected = false
}) {
  const isVovo = profile?.role === 'vovo';

  return (
    <div
      className="h-[100dvh] w-screen flex flex-col items-center justify-between p-3 sm:p-6 select-none text-center relative overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 50% 20%, #1e40af 0%, #1e3a8a 35%, #0f172a 75%, #020617 100%)'
      }}
    >
      {/* Luz ambiente de fundo */}
      <div className="absolute top-1/4 w-[500px] h-[500px] bg-amber-500/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Topo: Logo & Título & Botão de Perfil */}
      <header className="relative z-10 pt-1 sm:pt-3 flex flex-col items-center w-full max-w-xl">
        <div className="w-full flex items-center justify-between px-2 mb-2">
          {/* Botão de Perfil da Família */}
          <button
            onClick={onOpenProfile}
            type="button"
            className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-white transition-all shadow-md active:scale-95"
            title="Escolher quem está jogando e mudar foto"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-amber-400 bg-slate-700">
              <img
                src={getUserAvatar(profile)}
                alt={profile?.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = getUserAvatar(profile); }}
              />
            </div>
            <div className="text-left">
              <div className="text-xs font-black text-white leading-tight flex items-center gap-1">
                <span>{profile?.name || 'Vovó'}</span>
                {isVovo ? <Tablet className="w-3 h-3 text-amber-400" /> : <Smartphone className="w-3 h-3 text-emerald-400" />}
              </div>
              <div className="text-[10px] text-amber-300 font-bold leading-tight">
                {isVovo ? 'Modo Vovó' : 'Modo Neto'} (Mudar)
              </div>
            </div>
          </button>

          {/* Badge Carinhoso */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-extrabold text-xs tracking-wider uppercase shadow-sm">
            <Heart className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
            <span>Feito com todo amor</span>
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 drop-shadow-lg tracking-tight">
          {vovoName}
        </h1>

        <p className="text-slate-300 font-bold text-xs sm:text-base mt-1 max-w-lg">
          Linhas, colunas, diagonais e quatro pontas valem BINGO no pódio!
        </p>

        {/* Notificação de Familiares Conectados */}
        {roomUsers.length > 0 && (
          <div className="mt-2 w-full max-w-md">
            <FamilyMembersList
              roomUsers={roomUsers}
              isConnected={isConnected}
              currentProfile={profile}
              onOpenProfile={onOpenProfile}
              compact={true}
            />
          </div>
        )}
      </header>

      {/* Centro: Foto em Destaque + Botão Gigante de JOGAR */}
      <main className="relative z-10 my-auto flex flex-col items-center max-w-md w-full">
        {/* Foto Carinhosa do Jogador */}
        <div className="relative mb-4 flex items-center justify-center">
          <div className="relative group cursor-pointer" onClick={onOpenProfile}>
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-amber-400 shadow-2xl ring-6 ring-amber-300/40 bg-slate-800">
              <img
                src={getUserAvatar(profile)}
                alt={profile?.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = getUserAvatar(profile); }}
              />
            </div>
            {/* Estrelas Brilhantes */}
            <Sparkles className="w-7 h-7 text-yellow-300 absolute -top-2 -right-2 animate-spin" style={{ animationDuration: '6s' }} />
            <div className="absolute -bottom-2 inset-x-0 mx-auto w-fit bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-[11px] px-3.5 py-0.5 rounded-full shadow uppercase tracking-wider">
              {isVovo ? 'Nossa Campeã' : 'Neto na Torcida'}
            </div>
          </div>
        </div>

        {/* Botão Gigante Pulsante: JOGAR BINGO */}
        <button
          onClick={onStartGame}
          type="button"
          className="w-full flex items-center justify-center gap-3 sm:gap-4 py-4 sm:py-5 px-6 sm:px-8 rounded-3xl font-black text-2xl sm:text-3xl md:text-4xl text-white shadow-2xl transition-all transform active:scale-95 border-b-8 border-emerald-800 hover:brightness-105"
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
            boxShadow: '0 16px 32px rgba(16, 185, 129, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.4)'
          }}
        >
          <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current" />
          <span>JOGAR BINGO!</span>
        </button>

        {/* Dica para Netos no Trabalho */}
        {!isVovo && (
          <div className="mt-3 text-xs text-emerald-400 font-bold bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-500/30">
            ⚡ Modo Multitarefa: Janela Flutuante & Auto-Marcar prontos
          </div>
        )}
      </main>

      {/* Rodapé: Acesso a Opções & Dicas */}
      <footer className="relative z-10 w-full max-w-lg flex items-center justify-center gap-3 sm:gap-4 pb-2">
        <button
          onClick={onOpenSettings}
          type="button"
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-extrabold text-xs sm:text-sm shadow backdrop-blur-sm transition-all"
        >
          <Settings className="w-4 h-4 text-amber-400" />
          <span>Opções & Som</span>
        </button>

        <button
          onClick={onOpenFamilyGuide}
          type="button"
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-extrabold text-xs sm:text-sm shadow backdrop-blur-sm transition-all"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Blindar Tablet</span>
        </button>
      </footer>
    </div>
  );
}
