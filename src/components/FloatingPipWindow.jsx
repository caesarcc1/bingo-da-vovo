import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Layers } from 'lucide-react';
import { getBingoLetter, BINGO_COLORS } from '../utils/numberWords';

export function FloatingPipWindow({
  currentBall,
  card,
  markedCellIds = new Set(),
  roomUsers = [],
  isAutoMark = false
}) {
  const [isPipActive, setIsPipActive] = useState(false);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // 1. Fundo Escuro Moderno
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Desenhar Bola Atual no lado esquerdo
    const letter = currentBall ? getBingoLetter(currentBall) : '-';
    const color = currentBall && BINGO_COLORS[letter] ? BINGO_COLORS[letter].badge : '#475569';

    // Círculo da bola
    ctx.beginPath();
    ctx.arc(60, 75, 45, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // Letra
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(letter, 60, 52);

    // Número
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(60, 80, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px system-ui';
    ctx.fillText(currentBall ? String(currentBall) : '?', 60, 88);

    // Status de Auto-marcação
    ctx.fillStyle = isAutoMark ? '#10b981' : '#94a3b8';
    ctx.font = 'bold 11px system-ui';
    ctx.fillText(isAutoMark ? '⚡ Auto-Marcar Ativo' : 'Manual', 60, 138);

    // 3. Desenhar Mini-Cartela 5x5 no lado direito
    const startX = 135;
    const startY = 20;
    const cellSize = 22;
    const gap = 3;

    if (card && card.length === 5) {
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
          const cell = card[r][c];
          const x = startX + c * (cellSize + gap);
          const y = startY + r * (cellSize + gap);
          const isMarked = cell.isFree || (markedCellIds && markedCellIds.has(cell.id));

          // Célula
          ctx.fillStyle = isMarked ? '#b45309' : '#1e293b';
          ctx.strokeStyle = isMarked ? '#f59e0b' : '#334155';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(x, y, cellSize, cellSize, 4);
          ctx.fill();
          ctx.stroke();

          // Número mini
          ctx.fillStyle = isMarked ? '#ffffff' : '#94a3b8';
          ctx.font = 'bold 9px system-ui';
          ctx.textAlign = 'center';
          if (cell.isFree) {
            ctx.fillText('❤', x + cellSize / 2, y + 15);
          } else {
            ctx.fillText(String(cell.number), x + cellSize / 2, y + 15);
          }
        }
      }
    }

    // 4. Rodapé do PiP: Quem está falando
    const speaker = roomUsers.find(u => u.isSpeaking);
    ctx.fillStyle = speaker ? '#22c55e' : '#64748b';
    ctx.font = 'bold 11px system-ui';
    ctx.textAlign = 'left';
    ctx.fillText(speaker ? `🎙️ ${speaker.name} falando...` : '🔇 Silêncio na sala', 16, 162);
  }, [currentBall, card, markedCellIds, roomUsers, isAutoMark]);

  // Renderiza continuamente APENAS se a janela flutuante estiver ativa
  useEffect(() => {
    if (!isPipActive) return;

    let animId;
    const loop = () => {
      drawFrame();
      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPipActive, drawFrame]);

  // Ativar ou desativar Picture-in-Picture nativo
  const togglePip = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPipActive(false);
      } else {
        drawFrame();
        if (!video.srcObject) {
          const stream = canvas.captureStream(15);
          video.srcObject = stream;
          await video.play();
        }
        await video.requestPictureInPicture();
        setIsPipActive(true);
      }
    } catch (err) {
      console.warn('Picture-in-Picture não suportado ou negado pelo navegador:', err);
    }
  };

  return (
    <div className="flex items-center">
      <canvas
        ref={canvasRef}
        width={270}
        height={175}
        className="hidden"
      />
      <video
        ref={videoRef}
        muted
        playsInline
        className="hidden"
        onLeavePictureInPicture={() => setIsPipActive(false)}
      />

      <button
        onClick={togglePip}
        type="button"
        className={`
          flex items-center gap-1.5 px-3 py-2 rounded-2xl font-black text-xs sm:text-sm border shadow-md transition-all active:scale-95
          ${isPipActive
            ? 'bg-amber-500 text-slate-950 border-amber-400'
            : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-600'
          }
        `}
        title="Abrir Janela Flutuante sobre outros aplicativos"
      >
        <Layers className="w-4 h-4" />
        <span>{isPipActive ? 'Janela Ativa' : 'Janela Flutuante'}</span>
      </button>
    </div>
  );
}
