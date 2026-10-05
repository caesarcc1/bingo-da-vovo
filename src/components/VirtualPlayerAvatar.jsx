import React from 'react';

export function VirtualPlayerAvatar({ playerId, size = 64, className = '', isVovo = false }) {
  if (isVovo || playerId === 'vovo') {
    return (
      <div
        className={`relative rounded-full overflow-hidden border-4 border-amber-400 shadow-lg flex-shrink-0 bg-amber-100 ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src="/vovo.jpg"
          alt="Foto da Vovó"
          className="w-full h-full object-cover object-top"
          onError={(e) => {
            // Fallback caso a imagem demore para carregar
            e.target.style.display = 'none';
          }}
        />
        {/* Borda dourada brilhante */}
        <div className="absolute inset-0 rounded-full border-2 border-yellow-300 pointer-events-none" />
      </div>
    );
  }

  // Desenhos ilustrados vetoriais dos 10 personagens
  return (
    <div
      className={`relative rounded-full overflow-hidden border-3 shadow-md flex-shrink-0 bg-slate-100 flex items-center justify-center ${className}`}
      style={{ width: size, height: size, borderColor: '#cbd5e1' }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Fundo do Avatar */}
        <rect width="100" height="100" fill="#f1f5f9" />

        {/* 1. Dona Lourdes: Coque grisalho, óculos roxos redondos e colar */}
        {playerId === 'lourdes' && (
          <g>
            <circle cx="50" cy="50" r="48" fill="#f3e8ff" />
            {/* Coque */}
            <circle cx="50" cy="22" r="14" fill="#cbd5e1" />
            <circle cx="50" cy="22" r="10" fill="#94a3b8" />
            {/* Cabelo */}
            <circle cx="50" cy="46" r="26" fill="#cbd5e1" />
            {/* Rosto */}
            <circle cx="50" cy="52" r="19" fill="#fed7aa" />
            {/* Óculos Roxos */}
            <circle cx="43" cy="50" r="7" fill="none" stroke="#7e22ce" strokeWidth="2.5" />
            <circle cx="57" cy="50" r="7" fill="none" stroke="#7e22ce" strokeWidth="2.5" />
            <line x1="50" y1="50" x2="50" y2="50" stroke="#7e22ce" strokeWidth="2" />
            {/* Olhos e Sorriso */}
            <circle cx="43" cy="50" r="2" fill="#334155" />
            <circle cx="57" cy="50" r="2" fill="#334155" />
            <path d="M 44 60 Q 50 66 56 60" fill="none" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" />
            {/* Bochechas */}
            <circle cx="39" cy="56" r="3.5" fill="#fda4af" opacity="0.6" />
            <circle cx="61" cy="56" r="3.5" fill="#fda4af" opacity="0.6" />
            {/* Colar de Pérolas */}
            <path d="M 40 72 Q 50 78 60 72" fill="none" stroke="#ffffff" strokeWidth="3.5" strokeDasharray="1,4" strokeLinecap="round" />
            {/* Blusa Roxa */}
            <path d="M 28 85 Q 50 75 72 85 L 75 100 L 25 100 Z" fill="#9333ea" />
          </g>
        )}

        {/* 2. Seu Zé: Boina azul, bigodão branco e camisa */}
        {playerId === 'ze' && (
          <g>
            <circle cx="50" cy="50" r="48" fill="#dbeafe" />
            {/* Cabelo lateral */}
            <circle cx="33" cy="52" r="7" fill="#e2e8f0" />
            <circle cx="67" cy="52" r="7" fill="#e2e8f0" />
            {/* Rosto */}
            <circle cx="50" cy="53" r="20" fill="#fed7aa" />
            {/* Boina Azul */}
            <ellipse cx="50" cy="34" rx="26" ry="12" fill="#1e40af" />
            <ellipse cx="53" cy="32" rx="20" ry="10" fill="#2563eb" />
            <circle cx="52" cy="23" r="3" fill="#1e3a8a" />
            {/* Olhos e Sobrancelhas */}
            <path d="M 40 43 Q 44 41 47 44" fill="none" stroke="#cbd5e1" strokeWidth="2.5" />
            <path d="M 53 44 Q 56 41 60 43" fill="none" stroke="#cbd5e1" strokeWidth="2.5" />
            <circle cx="43" cy="48" r="2.2" fill="#0f172a" />
            <circle cx="57" cy="48" r="2.2" fill="#0f172a" />
            {/* Bigode Branco Volumoso */}
            <path d="M 39 61 Q 50 56 50 63 Q 50 56 61 61 Q 50 68 39 61" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
            {/* Camisa */}
            <path d="M 26 86 Q 50 76 74 86 L 76 100 L 24 100 Z" fill="#3b82f6" />
          </g>
        )}

        {/* 3. Tia Cecília: Cachos com flor vermelha e sorriso */}
        {playerId === 'cecilia' && (
          <g>
            <circle cx="50" cy="50" r="48" fill="#ffe4e6" />
            {/* Cabelo Cacheado */}
            <circle cx="34" cy="40" r="11" fill="#94a3b8" />
            <circle cx="66" cy="40" r="11" fill="#94a3b8" />
            <circle cx="50" cy="33" r="14" fill="#cbd5e1" />
            <circle cx="30" cy="54" r="10" fill="#cbd5e1" />
            <circle cx="70" cy="54" r="10" fill="#cbd5e1" />
            {/* Flor Vermelha */}
            <circle cx="67" cy="32" r="6" fill="#e11d48" />
            <circle cx="67" cy="32" r="2.5" fill="#fef08a" />
            {/* Rosto */}
            <circle cx="50" cy="53" r="19" fill="#fcd34d" opacity="0.4" />
            <circle cx="50" cy="53" r="18" fill="#fed7aa" />
            {/* Óculos Dourados */}
            <circle cx="43" cy="51" r="6.5" fill="none" stroke="#d97706" strokeWidth="2" />
            <circle cx="57" cy="51" r="6.5" fill="none" stroke="#d97706" strokeWidth="2" />
            <line x1="49.5" y1="51" x2="50.5" y2="51" stroke="#d97706" strokeWidth="2" />
            <circle cx="43" cy="51" r="1.8" fill="#0f172a" />
            <circle cx="57" cy="51" r="1.8" fill="#0f172a" />
            {/* Sorriso Alegre */}
            <path d="M 44 61 Q 50 67 56 61" fill="none" stroke="#be123c" strokeWidth="2.5" strokeLinecap="round" />
            {/* Vestido Coral */}
            <path d="M 28 85 Q 50 75 72 85 L 75 100 L 25 100 Z" fill="#fb7185" />
          </g>
        )}

        {/* 4. Vovô Beto: Chapéu de palha e suspensório */}
        {playerId === 'beto' && (
          <g>
            <circle cx="50" cy="50" r="48" fill="#fef3c7" />
            {/* Cabelo e Rosto */}
            <circle cx="50" cy="54" r="19" fill="#fed7aa" />
            {/* Chapéu de Palha */}
            <ellipse cx="50" cy="38" rx="28" ry="8" fill="#d97706" />
            <path d="M 34 38 Q 36 22 50 22 Q 64 22 66 38 Z" fill="#f59e0b" />
            <path d="M 35 36 Q 50 34 65 36" stroke="#b45309" strokeWidth="3" fill="none" />
            {/* Óculos */}
            <rect x="37" y="47" width="11" height="9" rx="3" fill="none" stroke="#475569" strokeWidth="2" />
            <rect x="52" y="47" width="11" height="9" rx="3" fill="none" stroke="#475569" strokeWidth="2" />
            <line x1="48" y1="51" x2="52" y2="51" stroke="#475569" strokeWidth="2" />
            <circle cx="42.5" cy="51.5" r="1.8" fill="#0f172a" />
            <circle cx="57.5" cy="51.5" r="1.8" fill="#0f172a" />
            {/* Sorriso */}
            <path d="M 45 63 Q 50 67 55 63" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />
            {/* Camisa Amarela + Suspensório Azul */}
            <path d="M 26 86 Q 50 76 74 86 L 76 100 L 24 100 Z" fill="#fef08a" />
            <rect x="36" y="80" width="5" height="20" fill="#1e40af" />
            <rect x="59" y="80" width="5" height="20" fill="#1e40af" />
          </g>
        )}

        {/* 5. Dona Darcy: Cabelo chanel e óculos gatinho */}
        {playerId === 'darcy' && (
          <g>
            <circle cx="50" cy="50" r="48" fill="#ecfdf5" />
            {/* Cabelo Chanel */}
            <path d="M 27 55 Q 26 30 50 30 Q 74 30 73 55 Q 70 70 65 65 Q 60 38 50 38 Q 40 38 35 65 Q 30 70 27 55 Z" fill="#64748b" />
            {/* Rosto */}
            <circle cx="50" cy="52" r="18" fill="#fed7aa" />
            {/* Óculos Gatinho Verde */}
            <path d="M 37 45 L 48 48 L 46 54 L 36 50 Z" fill="none" stroke="#059669" strokeWidth="2.2" />
            <path d="M 63 45 L 52 48 L 54 54 L 64 50 Z" fill="none" stroke="#059669" strokeWidth="2.2" />
            <line x1="48" y1="49" x2="52" y2="49" stroke="#059669" strokeWidth="2" />
            <circle cx="42" cy="50" r="2" fill="#0f172a" />
            <circle cx="58" cy="50" r="2" fill="#0f172a" />
            <path d="M 45 61 Q 50 66 55 61" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
            {/* Echarpe Verde Esmeralda */}
            <path d="M 28 85 Q 50 75 72 85 L 75 100 L 25 100 Z" fill="#10b981" />
          </g>
        )}

        {/* 6. Seu Manoel: Cabelo branco penteado para trás e camisa listrada */}
        {playerId === 'manoel' && (
          <g>
            <circle cx="50" cy="50" r="48" fill="#f0f9ff" />
            {/* Cabelo Grisalho penteado */}
            <path d="M 30 45 Q 32 26 50 26 Q 68 26 70 45 Z" fill="#e2e8f0" />
            <circle cx="50" cy="53" r="19" fill="#fed7aa" />
            {/* Sobrancelhas grossas */}
            <rect x="38" y="44" width="9" height="3" rx="1.5" fill="#94a3b8" />
            <rect x="53" y="44" width="9" height="3" rx="1.5" fill="#94a3b8" />
            <circle cx="42.5" cy="50" r="2.2" fill="#0f172a" />
            <circle cx="57.5" cy="50" r="2.2" fill="#0f172a" />
            <path d="M 44 61 Q 50 66 56 61" fill="none" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" />
            {/* Camisa Listrada Azul */}
            <path d="M 26 86 Q 50 76 74 86 L 76 100 L 24 100 Z" fill="#0284c7" />
            <line x1="38" y1="80" x2="38" y2="100" stroke="#ffffff" strokeWidth="2.5" />
            <line x1="50" y1="78" x2="50" y2="100" stroke="#ffffff" strokeWidth="2.5" />
            <line x1="62" y1="80" x2="62" y2="100" stroke="#ffffff" strokeWidth="2.5" />
          </g>
        )}

        {/* 7. Dona Francisca: Trancinhas com fitas amarelas */}
        {playerId === 'francisca' && (
          <g>
            <circle cx="50" cy="50" r="48" fill="#fff7ed" />
            {/* Cabelo e Tranças */}
            <circle cx="50" cy="44" r="22" fill="#94a3b8" />
            {/* Trança Esquerda */}
            <rect x="25" y="45" width="8" height="22" rx="4" fill="#cbd5e1" />
            <circle cx="29" cy="67" r="3.5" fill="#eab308" />
            {/* Trança Direita */}
            <rect x="67" y="45" width="8" height="22" rx="4" fill="#cbd5e1" />
            <circle cx="71" cy="67" r="3.5" fill="#eab308" />
            {/* Rosto */}
            <circle cx="50" cy="51" r="18" fill="#fed7aa" />
            <circle cx="43" cy="49" r="2" fill="#0f172a" />
            <circle cx="57" cy="49" r="2" fill="#0f172a" />
            <path d="M 44 59 Q 50 66 56 59" fill="none" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="38" cy="54" r="3.5" fill="#fdba74" opacity="0.6" />
            <circle cx="62" cy="54" r="3.5" fill="#fdba74" opacity="0.6" />
            {/* Vestido Laranja */}
            <path d="M 28 85 Q 50 75 72 85 L 75 100 L 25 100 Z" fill="#f97316" />
          </g>
        )}

        {/* 8. Vovô Geraldo: Radinho de pilha e sorriso largo */}
        {playerId === 'geraldo' && (
          <g>
            <circle cx="50" cy="50" r="48" fill="#eef2ff" />
            {/* Cabelo e Rosto */}
            <circle cx="34" cy="50" r="7" fill="#cbd5e1" />
            <circle cx="66" cy="50" r="7" fill="#cbd5e1" />
            <circle cx="50" cy="52" r="19" fill="#fed7aa" />
            {/* Óculos Metálicos */}
            <circle cx="43" cy="50" r="6" fill="none" stroke="#64748b" strokeWidth="2" />
            <circle cx="57" cy="50" r="6" fill="none" stroke="#64748b" strokeWidth="2" />
            <line x1="49" y1="50" x2="51" y2="50" stroke="#64748b" strokeWidth="2" />
            <circle cx="43" cy="50" r="1.8" fill="#0f172a" />
            <circle cx="57" cy="50" r="1.8" fill="#0f172a" />
            {/* Sorriso Largo */}
            <path d="M 42 60 Q 50 68 58 60" fill="none" stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round" />
            {/* Camisa Indigo com Radinho pendurado */}
            <path d="M 26 86 Q 50 76 74 86 L 76 100 L 24 100 Z" fill="#4f46e5" />
            {/* Radinho no peito */}
            <rect x="54" y="78" width="10" height="14" rx="2" fill="#d97706" />
            <circle cx="59" cy="83" r="2.5" fill="#fef3c7" />
          </g>
        )}

        {/* 9. Dona Neusa: Lencinho charmoso de bolinhas */}
        {playerId === 'neusa' && (
          <g>
            <circle cx="50" cy="50" r="48" fill="#fdf2f8" />
            {/* Penteado Volumoso */}
            <path d="M 28 50 Q 28 28 50 28 Q 72 28 72 50 Q 64 36 50 36 Q 36 36 28 50 Z" fill="#94a3b8" />
            <circle cx="50" cy="51" r="18" fill="#fed7aa" />
            {/* Brincos Rosas */}
            <circle cx="31" cy="55" r="3" fill="#db2777" />
            <circle cx="69" cy="55" r="3" fill="#db2777" />
            <circle cx="43" cy="49" r="2" fill="#0f172a" />
            <circle cx="57" cy="49" r="2" fill="#0f172a" />
            <path d="M 44 60 Q 50 66 56 60" fill="none" stroke="#be185d" strokeWidth="2.5" strokeLinecap="round" />
            {/* Lencinho Rosa de Bolinhas */}
            <path d="M 36 73 Q 50 78 64 73 L 50 86 Z" fill="#ec4899" />
            <circle cx="46" cy="76" r="1.5" fill="#ffffff" />
            <circle cx="54" cy="76" r="1.5" fill="#ffffff" />
            <circle cx="50" cy="81" r="1.5" fill="#ffffff" />
            <path d="M 28 86 Q 50 76 72 86 L 75 100 L 25 100 Z" fill="#db2777" />
          </g>
        )}

        {/* 10. Seu Antenor: Boina verde e cavanhaque branco */}
        {playerId === 'antenor' && (
          <g>
            <circle cx="50" cy="50" r="48" fill="#f0fdf4" />
            <circle cx="50" cy="53" r="19" fill="#fed7aa" />
            {/* Boina Verde */}
            <ellipse cx="50" cy="35" rx="25" ry="11" fill="#15803d" />
            <ellipse cx="52" cy="33" rx="19" ry="9" fill="#16a34a" />
            <circle cx="43" cy="49" r="2.2" fill="#0f172a" />
            <circle cx="57" cy="49" r="2.2" fill="#0f172a" />
            {/* Cavanhaque Branco */}
            <ellipse cx="50" cy="65" rx="6" ry="6" fill="#f8fafc" />
            <path d="M 45 59 Q 50 63 55 59" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" />
            {/* Camisa Verde Escuro */}
            <path d="M 26 86 Q 50 76 74 86 L 76 100 L 24 100 Z" fill="#14532d" />
          </g>
        )}
      </svg>
    </div>
  );
}
