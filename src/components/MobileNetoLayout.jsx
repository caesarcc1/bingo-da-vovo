import React from 'react';
import { ArrowLeft, Zap, Trophy, Volume2, VolumeX, LogOut, Radio, Heart } from 'lucide-react';
import { BingoCard } from './BingoCard';
import { FloatingPipWindow } from './FloatingPipWindow';
import { FamilyMembersList } from './FamilyMembersList';
import { VoiceChatBar } from './VoiceChatBar';
import { BINGO_COLORS, getBingoLetter } from '../utils/numberWords';

export function MobileNetoLayout({
  // Estado do Jogo
  card,
  currentBall,
  drawnBalls,
  markedCellIds,
  onCellClick,
  winState,
  isBingoReady,
  onClaimBingo,
  onRequestExit,

  // Automações de Produtividade (Trabalho)
  autoMark,
  onToggleAutoMark,
  autoBingo,
  onToggleAutoBingo,

  // Perfil e Família
  profile,
  onOpenProfile,
  roomUsers,
  isConnected,

  // Voz (Discord style)
  voiceProps,

  // Som do Jogo
  musicPlaying,
  onToggleMusic
}) {
  const currentLetter = currentBall ? getBingoLetter(currentBall) : null;
  const ballStyle = currentLetter && BINGO_COLORS[currentLetter] ? BINGO_COLORS[currentLetter] : null;

  return (
    <div className="h-[100dvh] w-screen flex flex-col justify-between overflow-hidden bg-slate-950 text-white select-none">
      {/* 1. Header Compacto Mobile */}
      <header className="px-3 pt-2 pb-1.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-2 flex-shrink-0">
        <button
          onClick={onRequestExit}
          type="button"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Sair</span>
        </button>

        {/* Bola Atual em Destaque no Topo */}
        <div className="flex items-center gap-2">
          {currentBall ? (
            <div
              className={`
                flex items-center gap-1.5 px-3 py-1 rounded-2xl shadow-lg border-2 border-white/40 animate-pop-in
                ${ballStyle?.bg || 'bg-amber-500'}
              `}
            >
              <span className="text-xs font-black text-white/90">
                {currentLetter}
              </span>
              <span className="text-xl font-black text-white leading-none">
                {currentBall}
              </span>
            </div>
          ) : (
            <div className="text-xs font-bold text-slate-400 bg-slate-800 px-3 py-1.5 rounded-xl">
              Aguardando sorteio...
            </div>
          )}

          {/* Janela Flutuante PiP para celular/outros apps */}
          <FloatingPipWindow
            currentBall={currentBall}
            card={card}
            markedCellIds={markedCellIds}
            roomUsers={roomUsers}
            isAutoMark={autoMark}
          />
        </div>

        {/* Avatar e Perfil */}
        <button
          onClick={onOpenProfile}
          type="button"
          className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-2xl bg-slate-800 border border-slate-700 hover:border-amber-400 transition-all active:scale-95"
          title="Configurar Perfil e Foto"
        >
          <div className="w-6 h-6 rounded-full overflow-hidden border border-emerald-400 bg-slate-700">
            <img
              src={profile?.photo || '/vovo.jpg'}
              alt={profile?.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.src = '/vovo.jpg'; }}
            />
          </div>
          <span className="text-xs font-black text-emerald-400 max-w-[65px] truncate">
            {profile?.name || 'Neto'}
          </span>
        </button>
      </header>

      {/* 2. Barra de Familiares Online com Indicador de Voz (Estilo Discord) */}
      <div className="px-2 py-1 bg-slate-900/60 border-b border-slate-800/80 flex-shrink-0">
        <FamilyMembersList
          roomUsers={roomUsers}
          isConnected={isConnected}
          currentProfile={profile}
          onOpenProfile={onOpenProfile}
          compact={true}
        />
      </div>

      {/* 3. Barra de Ferramentas de Produtividade (Trabalho / Multitarefa) */}
      <div className="px-3 py-1.5 flex items-center justify-between gap-2 flex-shrink-0 bg-slate-900/40">
        <div className="flex items-center gap-2">
          {/* Toggle Auto-Marcar */}
          <button
            onClick={onToggleAutoMark}
            type="button"
            className={`
              flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black transition-all border shadow-sm active:scale-95
              ${autoMark
                ? 'bg-amber-500/20 text-amber-300 border-amber-400 ring-2 ring-amber-400/30'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:border-slate-600'
              }
            `}
          >
            <Zap className={`w-3.5 h-3.5 ${autoMark ? 'text-amber-400 fill-amber-400 animate-pulse' : 'text-slate-500'}`} />
            <span>⚡ Auto-Marcar {autoMark ? 'ON' : 'OFF'}</span>
          </button>

          {/* Toggle Auto-Bingo */}
          <button
            onClick={onToggleAutoBingo}
            type="button"
            className={`
              flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black transition-all border shadow-sm active:scale-95
              ${autoBingo
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 ring-2 ring-emerald-400/30'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:border-slate-600'
              }
            `}
          >
            <Trophy className={`w-3.5 h-3.5 ${autoBingo ? 'text-emerald-400 fill-emerald-400 animate-bounce' : 'text-slate-500'}`} />
            <span>🏆 Auto-Bingo {autoBingo ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Som do Jogo */}
        <button
          onClick={onToggleMusic}
          type="button"
          className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 active:scale-95"
          title={musicPlaying ? 'Mutar Música' : 'Tocar Música'}
        >
          {musicPlaying ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
        </button>
      </div>

      {/* 4. Cartela Completa Otimizada para Celular */}
      <main className="flex-1 w-full max-w-sm sm:max-w-md mx-auto px-2 py-1 flex items-center justify-center min-h-0 overflow-hidden">
        <BingoCard
          card={card}
          markedCellIds={markedCellIds}
          currentBall={currentBall}
          onCellClick={onCellClick}
          winState={winState}
          vovoName="Cartela do Neto"
        />
      </main>

      {/* 5. Dock Inferior: Botão de Voz Discord + Botão BINGO */}
      <footer className="px-3 py-2 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-2 flex-shrink-0">
        {/* Controle de Voz */}
        <div className="flex-1">
          <VoiceChatBar
            isVovo={false}
            isMuted={voiceProps.isMuted}
            onToggleMute={() => voiceProps.setIsMuted(!voiceProps.isMuted)}
            isPushToTalk={voiceProps.isPushToTalk}
            onTogglePushToTalk={() => voiceProps.setIsPushToTalk(!voiceProps.isPushToTalk)}
            isTalking={voiceProps.isTalking}
            hasMicPermission={voiceProps.hasMicPermission}
            onInitMic={voiceProps.initMicrophone}
            onPushToTalkStart={voiceProps.handlePushToTalkStart}
            onPushToTalkEnd={voiceProps.handlePushToTalkEnd}
          />
        </div>

        {/* Botão de BINGO Grande */}
        <button
          onClick={onClaimBingo}
          disabled={!isBingoReady}
          type="button"
          className={`
            px-5 py-2.5 rounded-2xl font-black text-sm sm:text-base transition-all transform shadow-xl border-b-4
            ${isBingoReady
              ? 'bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-500 text-slate-950 border-amber-700 animate-bounce cursor-pointer active:scale-95'
              : 'bg-slate-800 text-slate-500 border-slate-700 opacity-60 cursor-not-allowed'
            }
          `}
        >
          {isBingoReady ? '🎉 BINGO!' : 'BINGO'}
        </button>
      </footer>
    </div>
  );
}
