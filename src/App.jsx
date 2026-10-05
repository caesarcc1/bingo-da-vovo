import React, { useState, useEffect } from 'react';
import { useBingoGame } from './hooks/useBingoGame';
import { useVoiceAnnouncer } from './hooks/useVoiceAnnouncer';
import { useWakeLock } from './hooks/useWakeLock';
import { musicSynthesizer } from './utils/musicSynthesizer';
import { soundFX } from './utils/soundEffects';

import { SplashScreen } from './components/SplashScreen';
import { HomeScreen } from './components/HomeScreen';
import { CountdownOverlay } from './components/CountdownOverlay';
import { TopBallConveyor } from './components/TopBallConveyor';
import { BingoCard } from './components/BingoCard';
import { SideControls } from './components/SideControls';
import { VictoryModal } from './components/VictoryModal';
import { FamilyGuideModal } from './components/FamilyGuideModal';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  // Telas da aplicação: 'splash' | 'home' | 'game'
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [isPreparing, setIsPreparing] = useState(false);

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
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Música e Som (Ligada por padrão para tocar ao iniciar)
  const [musicPlaying, setMusicPlaying] = useState(() => {
    const saved = localStorage.getItem('vovo_music_enabled');
    return saved !== null ? saved === 'true' : true;
  });
  const [musicTheme, setMusicTheme] = useState('calmo');
  const [musicVolume, setMusicVolume] = useState(0.45);

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
    timerProgress,
    winState,
    isBingoReadyToClaim,
    claimBingo,
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
      if (currentScreen === 'game') {
        setShowExitConfirm(true);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentScreen]);

  // Prevenir recarregar ou fechar a aba acidentalmente durante uma partida
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (currentScreen === 'game' && drawnBalls.length > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentScreen, drawnBalls.length]);

  // Primeiro clique na tela inicializa os canais de áudio
  const handleFirstInteraction = () => {
    soundFX.init();
    musicSynthesizer.init();
  };

  // Alternar Música de fundo
  const handleToggleMusic = () => {
    handleFirstInteraction();
    if (musicPlaying) {
      musicSynthesizer.stop();
      setMusicPlaying(false);
      localStorage.setItem('vovo_music_enabled', 'false');
    } else {
      musicSynthesizer.start();
      setMusicPlaying(true);
      localStorage.setItem('vovo_music_enabled', 'true');
    }
  };

  // Iniciar partida a partir da Tela Inicial
  const handleStartGameFromHome = () => {
    handleFirstInteraction();
    resetGame();
    setCurrentScreen('game');
    setIsPreparing(true);

    // Inicia a música de fundo automaticamente no gesto de clique
    if (musicPlaying) {
      musicSynthesizer.start();
    }
  };

  // Final da contagem 3-2-1 de preparação
  const handleCountdownComplete = () => {
    setIsPreparing(false);
    drawNextBall(); // sorteia a primeira bola imediatamente
    setIsPlaying(true); // inicia o ciclo automático

    if (musicPlaying) {
      musicSynthesizer.start();
    }
  };

  // Solicitar retorno ao menu inicial com proteção
  const handleRequestBackToHome = () => {
    if (drawnBalls.length === 0) {
      setCurrentScreen('home');
    } else {
      setShowExitConfirm(true);
    }
  };

  const handleConfirmExit = () => {
    cancelSpeech();
    setIsPlaying(false);
    setShowExitConfirm(false);
    setCurrentScreen('home');
  };

  return (
    <div
      onClick={handleFirstInteraction}
      onTouchStart={handleFirstInteraction}
      className="h-[100dvh] w-screen bg-slate-900 text-slate-800 flex flex-col justify-between overflow-hidden select-none"
      style={{
        background: 'radial-gradient(ellipse at top, #1e293b 0%, #0f172a 100%)'
      }}
    >
      {/* 1. Tela de Abertura (Splash Screen) */}
      {currentScreen === 'splash' && (
        <SplashScreen onFinish={() => setCurrentScreen('home')} />
      )}

      {/* 2. Tela Inicial / Lobby da Vovó */}
      {currentScreen === 'home' && (
        <HomeScreen
          vovoName={vovoName}
          onStartGame={handleStartGameFromHome}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenFamilyGuide={() => setIsFamilyGuideOpen(true)}
        />
      )}

      {/* 3. Tela da Partida (Estilo Play Store com Controles na Lateral) */}
      {currentScreen === 'game' && (
        <div className="h-full w-full flex flex-col justify-between overflow-hidden relative">
          {/* Overlay de Preparação e Contagem (3, 2, 1) */}
          {isPreparing && (
            <CountdownOverlay
              onComplete={handleCountdownComplete}
              vovoName={vovoName}
            />
          )}

          {/* Topo: Esteira de Bolas Rolando (Play Store Ball Hopper) */}
          <TopBallConveyor
            currentBall={currentBall}
            drawnBalls={drawnBalls}
            onRepeatVoice={repeatCurrentBall}
            isSpeaking={isSpeaking}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            onBackToHome={handleRequestBackToHome}
            progressPercent={timerProgress}
          />

          {/* Área Central: Cartela Completa 5x5 + Coluna da Lateral Direita */}
          <main className="flex-1 w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-3 sm:gap-6 p-2 sm:p-4 min-h-0 overflow-hidden">
            {/* Cartela no Centro (100% Visível sem Cortes) */}
            <div className="flex-1 h-full flex items-center justify-center min-h-0 w-full">
              <BingoCard
                card={card}
                markedCellIds={markedCellIds}
                currentBall={currentBall}
                onCellClick={toggleCell}
                winState={winState}
                vovoName={vovoName}
              />
            </div>

            {/* Controles na Lateral Direita: BINGO, Nova Cartela, Música e Configurações */}
            <SideControls
              isBingoReady={isBingoReadyToClaim}
              onClaimBingo={claimBingo}
              markedCount={markedCellIds.size + 1}
              onResetGame={() => {
                cancelSpeech();
                resetGame();
                setIsPreparing(true);
              }}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenFamilyGuide={() => setIsFamilyGuideOpen(true)}
              musicPlaying={musicPlaying}
              onToggleMusic={handleToggleMusic}
            />
          </main>
        </div>
      )}

      {/* Modal de Confirmação para Voltar ao Menu */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-pop-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border-4 border-amber-400">
            <h3 className="text-2xl font-black text-slate-900 mb-2">
              Voltar ao Início?
            </h3>
            <p className="text-slate-600 font-medium mb-6">
              Sua partida atual será encerrada. Deseja mesmo voltar para a tela inicial?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                type="button"
                className="py-3 px-4 rounded-2xl font-black text-slate-800 bg-slate-200 hover:bg-slate-300 active:scale-95"
              >
                Continuar Jogando
              </button>
              <button
                onClick={handleConfirmExit}
                type="button"
                className="py-3 px-4 rounded-2xl font-black text-white bg-rose-600 hover:bg-rose-700 active:scale-95 shadow-md"
              >
                Sim, Voltar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modais Globais */}
      <VictoryModal
        isOpen={showBingoCelebration}
        onClose={() => setShowBingoCelebration(false)}
        onNewGame={() => {
          cancelSpeech();
          resetGame();
          setIsPreparing(true);
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
