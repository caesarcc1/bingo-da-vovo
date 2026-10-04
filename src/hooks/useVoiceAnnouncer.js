import { useState, useEffect, useRef, useCallback } from 'react';
import { getNarrationPhrase } from '../utils/numberWords';
import { musicSynthesizer } from '../utils/musicSynthesizer';

export function useVoiceAnnouncer() {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const lastAnnouncedNum = useRef(null);

  // Carregar vozes disponíveis no navegador
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const updateVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      setVoices(allVoices);

      // Priorizar vozes pt-BR de qualidade natural (Google, Microsoft ou pt-BR)
      const ptBrVoices = allVoices.filter(v => v.lang === 'pt-BR' || v.lang === 'pt_BR');
      const preferred = ptBrVoices.find(v => 
        v.name.includes('Google') || 
        v.name.includes('Natural') || 
        v.name.includes('Luciana') || 
        v.name.includes('Maria')
      ) || ptBrVoices[0] || allVoices.find(v => v.lang.startsWith('pt'));

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
   * Fala a frase do sorteio de forma pausada e didática
   */
  const speakNumber = useCallback((num, force = false) => {
    if (voiceMuted && !force) return;
    if (!('speechSynthesis' in window)) return;
    if (!num) return;

    lastAnnouncedNum.current = num;

    // Cancela falas anteriores pendentes para não acumular
    window.speechSynthesis.cancel();

    const phrase = getNarrationPhrase(num);
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.lang = 'pt-BR';
    
    // Ritmo um pouco mais lento (0.88) para perfeita compreensão
    utterance.rate = 0.88;
    utterance.pitch = 1.05;

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
  }, [selectedVoice, voiceMuted]);

  /**
   * Repete a narração da última bola sorteada
   */
  const repeatCurrentBall = useCallback(() => {
    if (lastAnnouncedNum.current) {
      speakNumber(lastAnnouncedNum.current, true);
    }
  }, [speakNumber]);

  /**
   * Cancela qualquer fala em andamento
   */
  const cancelSpeech = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      musicSynthesizer.duck(false);
    }
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
