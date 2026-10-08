import React, { useState, useEffect, useRef } from 'react';
import { useBingoGame } from './hooks/useBingoGame';
import { useVoiceAnnouncer } from './hooks/useVoiceAnnouncer';
import { useWakeLock } from './hooks/useWakeLock';
import { useUserProfile, getUserAvatar } from './hooks/useUserProfile';
import { useFamilySocket } from './hooks/useFamilySocket';
import { useWebRTCVoice } from './hooks/useWebRTCVoice';
import { useBackgroundKeepalive } from './hooks/useBackgroundKeepalive';
import { musicSynthesizer } from './utils/musicSynthesizer';
import { soundFX } from './utils/soundEffects';

import { SplashScreen } from './components/SplashScreen';
import { HomeScreen } from './components/HomeScreen';
import { CountdownOverlay } from './components/CountdownOverlay';
import { TopBallConveyor } from './components/TopBallConveyor';
import { LeftCaregiverDock } from './components/LeftCaregiverDock';
import { BingoCard } from './components/BingoCard';
import { SideControls } from './components/SideControls';
import { PodiumDisplay } from './components/PodiumDisplay';
import { VirtualWinBanner } from './components/VirtualWinBanner';
import { VictoryModal } from './components/VictoryModal';
import { GameFinishedModal } from './components/GameFinishedModal';
import { FamilyGuideModal } from './components/FamilyGuideModal';
import { SettingsModal } from './components/SettingsModal';
import { ProfileModal } from './components/ProfileModal';
import { FamilyMembersList } from './components/FamilyMembersList';
import { VoiceChatBar } from './components/VoiceChatBar';
import { MobileNetoLayout } from './components/MobileNetoLayout';
import { FloatingPipWindow } from './components/FloatingPipWindow';
import { MilestoneToast } from './components/MilestoneToast';
import { useMilestones } from './hooks/useMilestones';

export default function App() {
  // Telas da aplicação: 'splash' | 'home' | 'game'
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [isPreparing, setIsPreparing] = useState(false);

  // Perfil da Vovó ou Neto
  const { profile, updateProfile, uploadPhoto, isVovo } = useUserProfile();

  // Modais e Referência para o Botão Voltar do Android
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFamilyGuideOpen, setIsFamilyGuideOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showBingoCelebration, setShowBingoCelebration] = useState(false);
  const [gameOverDismissed, setGameOverDismissed] = useState(false);
  const activeModalRef = useRef(null);

  // Música e Som (Ligada por padrão)
  const [musicPlaying, setMusicPlaying] = useState(() => {
    const saved = localStorage.getItem('vovo_music_enabled');
    return saved !== null ? saved === 'true' : true;
  });
  const [musicTheme, setMusicTheme] = useState('bossa');
  const [musicVolume, setMusicVolume] = useState(0.14);

  // Status de conectividade (Online / Offline)
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Mantém tela do tablet sempre acesa
  const { isLocked: isScreenLocked } = useWakeLock();

  // Tipo de voz do narrador das pedras (vovo, silvio, quermesse)
  const [narratorVoice, setNarratorVoice] = useState(() => {
    return localStorage.getItem('vovo_narrator_voice') || 'vovo';
  });

  const handleSetNarratorVoice = (voice) => {
    setNarratorVoice(voice);
    localStorage.setItem('vovo_narrator_voice', voice);
  };

  // Locução por voz
  const {
    isSpeaking,
    voiceMuted,
    setVoiceMuted,
    speakNumber,
    repeatCurrentBall,
    cancelSpeech
  } = useVoiceAnnouncer(narratorVoice);

  // Quantidade de adversários fictícios na partida (3, 5 ou 8 - padrão 5)
  const [virtualPlayerCount, setVirtualPlayerCount] = useState(() => {
    const saved = localStorage.getItem('vovo_virtual_player_count');
    return saved ? parseInt(saved, 10) : 5;
  });

  const handleSetVirtualPlayerCount = (count) => {
    setVirtualPlayerCount(count);
    localStorage.setItem('vovo_virtual_player_count', count.toString());
  };

  // Jogo do Bingo com Pódio e Jogadores Virtuais
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
    autoBingo,
    setAutoBingo,
    timerProgress,
    winState,
    isBingoReadyToClaim,
    hasWonThisGame,
    setHasWonThisGame,
    claimBingo,
    podiumWinners,
    latestVirtualWinner,
    setLatestVirtualWinner,
    isGameOver,
    vovoWinPlace,
    drawNextBall,
    applyRemoteBall,
    toggleCell,
    resetGame
  } = useBingoGame({
    playerName: profile.name,
    isHost: isVovo,
    virtualPlayerCount,
    onBallDrawn: (num) => {
      speakNumber(num);
      emitBallDrawn(num);
    },
    onWin: (place, pattern, winnerObj) => {
      cancelSpeech();
      activeModalRef.current = 'victory';
      setShowBingoCelebration(true);
      emitClaimBingo({
        ...winnerObj,
        role: profile.role,
        photo: getUserAvatar(profile)
      });
    },
    onVirtualWin: (winner) => {
      soundFX.playBallDrawn();
    },
    onGameOver: () => {
      cancelSpeech();
      activeModalRef.current = 'gameover';
    }
  });

  // Conexão Socket.io com servidor Hetzner
  const {
    isConnected,
    roomUsers,
    roomGameState,
    socket,
    emitStartGame,
    emitResetGame,
    emitBallDrawn,
    emitClaimBingo,
    emitSpeakingState
  } = useFamilySocket({
    profile,
    onRemoteBallDrawn: (ball) => {
      applyRemoteBall(ball);
      speakNumber(ball);
    },
    onRemoteBingoClaimed: (winner, podium) => {
      setLatestVirtualWinner(winner);
      soundFX.playBallDrawn();
    },
    onGameStarted: (gameState) => {
      if (!isVovo) {
        resetGame();
        setCurrentScreen('game');
      }
    },
    onGameReset: (gameState) => {
      resetGame();
    }
  });

  // WebRTC Voz estilo Discord
  const voiceProps = useWebRTCVoice({
    socket,
    isConnected,
    profile,
    onSpeakingChange: (isTalking) => {
      emitSpeakingState(isTalking);
    }
  });

  // Verifica se há outros membros da família na sala (excluindo a si mesmo)
  const otherFamilyMembers = roomUsers.filter(u => u.id !== profile.id);
  const hasOtherFamilyInRoom = otherFamilyMembers.length > 0;

  // Desliga/pausa automaticamente a música de fundo quando familiares entram na sala para não atrapalhar conversas
  useEffect(() => {
    musicSynthesizer.setFamilyInRoom(hasOtherFamilyInRoom);
  }, [hasOtherFamilyInRoom]);

  // Execução contínua em segundo plano no celular para Netos (Web Worker)
  useBackgroundKeepalive();

  // Sincroniza preferências do perfil com os estados do motor de bingo
  useEffect(() => {
    setAutoMark(profile.autoMark);
  }, [profile.autoMark, setAutoMark]);

  useEffect(() => {
    setAutoBingo(profile.autoBingo);
  }, [profile.autoBingo, setAutoBingo]);

  // Prêmios por quantidade de números marcados (a casa LIVRE conta)
  const markedCount = markedCellIds.size + 1;
  const milestones = useMilestones(markedCount);

  // Quando uma nova partida começa, a janela de encerramento volta a poder abrir
  useEffect(() => {
    if (!isGameOver) setGameOverDismissed(false);
  }, [isGameOver]);

  // Fluxo único de "Nova Partida" (janelas de fim de jogo e botão lateral)
  const handleNewGame = () => {
    cancelSpeech();
    resetGame();
    if (isVovo) emitStartGame();
    setIsPreparing(true);
  };

  // Partida terminou e as janelas já foram fechadas: mostra botão grande "Nova Partida"
  const showNewGameButton =
    (hasWonThisGame && !showBingoCelebration) || (isGameOver && gameOverDismissed);

  // Indica se a partida terminou (evita retomar o sorteio ao cancelar a saída)
  const gameEndedRef = useRef(false);
  useEffect(() => {
    gameEndedRef.current = hasWonThisGame || isGameOver;
  }, [hasWonThisGame, isGameOver]);


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

    const handlePopState = () => {
      const modal = activeModalRef.current;

      if (modal === 'profile') {
        setIsProfileOpen(false);
        activeModalRef.current = null;
        window.history.pushState(null, '', window.location.href);
        return;
      }

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
        setShowExitConfirm(false);
        if (!gameEndedRef.current) setIsPlaying(true);
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

      if (modal === 'gameover') {
        setGameOverDismissed(true);
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
  }, [currentScreen, setIsPlaying]);

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

  // Primeiro clique na tela inicializa os canais de áudio e inicia música suave
  const handleFirstInteraction = () => {
    soundFX.init();
    musicSynthesizer.init();
    if (voiceProps?.unlockAudio) {
      voiceProps.unlockAudio();
    }
    if (musicPlaying && !musicSynthesizer.isPlaying) {
      musicSynthesizer.start();
    }
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

    if (isVovo) {
      emitStartGame();
      setIsPreparing(true);
      if (!voiceProps.hasMicPermission) {
        voiceProps.initMicrophone();
      }
    }

    if (musicPlaying) {
      musicSynthesizer.start();
    }
  };

  // Final da contagem 3-2-1 de preparação
  const handleCountdownComplete = useCallback(() => {
    setIsPreparing(false);
    drawNextBall();
    setIsPlaying(true);

    if (musicPlaying) {
      musicSynthesizer.start();
    }
  }, [drawNextBall, setIsPlaying, musicPlaying]);

  // Solicitar saída (pausa o jogo automaticamente e abre o modal de confirmação)
  const handleRequestExit = () => {
    setIsPlaying(false);
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
    if (!gameEndedRef.current) setIsPlaying(true);
  };

  return (
    <div
      onClick={handleFirstInteraction}
      onTouchStart={handleFirstInteraction}
      className="h-full w-full min-h-screen-safe bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden select-none relative"
      style={{
        background: 'radial-gradient(circle at 50% 15%, #1e40af 0%, #1e3a8a 35%, #0f172a 75%, #020617 100%)'
      }}
    >
      {/* Luz dourada de auditório no topo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[250px] bg-amber-400/10 blur-[90px] pointer-events-none rounded-full" />
      {/* 1. Tela de Abertura (Splash Screen) */}
      {currentScreen === 'splash' && (
        <SplashScreen onFinish={() => setCurrentScreen('home')} />
      )}

      {/* 2. Tela Inicial / Lobby com Perfil da Família */}
      {currentScreen === 'home' && (
        <HomeScreen
          vovoName={profile.role === 'vovo' ? profile.name : 'Bingo da Família'}
          onStartGame={handleStartGameFromHome}
          onOpenSettings={() => openModal('settings', setIsSettingsOpen)}
          onOpenFamilyGuide={() => openModal('guide', setIsFamilyGuideOpen)}
          profile={profile}
          onOpenProfile={() => openModal('profile', setIsProfileOpen)}
          roomUsers={roomUsers}
          isConnected={isConnected}
          musicPlaying={musicPlaying}
          onToggleMusic={handleToggleMusic}
          virtualPlayerCount={virtualPlayerCount}
          onChangeVirtualPlayerCount={handleSetVirtualPlayerCount}
          narratorVoice={narratorVoice}
        />
      )}

      {/* 3. Tela da Partida: Modo Celular (Neto) vs Modo Tablet (Vovó) */}
      {currentScreen === 'game' && !isVovo && (
        <MobileNetoLayout
          card={card}
          currentBall={currentBall}
          drawnBalls={drawnBalls}
          markedCellIds={markedCellIds}
          onCellClick={toggleCell}
          winState={winState}
          isBingoReady={isBingoReadyToClaim}
          onClaimBingo={claimBingo}
          onRequestExit={handleRequestExit}
          hasWonThisGame={hasWonThisGame}
          roomGameState={roomGameState}
          autoMark={autoMark}
          onToggleAutoMark={() => {
            const next = !autoMark;
            setAutoMark(next);
            updateProfile({ autoMark: next });
          }}
          autoBingo={autoBingo}
          onToggleAutoBingo={() => {
            const next = !autoBingo;
            setAutoBingo(next);
            updateProfile({ autoBingo: next });
          }}
          profile={profile}
          onOpenProfile={() => openModal('profile', setIsProfileOpen)}
          roomUsers={roomUsers}
          isConnected={isConnected}
          voiceProps={voiceProps}
          musicPlaying={musicPlaying}
          onToggleMusic={handleToggleMusic}
        />
      )}

      {currentScreen === 'game' && isVovo && (
        <div className="h-full w-full flex flex-col justify-between overflow-hidden relative">
          {/* Banner de Notificação de Jogador Virtual Vencedor */}
          <VirtualWinBanner
            winner={latestVirtualWinner}
            onDismiss={() => setLatestVirtualWinner(null)}
          />

          {/* Overlay de Preparação e Contagem (3, 2, 1) */}
          {isPreparing && (
            <CountdownOverlay
              onComplete={handleCountdownComplete}
              vovoName={profile.name}
              narratorVoice={narratorVoice}
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
            isOnline={isOnline}
          />

          {/* Sub-barra: Indicador de Vagas do Pódio (1º, 2º e 3º Lugar) */}
          <div className="w-full flex items-center justify-center px-2 py-0.5 flex-shrink-0">
            <PodiumDisplay podiumWinners={podiumWinners} />
          </div>

          {/* Área Central: Dock Esquerdo + Cartela Completa + Coluna Direita */}
          <main className="flex-1 w-full max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-1 sm:gap-2 px-1.5 sm:px-3 py-0.5 sm:py-1 min-h-0 overflow-hidden relative z-10">
            {/* 1. Lateral Esquerda: Lista de Familiares + Viva-Voz + Ajustes */}
            <LeftCaregiverDock
              onOpenSettings={() => openModal('settings', setIsSettingsOpen)}
              onOpenFamilyGuide={() => openModal('guide', setIsFamilyGuideOpen)}
              onOpenProfile={() => openModal('profile', setIsProfileOpen)}
              roomUsers={roomUsers}
              isConnected={isConnected}
              currentProfile={profile}
              voiceProps={voiceProps}
            />

            {/* 2. Centro: Cartela 100% Visível com Realce Dourado em Linhas/Diagonais/Pontas */}
            <div className="flex-1 h-full flex items-center justify-center min-h-0 w-full overflow-hidden">
              <BingoCard
                card={card}
                markedCellIds={markedCellIds}
                currentBall={currentBall}
                onCellClick={toggleCell}
                winState={winState}
                vovoName={profile.name}
              />
            </div>

            {/* 3. Lateral Direita: Prêmios, bolas sorteadas, BINGO/Nova Partida, Música e SAIR */}
            <SideControls
              isBingoReady={isBingoReadyToClaim}
              onClaimBingo={claimBingo}
              markedCount={markedCount}
              drawnBalls={drawnBalls}
              milestones={milestones}
              showNewGame={showNewGameButton}
              onNewGame={handleNewGame}
              onRequestExit={handleRequestExit}
              musicPlaying={musicPlaying}
              onToggleMusic={handleToggleMusic}
              onOpenSettings={() => openModal('settings', setIsSettingsOpen)}
              onOpenFamilyGuide={() => openModal('guide', setIsFamilyGuideOpen)}
              hasOtherFamilyInRoom={hasOtherFamilyInRoom}
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
              <button
                onClick={handleCancelExit}
                type="button"
                className="flex-1 py-4 px-4 rounded-2xl font-black text-base sm:text-lg text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border-3 border-emerald-500 active:scale-95 transition-all shadow-sm"
              >
                Não (voltar ao jogo)
              </button>
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

      {/* Modal de Vitória com a Foto do Jogador no Pódio */}
      <VictoryModal
        isOpen={showBingoCelebration}
        onClose={() => closeModal('victory', setShowBingoCelebration)}
        onNewGame={handleNewGame}
        vovoName={profile.name}
        playerPhoto={getUserAvatar(profile)}
        winPlace={vovoWinPlace || 1}
        winPattern={winState.patternDescription || 'Linha'}
      />

      {/* Modal Carinhoso de Encerramento (Quando 3 virtuais ganham antes) */}
      <GameFinishedModal
        isOpen={isGameOver && !gameOverDismissed}
        podiumWinners={podiumWinners}
        onNewGame={handleNewGame}
        vovoName={profile.name}
      />

      {/* Aviso flutuante de prêmio (não bloqueia o jogo) */}
      {currentScreen === 'game' && isVovo && (
        <MilestoneToast milestone={milestones.justUnlocked} />
      )}

      {/* Modal de Dicas para Fixar/Blindar no Tablet */}
      <FamilyGuideModal
        isOpen={isFamilyGuideOpen}
        onClose={() => closeModal('guide', setIsFamilyGuideOpen)}
      />

      {/* Modal de Perfil e Foto da Família */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => closeModal('profile', setIsProfileOpen)}
        profile={profile}
        onUpdateProfile={updateProfile}
        onUploadPhoto={uploadPhoto}
      />

      {/* Modal de Configurações Técnicas */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => closeModal('settings', setIsSettingsOpen)}
        vovoName={profile.name}
        setVovoName={(name) => updateProfile({ name })}
        autoSpeed={autoSpeed}
        setAutoSpeed={setAutoSpeed}
        autoMark={autoMark}
        setAutoMark={(val) => {
          setAutoMark(val);
          updateProfile({ autoMark: val });
        }}
        voiceMuted={voiceMuted}
        setVoiceMuted={setVoiceMuted}
        narratorVoice={narratorVoice}
        setNarratorVoice={handleSetNarratorVoice}
        musicTheme={musicTheme}
        setMusicTheme={setMusicTheme}
        musicPlaying={musicPlaying}
        setMusicPlaying={setMusicPlaying}
        musicVolume={musicVolume}
        setMusicVolume={setMusicVolume}
        virtualPlayerCount={virtualPlayerCount}
        setVirtualPlayerCount={handleSetVirtualPlayerCount}
      />
    </div>
  );
}
