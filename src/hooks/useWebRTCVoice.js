import { useState, useEffect, useRef, useCallback } from 'react';

// Servidores STUN públicos gratuitos do Google para atravessar NAT/Firewalls (Wi-Fi vs 4G)
const RTC_CONFIG = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' }
  ]
};

export function useWebRTCVoice({ socket, isConnected, profile, onSpeakingChange }) {
  const [hasMicPermission, setHasMicPermission] = useState(false);
  const [isMuted, setIsMuted] = useState(profile?.role !== 'vovo'); // Vovó entra com viva-voz aberto
  const [isPushToTalk, setIsPushToTalk] = useState(profile?.role === 'neto'); // Netos usam push-to-talk por padrão
  const [isTalking, setIsTalking] = useState(false);
  const [peerCount, setPeerCount] = useState(0);

  const localStreamRef = useRef(null);
  const peersRef = useRef(new Map()); // socketId -> { pc: RTCPeerConnection, audio: HTMLAudioElement }
  const iceQueuesRef = useRef(new Map()); // socketId -> Array<candidate>
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const vadIntervalRef = useRef(null);
  const isMutedRef = useRef(isMuted);
  isMutedRef.current = isMuted;

  // 1. Limpeza de um peer específico
  const cleanupPeer = useCallback((remoteSocketId) => {
    const peerObj = peersRef.current.get(remoteSocketId);
    if (peerObj) {
      try {
        peerObj.pc.onicecandidate = null;
        peerObj.pc.ontrack = null;
        peerObj.pc.close();
      } catch (e) {}

      if (peerObj.audio) {
        try {
          peerObj.audio.pause();
          peerObj.audio.srcObject = null;
          peerObj.audio.remove();
        } catch (e) {}
      }
      peersRef.current.delete(remoteSocketId);
      iceQueuesRef.current.delete(remoteSocketId);
      setPeerCount(peersRef.current.size);
    }
  }, []);

  // 2. Drenar fila de ICE Candidates quando a descrição remota estiver pronta
  const drainIceQueue = async (remoteSocketId, pc) => {
    const queue = iceQueuesRef.current.get(remoteSocketId) || [];
    while (queue.length > 0) {
      const candidate = queue.shift();
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.warn('Erro ao aplicar ICE Candidate da fila:', err);
      }
    }
  };

  // 3. Criar e configurar RTCPeerConnection
  const createPeerConnection = useCallback((remoteSocketId, isInitiator = false) => {
    if (peersRef.current.has(remoteSocketId)) {
      return peersRef.current.get(remoteSocketId);
    }

    const pc = new RTCPeerConnection(RTC_CONFIG);

    // Elemento de áudio invisível para tocar a voz recebida
    const audio = document.createElement('audio');
    audio.autoplay = true;
    audio.playsInline = true;
    audio.style.display = 'none';
    document.body.appendChild(audio);

    // Receber fluxo de áudio remoto
    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        audio.srcObject = event.streams[0];
        audio.play().catch(err => {
          console.warn('Autoplay bloqueado pelo navegador, aguardando interação do usuário:', err);
        });
      }
    };

    // Enviar ICE Candidates para o participante remoto
    pc.onicecandidate = (event) => {
      if (event.candidate && socket && socket.connected) {
        socket.emit('webrtc-signal', {
          to: remoteSocketId,
          signal: {
            type: 'candidate',
            candidate: event.candidate
          }
        });
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
        cleanupPeer(remoteSocketId);
      }
    };

    // Adiciona faixas de áudio locais caso o microfone já esteja aberto
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current);
      });
    }

    const peerObj = { pc, audio, isInitiator };
    peersRef.current.set(remoteSocketId, peerObj);
    setPeerCount(peersRef.current.size);
    return peerObj;
  }, [socket, cleanupPeer]);

  // 4. Iniciar oferta WebRTC para um novo peer
  const initiateOffer = useCallback(async (remoteSocketId) => {
    if (!remoteSocketId || remoteSocketId === socket?.id) return;

    try {
      const peerObj = createPeerConnection(remoteSocketId, true);
      const offer = await peerObj.pc.createOffer({
        offerToReceiveAudio: true
      });
      await peerObj.pc.setLocalDescription(offer);

      if (socket && socket.connected) {
        socket.emit('webrtc-signal', {
          to: remoteSocketId,
          signal: {
            type: 'offer',
            sdp: offer
          }
        });
      }
    } catch (err) {
      console.error('Erro ao iniciar oferta WebRTC para', remoteSocketId, err);
    }
  }, [socket, createPeerConnection]);

  // 5. Iniciar captura do microfone do dispositivo
  const initMicrophone = async () => {
    if (!navigator.mediaDevices?.getUserMedia) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: false
      });

      localStreamRef.current = stream;
      setHasMicPermission(true);

      // Aplica estado de mudo inicial
      stream.getAudioTracks().forEach(track => {
        track.enabled = !isMutedRef.current;
      });

      // Se já existem conexões ativas, injeta a faixa de áudio nelas
      stream.getAudioTracks().forEach(track => {
        peersRef.current.forEach(({ pc }) => {
          const senders = pc.getSenders();
          const audioSender = senders.find(s => s.track && s.track.kind === 'audio');
          if (audioSender) {
            audioSender.replaceTrack(track);
          } else {
            pc.addTrack(track, stream);
          }
        });
      });

      // Configurar Analisador de Volume para detecção de fala (VAD)
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyserRef.current = analyser;

        // Monitor de fala a cada 150ms
        const buffer = new Uint8Array(analyser.frequencyBinCount);
        if (vadIntervalRef.current) clearInterval(vadIntervalRef.current);

        vadIntervalRef.current = setInterval(() => {
          if (!analyserRef.current || isMutedRef.current || !stream.getAudioTracks()[0]?.enabled) {
            setIsTalking(prev => {
              if (prev && onSpeakingChange) onSpeakingChange(false);
              return false;
            });
            return;
          }

          analyserRef.current.getByteFrequencyData(buffer);
          let sum = 0;
          for (let i = 0; i < buffer.length; i++) sum += buffer[i];
          const average = sum / buffer.length;

          // Limiar de fala
          const speakingNow = average > 16;
          setIsTalking(prev => {
            if (speakingNow !== prev && onSpeakingChange) {
              onSpeakingChange(speakingNow);
            }
            return speakingNow;
          });
        }, 150);
      }
    } catch (err) {
      console.warn('Permissão de microfone não concedida ou dispositivo sem suporte:', err);
    }
  };

  // 6. Listener de Sinalização WebRTC Socket.io
  useEffect(() => {
    if (!socket) return;

    // A. Recebe oferta ou resposta ou candidato de outro participante
    const handleSignal = async ({ from, signal }) => {
      if (!from || from === socket.id || !signal) return;

      try {
        if (signal.type === 'offer') {
          const peerObj = createPeerConnection(from, false);
          await peerObj.pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
          await drainIceQueue(from, peerObj.pc);

          const answer = await peerObj.pc.createAnswer();
          await peerObj.pc.setLocalDescription(answer);

          socket.emit('webrtc-signal', {
            to: from,
            signal: {
              type: 'answer',
              sdp: answer
            }
          });
        } else if (signal.type === 'answer') {
          const peerObj = peersRef.current.get(from);
          if (peerObj) {
            await peerObj.pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
            await drainIceQueue(from, peerObj.pc);
          }
        } else if (signal.type === 'candidate') {
          const peerObj = peersRef.current.get(from);
          if (peerObj && peerObj.pc.remoteDescription) {
            await peerObj.pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
          } else {
            // Guarda na fila para aplicar após setRemoteDescription
            if (!iceQueuesRef.current.has(from)) {
              iceQueuesRef.current.set(from, []);
            }
            iceQueuesRef.current.get(from).push(signal.candidate);
          }
        }
      } catch (err) {
        console.error('Erro ao processar sinal WebRTC:', err);
      }
    };

    // B. Recebe lista de sockets existentes ao entrar na sala
    const handleExistingPeers = (peerSocketIds) => {
      if (Array.isArray(peerSocketIds)) {
        peerSocketIds.forEach(remoteId => {
          if (remoteId && remoteId !== socket.id) {
            initiateOffer(remoteId);
          }
        });
      }
    };

    // C. Notificação de quando um novo usuário entra
    const handleUserJoinedVoice = ({ socketId }) => {
      if (socketId && socketId !== socket.id) {
        initiateOffer(socketId);
      }
    };

    // D. Notificação de quando um usuário sai
    const handleUserLeftVoice = ({ socketId }) => {
      cleanupPeer(socketId);
    };

    socket.on('webrtc-signal', handleSignal);
    socket.on('existing-voice-peers', handleExistingPeers);
    socket.on('user-joined-voice', handleUserJoinedVoice);
    socket.on('user-left-voice', handleUserLeftVoice);

    return () => {
      socket.off('webrtc-signal', handleSignal);
      socket.off('existing-voice-peers', handleExistingPeers);
      socket.off('user-joined-voice', handleUserJoinedVoice);
      socket.off('user-left-voice', handleUserLeftVoice);
    };
  }, [socket, createPeerConnection, initiateOffer, cleanupPeer]);

  // 7. Mutar / Desmutar microfone
  useEffect(() => {
    isMutedRef.current = isMuted;
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });
    }
    if (isMuted) {
      setIsTalking(false);
      if (onSpeakingChange) onSpeakingChange(false);
    }
  }, [isMuted, onSpeakingChange]);

  // 8. Desbloquear áudio em celulares (chamado no primeiro toque na tela)
  const unlockAudio = useCallback(() => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().catch(() => {});
    }
    peersRef.current.forEach(({ audio }) => {
      if (audio && audio.srcObject) {
        audio.play().catch(() => {});
      }
    });
  }, []);

  // 9. Push-to-Talk handlers para netos no celular
  const handlePushToTalkStart = () => {
    if (!hasMicPermission) {
      initMicrophone();
    }
    setIsMuted(false);
  };

  const handlePushToTalkEnd = () => {
    if (isPushToTalk) {
      setIsMuted(true);
    }
  };

  // 10. Limpeza total ao desmontar
  useEffect(() => {
    return () => {
      if (vadIntervalRef.current) clearInterval(vadIntervalRef.current);
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
      peersRef.current.forEach(({ pc, audio }) => {
        try { pc.close(); } catch (e) {}
        try { audio.remove(); } catch (e) {}
      });
      peersRef.current.clear();
      iceQueuesRef.current.clear();
    };
  }, []);

  return {
    hasMicPermission,
    initMicrophone,
    isMuted,
    setIsMuted,
    isPushToTalk,
    setIsPushToTalk,
    isTalking,
    peerCount,
    unlockAudio,
    handlePushToTalkStart,
    handlePushToTalkEnd
  };
}
