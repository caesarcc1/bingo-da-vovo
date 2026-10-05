import React from 'react';
import { X, Volume2, VolumeX, Music, Mic, Zap, Clock, User } from 'lucide-react';
import { musicSynthesizer } from '../utils/musicSynthesizer';

export function SettingsModal({
  isOpen,
  onClose,
  vovoName,
  setVovoName,
  autoSpeed,
  setAutoSpeed,
  autoMark,
  setAutoMark,
  voiceMuted,
  setVoiceMuted,
  musicTheme,
  setMusicTheme,
  musicPlaying,
  setMusicPlaying,
  musicVolume,
  setMusicVolume
}) {
  if (!isOpen) return null;

  const handleToggleMusic = () => {
    const isPlaying = musicSynthesizer.toggle();
    setMusicPlaying(isPlaying);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setMusicVolume(val);
    musicSynthesizer.setVolume(val);
  };

  const handleThemeChange = (theme) => {
    setMusicTheme(theme);
    musicSynthesizer.setTheme(theme);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-pop-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 shadow-2xl border-4 border-slate-300">
        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            Configurações do Jogo
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-5 py-4">
          {/* Nome da Vovó no Título da Cartela */}
          <div>
            <label className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <User className="w-4 h-4 text-purple-600" />
              Título Personalizado
            </label>
            <input
              type="text"
              value={vovoName}
              onChange={(e) => setVovoName(e.target.value)}
              placeholder="Ex: Bingo da Vovó Dirce"
              maxLength={30}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 focus:border-purple-600 outline-none font-bold text-slate-800 text-base"
            />
          </div>

          {/* Narração em Voz Alta */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-sm sm:text-base text-slate-900">
                  Narração da Pedra Cantada
                </p>
                <p className="text-xs text-slate-500">
                  Fala a letra, número e dígitos em português
                </p>
              </div>
            </div>

            <button
              onClick={() => setVoiceMuted(!voiceMuted)}
              type="button"
              className={`
                px-4 py-2 rounded-xl font-black text-xs sm:text-sm transition-all
                ${!voiceMuted
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-600'
                }
              `}
            >
              {!voiceMuted ? 'Ligada' : 'Muda'}
            </button>
          </div>

          {/* Música de Fundo e Temas */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-extrabold text-sm sm:text-base text-slate-900">
                    Musiquinha de Fundo
                  </p>
                  <p className="text-xs text-slate-500">
                    Trilha suave que não atrapalha a voz
                  </p>
                </div>
              </div>

              <button
                onClick={handleToggleMusic}
                type="button"
                className={`
                  px-4 py-2 rounded-xl font-black text-xs sm:text-sm transition-all
                  ${musicPlaying
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                  }
                `}
              >
                {musicPlaying ? 'Tocando' : 'Pausada'}
              </button>
            </div>

            {/* Seleção do Tema Musical */}
            <div>
              <p className="text-xs font-bold text-slate-600 mb-1.5 uppercase">
                Estilo da Trilha Sonora:
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'calmo', label: 'Calma (Suave)' },
                  { id: 'alegre', label: 'Alegre (Bossa)' },
                  { id: 'classico', label: 'Clássica (Valsa)' }
                ].map((th) => (
                  <button
                    key={th.id}
                    onClick={() => handleThemeChange(th.id)}
                    type="button"
                    className={`
                      py-2 px-2 rounded-xl text-xs font-black border-2 transition-all
                      ${musicTheme === th.id
                        ? 'bg-rose-50 border-rose-500 text-rose-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }
                    `}
                  >
                    {th.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Controle de Volume */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1">
                <span>Volume da Música:</span>
                <span>{Math.round(musicVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={musicVolume}
                onChange={handleVolumeChange}
                className="w-full accent-rose-600"
              />
            </div>
          </div>

          {/* Ritmo / Velocidade do Sorteio Automático */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <p className="font-extrabold text-sm sm:text-base text-slate-900">
                Velocidade do Sorteio Automático
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { sec: 10, label: 'Pausado (10s)' },
                { sec: 7.5, label: 'Normal (7,5s)' },
                { sec: 5.5, label: 'Mais Rápido (5,5s)' }
              ].map((sp) => (
                <button
                  key={sp.sec}
                  onClick={() => setAutoSpeed(sp.sec)}
                  type="button"
                  className={`
                    py-2 px-2 rounded-xl text-xs font-black border-2 transition-all
                    ${autoSpeed === sp.sec
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }
                  `}
                >
                  {sp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Assistência / Marcação Automática */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-sm sm:text-base text-slate-900">
                  Marcação Automática
                </p>
                <p className="text-xs text-slate-500">
                  Coloca o feijãozinho sozinho se ela preferir só torcer
                </p>
              </div>
            </div>

            <button
              onClick={() => setAutoMark(!autoMark)}
              type="button"
              className={`
                px-4 py-2 rounded-xl font-black text-xs sm:text-sm transition-all
                ${autoMark
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-200 text-slate-600'
                }
              `}
            >
              {autoMark ? 'Ligada' : 'Desligada'}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            type="button"
            className="w-full py-3.5 px-4 rounded-2xl font-black text-white bg-slate-900 hover:bg-slate-800 shadow-md text-base"
          >
            Salvar e Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
