import React, { useState, useEffect } from 'react';
import { useBingoGame } from './hooks/useBingoGame';
import { useVoiceAnnouncer } from './hooks/useVoiceAnnouncer';
import { useWakeLock } from './hooks/useWakeLock';
import { musicSynthesizer } from './utils/musicSynthesizer';
import { soundFX } from './utils/soundEffects';

import { BingoCard } from './components/BingoCard';
import { BallDisplay } from './components/BallDisplay';
import { GameControls } from './components/GameControls';
import { VictoryModal } from './components/VictoryModal';
import { FamilyGuideModal } from './components/FamilyGuideModal';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  // Nome personalizável da Vovó salvo no localStorage
  const [vovoName, setVovoName] = useState(() => {
    return localStorage.getItem('vovo_bingo_name') || 'Bingo da Vovó';
  });

  useEffect(() => {
    localStorage.setItem('vovo_bingo_name', vovoName);
  }, [vovoName]);

  // Modais
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFamilyGuideOpen, setIsFamilyGuideOpen] = useState(false);

  // Música e Som
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicTheme, setMusicTheme] = useState('calmo');
  const [musicVolume, setMusicVolume] = useState(0.25);

  // Mantém tela do tablet sempre acesa
  const { isLocked: isScreenLocked } = useWakeLock();

  // Locução por voz
  const {
    isSpeaking,
    voiceMuted,
    setVoiceMuted,
    speakNumber,
    repeatCurrentBall,
    cancelSpeech
  } = useVoiceAnnouncer();

  // Jogo do Bingo
  const {
    card,
    deck,
    drawnBalls,
    currentBall,
    markedCellIds,
    isPlaying,
    setIsPlaying,
    autoSpeed,
    setAutoSpeed,
    autoMark,
    setAutoMark,
    winState,
    showBingoCelebration,
    setShowBingoCelebration,
    drawNextBall,
    toggleCell,
    resetGame
  } = useBingoGame({
    onBallDrawn: (num) => {
      speakNumber(num);
    },
    onWin: () => {
      cancelSpeech();
    }
  });

  // Prevenir fechamento acidental via botão voltar do Android (History Trap)
  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
      // Evita sair da página caso ela toque em voltar no Android
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Prevenir recarregar ou fechar a aba acidentalmente
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (drawnBalls.length > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [drawnBalls.length]);

  // Primeiro clique na tela inicializa os canais de áudio
  const handleFirstInteraction = () => {
    soundFX.init();
    musicSynthesizer.init();
  };

  return (
    <div
      onClick={handleFirstInteraction}
      onTouchStart={handleFirstInteraction}
      className="h-[100dvh] w-screen bg-slate-900 text-slate-800 flex flex-col justify-between overflow-hidden select-none p-2 sm:p-4"
      style={{
        background: 'radial-gradient(ellipse at top, #1e293b 0%, #0f172a 100%)'
      }}
    >
      {/* Área Principal de Jogo: Adaptada para Tablet na Horizontal ou Vertical */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-3 sm:gap-4 overflow-hidden min-h-0">
        {/* Coluna da Cartela Única da Vovó (Ocupa o maior espaço e foco) */}
        <div className="flex-1 w-full h-full flex items-center justify-center min-h-0">
          <BingoCard
            card={card}
            markedCellIds={markedCellIds}
            currentBall={currentBall}
            onCellClick={toggleCell}
            winState={winState}
            vovoName={vovoName}
          />
        </div>

        {/* Coluna Lateral: Bola Gigante do Globo + Controles Grandes */}
        <div className="w-full lg:w-96 flex flex-row lg:flex-col items-stretch justify-between gap-3 h-full max-h-[360px] lg:max-h-none min-h-0">
          <div className="flex-1 min-h-0">
            <BallDisplay
              currentBall={currentBall}
              drawnBalls={drawnBalls}
              onRepeatVoice={repeatCurrentBall}
              isSpeaking={isSpeaking}
            />
          </div>

          <div className="w-48 sm:w-64 lg:w-full flex-shrink-0">
            <GameControls
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              onDrawNext={drawNextBall}
              onResetGame={() => {
                cancelSpeech();
                resetGame();
              }}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenFamilyGuide={() => setIsFamilyGuideOpen(true)}
              deckRemaining={deck.length}
            />
          </div>
        </div>
      </main>

      {/* Modais */}
      <VictoryModal
        isOpen={showBingoCelebration}
        onClose={() => setShowBingoCelebration(false)}
        onNewGame={() => {
          cancelSpeech();
          resetGame();
        }}
        vovoName={vovoName}
      />

      <FamilyGuideModal
        isOpen={isFamilyGuideOpen}
        onClose={() => setIsFamilyGuideOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        vovoName={vovoName}
        setVovoName={setVovoName}
        autoSpeed={autoSpeed}
        setAutoSpeed={setAutoSpeed}
        autoMark={autoMark}
        setAutoMark={setAutoMark}
        voiceMuted={voiceMuted}
        setVoiceMuted={setVoiceMuted}
        musicTheme={musicTheme}
        setMusicTheme={setMusicTheme}
        musicPlaying={musicPlaying}
        setMusicPlaying={setMusicPlaying}
        musicVolume={musicVolume}
        setMusicVolume={setMusicVolume}
      />
    </div>
  );
}
