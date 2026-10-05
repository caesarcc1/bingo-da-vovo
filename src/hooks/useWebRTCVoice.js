import { useState, useEffect, useRef, useCallback } from 'react';

export function useWebRTCVoice({ socket, isConnected, profile, onSpeakingChange }) {
  const [hasMicPermission, setHasMicPermission] = useState(false);
  const [isMuted, setIsMuted] = useState(profile?.role !== 'vovo'); // vovó entra com viva-voz aberto
  const [isPushToTalk, setIsPushToTalk] = useState(profile?.role === 'neto'); // netos têm push-to-talk
  const [isTalking, setIsTalking] = useState(false);

  const localStreamRef = useRef(null);
  const peersRef = useRef(new Map()); // socketId -> RTCPeerConnection
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const vadIntervalRef = useRef(null);

  // 1. Obter microfone do dispositivo com cancelamento de ruído e eco
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

      // Desativa inicialmente se estiver mutado
      stream.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
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
        vadIntervalRef.current = setInterval(() => {
          if (!analyserRef.current || !stream.getAudioTracks()[0]?.enabled) {
            if (isTalking) {
              setIsTalking(false);
              if (onSpeakingChange) onSpeakingChange(false);
            }
            return;
          }

          analyserRef.current.getByteFrequencyData(buffer);
          let sum = 0;
          for (let i = 0; i < buffer.length; i++) sum += buffer[i];
          const average = sum / buffer.length;

          // Limiar para considerar que a pessoa está falando
          const speakingNow = average > 18;
          if (speakingNow !== isTalking) {
            setIsTalking(speakingNow);
            if (onSpeakingChange) onSpeakingChange(speakingNow);
          }
        }, 150);
      }
    } catch (err) {
      console.warn('Permissão de microfone não concedida ou indisponível:', err);
    }
  };

  // Mutar / Desmutar faixa de áudio
  useEffect(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });
    }
    if (isMuted && isTalking) {
      setIsTalking(false);
      if (onSpeakingChange) onSpeakingChange(false);
    }
  }, [isMuted]);

  // Push-to-Talk handlers para netos no celular
  const handlePushToTalkStart = () => {
    if (!hasMicPermission) initMicrophone();
    setIsMuted(false);
  };

  const handlePushToTalkEnd = () => {
    if (isPushToTalk) {
      setIsMuted(true);
    }
  };

  // Limpeza
  useEffect(() => {
    return () => {
      if (vadIntervalRef.current) clearInterval(vadIntervalRef.current);
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
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
    handlePushToTalkStart,
    handlePushToTalkEnd
  };
}
