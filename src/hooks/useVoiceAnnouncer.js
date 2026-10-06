import { useState, useEffect, useRef, useCallback } from 'react';
import { getNarrationPhrase } from '../utils/numberWords';
import { musicSynthesizer } from '../utils/musicSynthesizer';

export function useVoiceAnnouncer(narratorVoice = 'vovo') {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const lastAnnouncedNum = useRef(null);
  const currentAudioRef = useRef(null);
  const narratorVoiceRef = useRef(narratorVoice);
  narratorVoiceRef.current = narratorVoice;

  // Carregar vozes do navegador apenas para caso de fallback
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const updateVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      setVoices(allVoices);

      const ptBrVoices = allVoices.filter(v => v.lang === 'pt-BR' || v.lang === 'pt_BR');
      const preferred = ptBrVoices.find(v => 
        v.name.includes('Google') || 
        v.name.includes('Natural') || 
        v.name.includes('Luciana') || 
        v.name.includes('Maria')
      ) || ptBrVoices[0];

      if (preferred) {
        setSelectedVoice(preferred);
      }
    };

    updateVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  /**
   * Fallback de síntese caso o áudio gravado não toque
   */
  const fallbackSpeechSynthesis = useCallback((num) => {
    if (!('speechSynthesis' in window) || !num) return;
    try {
      window.speechSynthesis.cancel();
      const phrase = getNarrationPhrase(num);
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        musicSynthesizer.duck(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        musicSynthesizer.duck(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        musicSynthesizer.duck(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('[VoiceFallback] Erro:', err);
      setIsSpeaking(false);
      musicSynthesizer.duck(false);
    }
  }, [selectedVoice]);

  /**
   * Fala a pedra do sorteio com a voz brasileira natural gravada em MP3
   */
  const speakNumber = useCallback((num, force = false) => {
    if (voiceMuted && !force) return;
    if (!num) return;

    lastAnnouncedNum.current = num;

    // 1. Interrompe áudio ou fala anterior
    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
      } catch {
        // Ignora
      }
      currentAudioRef.current = null;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    // 2. Diminui a música de fundo e sinaliza início
    musicSynthesizer.duck(true);
    setIsSpeaking(true);

    // 3. Toca o arquivo MP3 gravado para o narrador escolhido
    const currentNarrator = narratorVoiceRef.current;
    let audioUrl = `/audio/balls/${num}.mp3`;
    if (currentNarrator === 'silvio') {
      audioUrl = `/audio/silvio/${num}.mp3`;
    } else if (currentNarrator === 'quermesse') {
      audioUrl = `/audio/quermesse/${num}.mp3`;
    }
    const audio = new Audio(audioUrl);
    currentAudioRef.current = audio;

    audio.onended = () => {
      setIsSpeaking(false);
      musicSynthesizer.duck(false);
      currentAudioRef.current = null;
    };

    audio.onerror = (e) => {
      console.warn(`[VoiceAnnouncer] Falha ao carregar ${audioUrl}, usando fallback:`, e);
      currentAudioRef.current = null;
      fallbackSpeechSynthesis(num);
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('[VoiceAnnouncer] Autoplay bloqueado ou erro, acionando fallback:', err);
        currentAudioRef.current = null;
        fallbackSpeechSynthesis(num);
      });
    }
  }, [voiceMuted, fallbackSpeechSynthesis]);

  /**
   * Repete a narração da última bola sorteada
   */
  const repeatCurrentBall = useCallback(() => {
    if (lastAnnouncedNum.current) {
      speakNumber(lastAnnouncedNum.current, true);
    }
  }, [speakNumber]);

  /**
   * Cancela qualquer fala ou áudio em andamento
   */
  const cancelSpeech = useCallback(() => {
    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
      } catch {
        // Ignora
      }
      currentAudioRef.current = null;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(false);
    musicSynthesizer.duck(false);
  }, []);

  return {
    isSpeaking,
    voiceMuted,
    setVoiceMuted,
    speakNumber,
    repeatCurrentBall,
    cancelSpeech,
    selectedVoice,
    voices
  };
}
