import React from 'react';
import { Mic, MicOff, Volume2, Radio, Check } from 'lucide-react';

export function VoiceChatBar({
  isVovo = false,
  isMuted,
  onToggleMute,
  isPushToTalk,
  onTogglePushToTalk,
  isTalking,
  hasMicPermission,
  onInitMic,
  onPushToTalkStart,
  onPushToTalkEnd
}) {
  return (
    <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-700/80 shadow-lg select-none">
      {/* 1. Se ainda não concedeu permissão de microfone */}
      {!hasMicPermission ? (
        <button
          onClick={onInitMic}
          type="button"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow active:scale-95"
          title="Ativar microfone para falar com a família"
        >
          <Mic className="w-3.5 h-3.5" />
          <span>Ativar Microfone</span>
        </button>
      ) : (
        <>
          {/* 2. Para a Vovó: Viva-Voz sempre aberto e mãos livres */}
          {isVovo ? (
            <button
              onClick={onToggleMute}
              type="button"
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-xl font-black text-xs transition-all border
                ${!isMuted
                  ? 'bg-emerald-600/30 border-emerald-400 text-emerald-300 ring-2 ring-emerald-400/40'
                  : 'bg-rose-900/40 border-rose-500 text-rose-300'
                }
              `}
              title={isMuted ? 'Microfone Mutado (Clique para ativar)' : 'Viva-Voz Aberto (Mãos Livres)'}
            >
              {!isMuted ? (
                <>
                  <Mic className={`w-3.5 h-3.5 text-emerald-400 ${isTalking ? 'animate-bounce' : ''}`} />
                  <span>{isTalking ? 'Voz Ativa (Falando...)' : 'Viva-Voz Aberto'}</span>
                </>
              ) : (
                <>
                  <MicOff className="w-3.5 h-3.5 text-rose-400" />
                  <span>Mutado</span>
                </>
              )}
            </button>
          ) : (
            /* 3. Para Netos: Modo Push-to-Talk ou Viva-Voz */
            <div className="flex items-center gap-2">
              {isPushToTalk ? (
                <button
                  onMouseDown={onPushToTalkStart}
                  onMouseUp={onPushToTalkEnd}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    onPushToTalkStart();
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    onPushToTalkEnd();
                  }}
                  type="button"
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs sm:text-sm transition-all border shadow-md active:scale-95
                    ${!isMuted
                      ? 'bg-emerald-500 text-slate-950 border-emerald-300 ring-4 ring-emerald-400/50 scale-105'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600'
                    }
                  `}
                >
                  <Radio className={`w-4 h-4 ${!isMuted ? 'animate-pulse text-slate-950' : 'text-emerald-400'}`} />
                  <span>{!isMuted ? 'FALANDO AGORA...' : 'Segure para Falar'}</span>
                </button>
              ) : (
                <button
                  onClick={onToggleMute}
                  type="button"
                  className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-xl font-black text-xs transition-all border
                    ${!isMuted
                      ? 'bg-emerald-600/30 border-emerald-400 text-emerald-300'
                      : 'bg-rose-900/40 border-rose-500 text-rose-300'
                    }
                  `}
                >
                  {!isMuted ? (
                    <>
                      <Mic className={`w-3.5 h-3.5 text-emerald-400 ${isTalking ? 'animate-bounce' : ''}`} />
                      <span>{isTalking ? 'Falando...' : 'Viva-Voz Ligado'}</span>
                    </>
                  ) : (
                    <>
                      <MicOff className="w-3.5 h-3.5 text-rose-400" />
                      <span>Mutado</span>
                    </>
                  )}
                </button>
              )}

              {/* Botão para alternar modo Push-to-Talk vs Viva-Voz para Netos */}
              <button
                onClick={onTogglePushToTalk}
                type="button"
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-400 hover:text-slate-200 border border-slate-700"
                title="Alternar entre Segurar para Falar ou Viva-Voz"
              >
                {isPushToTalk ? 'Mudar p/ Viva-Voz' : 'Mudar p/ PTT'}
              </button>
            </div>
          )}
        </>
      )}

      {/* Indicador de Som / Nível da Voz */}
      {isTalking && (
        <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-500/20 rounded-md border border-emerald-500/40">
          <span className="w-1 h-3 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
          <span className="w-1 h-4 bg-emerald-300 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
          <span className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
        </div>
      )}
    </div>
  );
}
