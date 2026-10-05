import React, { useState, useRef } from 'react';
import { X, Camera, User, Sparkles, Zap, Trophy, Mic, Smartphone, Tablet } from 'lucide-react';

export function ProfileModal({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onUploadPhoto
}) {
  const [name, setName] = useState(profile?.name || 'Vovó');
  const [role, setRole] = useState(profile?.role || 'vovo');
  const [autoMark, setAutoMark] = useState(profile?.autoMark || false);
  const [autoBingo, setAutoBingo] = useState(profile?.autoBingo || false);
  const [photoPreview, setPhotoPreview] = useState(profile?.photo || '/vovo.jpg');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (onUploadPhoto) {
        const base64 = await onUploadPhoto(file);
        setPhotoPreview(base64);
      } else {
        const reader = new FileReader();
        reader.onload = (event) => setPhotoPreview(event.target.result);
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error('Erro ao carregar foto:', err);
    }
  };

  const handleSave = () => {
    onUpdateProfile({
      name: name.trim() || (role === 'vovo' ? 'Vovó' : 'Neto'),
      role,
      autoMark,
      autoBingo,
      photo: photoPreview
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-pop-in">
      <div className="bg-slate-900 border-2 border-amber-400/60 rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-white">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-800/60">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl sm:text-2xl font-black text-amber-300">
              Perfil da Família
            </h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Seletor de Papel: Vovó vs Neto */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Quem vai jogar neste aparelho?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setRole('vovo');
                  if (name === 'Neto' || !name) setName('Vovó');
                  setPhotoPreview('/vovo.jpg');
                }}
                className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl border-2 transition-all text-center ${
                  role === 'vovo'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md ring-2 ring-amber-400/30'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-amber-500/30 flex items-center justify-center text-amber-300">
                  <Tablet className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-black text-base">👵 Sou a Vovó</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Modo Tablet / Acessível</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRole('neto');
                  if (name === 'Vovó') setName('Neto');
                }}
                className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl border-2 transition-all text-center ${
                  role === 'neto'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-md ring-2 ring-emerald-400/30'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500/30 flex items-center justify-center text-emerald-300">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-black text-base">📱 Neto / Família</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Modo Celular / Multitarefa</div>
                </div>
              </button>
            </div>
          </div>

          {/* Foto e Nome */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/60">
            {/* Foto Circular com Botão de Alterar */}
            <div className="relative group">
              <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-amber-400 shadow-lg bg-slate-700 flex items-center justify-center">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-slate-400" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 p-2 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md active:scale-90 transition-transform"
                title="Tirar foto ou escolher da galeria"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Input Nome */}
            <div className="flex-1 w-full text-left">
              <label className="block text-xs font-bold text-slate-400 mb-1">
                Nome ou Apelido:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={25}
                placeholder="Ex: César, Paulinha, Vovó..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-600 focus:border-amber-400 text-white font-bold text-base outline-none shadow-inner"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Este nome aparecerá na tela da vovó e para os parentes.
              </span>
            </div>
          </div>

          {/* Configurações Especiais para Netos (Trabalho / Multitarefa) */}
          {role === 'neto' && (
            <div className="space-y-3 bg-emerald-950/30 p-4 rounded-2xl border border-emerald-500/30">
              <div className="flex items-center gap-2 text-emerald-300 font-extrabold text-sm uppercase tracking-wide">
                <Zap className="w-4 h-4" />
                <span>Super Poderes para Netos no Trabalho</span>
              </div>

              {/* Toggle Auto-Marcar */}
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700 hover:bg-slate-800 cursor-pointer">
                <div className="pr-3 text-left">
                  <div className="font-bold text-sm text-white flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>⚡ Auto-Marcar Pedras</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Marca os números na sua cartela automaticamente assim que saem.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={autoMark}
                  onChange={(e) => setAutoMark(e.target.checked)}
                  className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                />
              </label>

              {/* Toggle Auto-Bingo */}
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700 hover:bg-slate-800 cursor-pointer">
                <div className="pr-3 text-left">
                  <div className="font-bold text-sm text-white flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span>🏆 Auto-Bingo Instantâneo</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Grita Bingo sozinho assim que você completar uma linha ou diagonal.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={autoBingo}
                  onChange={(e) => setAutoBingo(e.target.checked)}
                  className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                />
              </label>
            </div>
          )}
        </div>

        {/* Rodapé com Botão Salvar */}
        <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-800/80 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl font-bold text-sm text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl font-black text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md active:scale-95 transition-transform"
          >
            Salvar Perfil
          </button>
        </div>
      </div>
    </div>
  );
}
