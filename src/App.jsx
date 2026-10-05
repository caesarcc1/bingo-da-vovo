import React, { useState, useEffect, useRef } from 'react';
import { useBingoGame } from './hooks/useBingoGame';
import { useVoiceAnnouncer } from './hooks/useVoiceAnnouncer';
import { useWakeLock } from './hooks/useWakeLock';
import { musicSynthesizer } from './utils/musicSynthesizer';
import { soundFX } from './utils/soundEffects';

import { SplashScreen } from './components/SplashScreen';
import { HomeScreen } from './components/HomeScreen';
import { CountdownOverlay } from './components/CountdownOverlay';
import { TopBallConveyor } from './components/TopBallConveyor';
import { LeftCaregiverDock } from './components/LeftCaregiverDock';
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

  // Modais e Referência para o Botão Voltar do Android
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFamilyGuideOpen, setIsFamilyGuideOpen] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showBingoCelebration, setShowBingoCelebration] = useState(false);
  const activeModalRef = useRef(null);

  // Música e Som (Ligada por padrão)
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
    drawNextBall,
    toggleCell,
    resetGame
  } = useBingoGame({
    onBallDrawn: (num) => {
      speakNumber(num);
    },
    onWin: () => {
      cancelSpeech();
      activeModalRef.current = 'victory';
      setShowBingoCelebration(true);
    }
  });

  // Funções para gerenciar abertura e fechamento de modais com histórico do Android
  const openModal = (modalName, setOpenFn) => {
    activeModalRef.current = modalName;
    window.history.pushState({ modal: modalName }, '', window.location.href);
    setOpenFn(true);
  };

  const closeModal = (modalName, setOpenFn) => {
    if (activeModalRef.current === modalName) {
      activeModalRef.current = null;
    }
    setOpenFn(false);
  };

  // Botão Voltar do Tablet (Popstate): Fecha apenas a janela aberta sem sair do jogo
  useEffect(() => {
    window.history.pushState(null, '', window.location.href);

    const handlePopState = (e) => {
      const modal = activeModalRef.current;

      if (modal === 'settings') {
        setIsSettingsOpen(false);
        activeModalRef.current = null;
        window.history.pushState(null, '', window.location.href);
        return;
      }

      if (modal === 'guide') {
        setIsFamilyGuideOpen(false);
        activeModalRef.current = null;
        window.history.pushState(null, '', window.location.href);
        return;
      }

      if (modal === 'exit') {
        // Se já estava com o modal de saída aberto e apertou voltar no tablet, cancela a saída
        setShowExitConfirm(false);
        setIsPlaying(true);
        activeModalRef.current = null;
        window.history.pushState(null, '', window.location.href);
        return;
      }

      if (modal === 'victory') {
        setShowBingoCelebration(false);
        activeModalRef.current = null;
        window.history.pushState(null, '', window.location.href);
        return;
      }

      // Se nenhum modal estiver aberto e estiver no jogo, pausa e pergunta se deseja sair
      if (currentScreen === 'game') {
        window.history.pushState(null, '', window.location.href);
        setIsPlaying(false);
        activeModalRef.current = 'exit';
        setShowExitConfirm(true);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentScreen]);

  // Prevenir recarregar a aba acidentalmente durante uma partida
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

    if (musicPlaying) {
      musicSynthesizer.start();
    }
  };

  // Final da contagem 3-2-1 de preparação
  const handleCountdownComplete = () => {
    setIsPreparing(false);
    drawNextBall();
    setIsPlaying(true);

    if (musicPlaying) {
      musicSynthesizer.start();
    }
  };

  // Solicitar saída (pausa o jogo automaticamente e abre o modal de confirmação)
  const handleRequestExit = () => {
    setIsPlaying(false); // Pausa o jogo imediatamente
    openModal('exit', setShowExitConfirm);
  };

  // Confirmar saída para a tela inicial
  const handleConfirmExit = () => {
    cancelSpeech();
    setIsPlaying(false);
    closeModal('exit', setShowExitConfirm);
    setCurrentScreen('home');
  };

  // Cancelar saída e retornar ao jogo
  const handleCancelExit = () => {
    closeModal('exit', setShowExitConfirm);
    setIsPlaying(true); // Retoma o jogo automaticamente
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
          onOpenSettings={() => openModal('settings', setIsSettingsOpen)}
          onOpenFamilyGuide={() => openModal('guide', setIsFamilyGuideOpen)}
        />
      )}

      {/* 3. Tela da Partida (Estilo Play Store com Controles nas Laterais) */}
      {currentScreen === 'game' && (
        <div className="h-full w-full flex flex-col justify-between overflow-hidden relative">
          {/* Overlay de Preparação e Contagem (3, 2, 1) */}
          {isPreparing && (
            <CountdownOverlay
              onComplete={handleCountdownComplete}
              vovoName={vovoName}
            />
          )}

          {/* Topo: Esteira de Bolas com Botão VOLTAR 50% Maior */}
          <TopBallConveyor
            currentBall={currentBall}
            drawnBalls={drawnBalls}
            onRepeatVoice={repeatCurrentBall}
            isSpeaking={isSpeaking}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            onBackToHome={handleRequestExit}
            progressPercent={timerProgress}
          />

          {/* Área Central: Dock Esquerdo + Cartela Completa + Coluna Direita */}
          <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-2 sm:gap-4 p-2 sm:p-3 min-h-0 overflow-hidden">
            {/* 1. Lateral Esquerda: Botões pequenos discretos para cuidadores */}
            <LeftCaregiverDock
              onOpenSettings={() => openModal('settings', setIsSettingsOpen)}
              onOpenFamilyGuide={() => openModal('guide', setIsFamilyGuideOpen)}
            />

            {/* 2. Centro: Cartela 100% Visível sem Cortes */}
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

            {/* 3. Lateral Direita: BINGO, Nova Cartela, Música e Botão Grande SAIR */}
            <SideControls
              isBingoReady={isBingoReadyToClaim}
              onClaimBingo={claimBingo}
              markedCount={markedCellIds.size + 1}
              onResetGame={() => {
                cancelSpeech();
                resetGame();
                setIsPreparing(true);
              }}
              onRequestExit={handleRequestExit}
              musicPlaying={musicPlaying}
              onToggleMusic={handleToggleMusic}
              onOpenSettings={() => openModal('settings', setIsSettingsOpen)}
              onOpenFamilyGuide={() => openModal('guide', setIsFamilyGuideOpen)}
            />
          </main>
        </div>
      )}

      {/* Modal de Confirmação para Sair do Jogo */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-pop-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 text-center shadow-2xl border-4 border-amber-400">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
              Deseja mesmo sair?
            </h3>
            <p className="text-slate-600 font-bold text-base mb-6">
              O jogo foi pausado para você não perder nada.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Botão Não (voltar ao jogo) */}
              <button
                onClick={handleCancelExit}
                type="button"
                className="flex-1 py-4 px-4 rounded-2xl font-black text-base sm:text-lg text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border-3 border-emerald-500 active:scale-95 transition-all shadow-sm"
              >
                Não (voltar ao jogo)
              </button>

              {/* Botão Sim */}
              <button
                onClick={handleConfirmExit}
                type="button"
                className="py-4 px-6 rounded-2xl font-black text-base sm:text-lg text-white bg-rose-600 hover:bg-rose-700 active:scale-95 shadow-md transition-all"
              >
                Sim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modais Globais */}
      <VictoryModal
        isOpen={showBingoCelebration}
        onClose={() => closeModal('victory', setShowBingoCelebration)}
        onNewGame={() => {
          cancelSpeech();
          resetGame();
          setIsPreparing(true);
        }}
        vovoName={vovoName}
      />

      <FamilyGuideModal
        isOpen={isFamilyGuideOpen}
        onClose={() => closeModal('guide', setIsFamilyGuideOpen)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => closeModal('settings', setIsSettingsOpen)}
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
