import React from 'react';
import { X, ShieldCheck, Smartphone, Lock, Eye, CheckCircle2 } from 'lucide-react';

export function FamilyGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-pop-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border-4 border-emerald-500">
        <div className="flex items-center justify-between pb-4 border-b-2 border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Como Blindar o Tablet da Vovó
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Dicas simples para ela jogar sem fechar o app por engano
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-5 py-4 text-slate-700 text-sm sm:text-base leading-relaxed">
          {/* Passo 1: Instalar como App */}
          <div className="flex gap-3.5 items-start p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200">
            <Smartphone className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-extrabold text-emerald-950 text-base mb-1">
                1. Instalar na Tela Inicial (Modo PWA)
              </h3>
              <p className="text-sm text-emerald-900">
                No navegador Chrome do tablet, toque nos <strong>3 pontinhos (⋮)</strong> no topo e selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.
              </p>
              <p className="text-xs text-emerald-800 mt-1 font-medium">
                ✨ Assim ele abre direto como um app nativo, sem barra de abas nem botões de navegação para atrapalhar!
              </p>
            </div>
          </div>

          {/* Passo 2: Fixação de App do Android */}
          <div className="flex gap-3.5 items-start p-4 bg-blue-50/60 rounded-2xl border border-blue-200">
            <Lock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-extrabold text-blue-950 text-base mb-1">
                2. Fixar o Aplicativo (O "Super Bloqueio" do Android)
              </h3>
              <p className="text-sm text-blue-900 mb-2">
                O Android possui uma função de segurança incrível chamada <strong>"Fixar App"</strong> que impede que qualquer gesto ou toque feche o jogo:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm text-blue-950 font-medium">
                <li>Vá em <strong>Configurações do Tablet → Segurança → Avançado → Fixar aplicativo</strong> e ative.</li>
                <li>Abra o Bingo, toque no botão de aplicativos recentes (|||) do Android.</li>
                <li>Toque no ícone redondinho do Bingo no topo da janelinha e escolha <strong>"Fixar este aplicativo"</strong>.</li>
              </ol>
              <p className="text-xs text-blue-800 mt-2 font-medium">
                🔒 Feito isso, o tablet só sai do bingo se você pressionar e segurar os botões Voltar e Recentes juntos. Ela pode tocar à vontade!
              </p>
            </div>
          </div>

          {/* Passo 3: Proteções já ativas no App */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <h3 className="font-extrabold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-amber-600" />
              Proteções que já deixamos ativadas automaticamente:
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span><strong>Tela Sempre Ligada:</strong> A tela não escurece nem apaga enquanto ela joga.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span><strong>Sem Zoom Involuntário:</strong> Toques duplos acidentais não desconfiguram a tela.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span><strong>Trava de 3 Segundos:</strong> O botão de reiniciar exige segurar por 3 segundos para evitar perdas acidentais.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            type="button"
            className="w-full py-3.5 px-4 rounded-2xl font-black text-white bg-slate-900 hover:bg-slate-800 shadow-md text-base"
          >
            Entendido, Voltar ao Jogo!
          </button>
        </div>
      </div>
    </div>
  );
}
