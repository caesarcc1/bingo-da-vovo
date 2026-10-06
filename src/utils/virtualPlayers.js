// Galeria e motor de simulação dos 10 Jogadores Virtuais
import { generateBingoCard, checkBingoWins } from './bingoRules';

export const VIRTUAL_PLAYERS = [
  {
    id: 'lourdes',
    name: 'Dona Lourdes',
    title: 'A rainha do feijãozinho',
    avatarColor: '#9333ea',
    bgBadge: 'bg-purple-100 text-purple-800 border-purple-300'
  },
  {
    id: 'ze',
    name: 'Seu Zé',
    title: 'O campeão da boina',
    avatarColor: '#2563eb',
    bgBadge: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  {
    id: 'cecilia',
    name: 'Tia Cecília',
    title: 'Sempre com sua flor da sorte',
    avatarColor: '#e11d48',
    bgBadge: 'bg-rose-100 text-rose-800 border-rose-300'
  },
  {
    id: 'beto',
    name: 'Vovô Beto',
    title: 'De chapéu e suspensório',
    avatarColor: '#d97706',
    bgBadge: 'bg-amber-100 text-amber-800 border-amber-300'
  },
  {
    id: 'darcy',
    name: 'Dona Darcy',
    title: 'Elegância em cada número',
    avatarColor: '#059669',
    bgBadge: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  },
  {
    id: 'manoel',
    name: 'Seu Manoel',
    title: 'O quitandeiro de bom coração',
    avatarColor: '#0284c7',
    bgBadge: 'bg-sky-100 text-sky-800 border-sky-300'
  },
  {
    id: 'francisca',
    name: 'Dona Francisca',
    title: 'Mestre nos doces da quermesse',
    avatarColor: '#ea580c',
    bgBadge: 'bg-orange-100 text-orange-800 border-orange-300'
  },
  {
    id: 'geraldo',
    name: 'Vovô Geraldo',
    title: 'Com o radinho no ouvido',
    avatarColor: '#4f46e5',
    bgBadge: 'bg-indigo-100 text-indigo-800 border-indigo-300'
  },
  {
    id: 'neusa',
    name: 'Dona Neusa',
    title: 'Sempre de lencinho charmoso',
    avatarColor: '#db2777',
    bgBadge: 'bg-pink-100 text-pink-800 border-pink-300'
  },
  {
    id: 'antenor',
    name: 'Seu Antenor',
    title: 'O contador de causos',
    avatarColor: '#16a34a',
    bgBadge: 'bg-green-100 text-green-800 border-green-300'
  }
];

/**
 * Inicializa os competidores da rodada com cartelas próprias
 * Suporta quantidade customizável (padrão 5)
 */
export function initializeVirtualPlayers(count = 5) {
  const selected = VIRTUAL_PLAYERS.slice(0, Math.max(1, Math.min(count, VIRTUAL_PLAYERS.length)));
  return selected.map(player => {
    return {
      ...player,
      card: generateBingoCard(),
      markedCellIds: new Set(),
      hasWon: false,
      winPlace: null,
      winPattern: null
    };
  });
}

/**
 * Processa a pedra sorteada para todos os jogadores virtuais
 * Retorna os novos vencedores que bateram bingo nesta rodada
 */
export function processVirtualDraw(virtualPlayers, drawnBall, currentPodiumCount) {
  const newWinners = [];
  let availablePlace = currentPodiumCount + 1;

  if (availablePlace > 3) {
    return { updatedPlayers: virtualPlayers, newWinners };
  }

  const updatedPlayers = virtualPlayers.map(player => {
    if (player.hasWon) return player;

    // Verificar se o jogador tem a bola em sua cartela
    let foundCellId = null;
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (player.card[r][c].number === drawnBall) {
          foundCellId = player.card[r][c].id;
          break;
        }
      }
      if (foundCellId) break;
    }

    if (!foundCellId) return player;

    const newMarked = new Set(player.markedCellIds);
    newMarked.add(foundCellId);

    // Checar se bateu bingo (linha, coluna, diagonal ou 4 pontas)
    const winResult = checkBingoWins(player.card, newMarked);

    if (winResult.isBingo && availablePlace <= 3) {
      const winnerData = {
        ...player,
        markedCellIds: newMarked,
        hasWon: true,
        winPlace: availablePlace,
        winPattern: winResult.patternDescription
      };
      newWinners.push(winnerData);
      availablePlace++;
      return winnerData;
    }

    return {
      ...player,
      markedCellIds: newMarked
    };
  });

  return { updatedPlayers, newWinners };
}
