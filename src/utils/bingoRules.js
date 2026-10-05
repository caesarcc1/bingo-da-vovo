// Regras do Bingo Tradicional de 75 Bolas com Novos Padrões de Vitória

/**
 * Embaralha um array aleatoriamente
 */
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Gera números aleatórios únicos em um intervalo [min, max]
 */
function getRandomSample(min, max, count) {
  const pool = [];
  for (let i = min; i <= max; i++) pool.push(i);
  return shuffle(pool).slice(0, count);
}

/**
 * Cria uma nova cartela 5x5 tradicional
 */
export function generateBingoCard() {
  const colB = getRandomSample(1, 15, 5).sort((a, b) => a - b);
  const colI = getRandomSample(16, 30, 5).sort((a, b) => a - b);
  const colN = getRandomSample(31, 45, 4).sort((a, b) => a - b); // centro é livre
  const colG = getRandomSample(46, 60, 5).sort((a, b) => a - b);
  const colO = getRandomSample(61, 75, 5).sort((a, b) => a - b);

  colN.splice(2, 0, null);

  const columns = [
    { letter: 'B', numbers: colB },
    { letter: 'I', numbers: colI },
    { letter: 'N', numbers: colN },
    { letter: 'G', numbers: colG },
    { letter: 'O', numbers: colO }
  ];

  const grid = [];
  for (let r = 0; r < 5; r++) {
    const row = [];
    for (let c = 0; c < 5; c++) {
      const isFree = r === 2 && c === 2;
      const num = isFree ? null : columns[c].numbers[r];
      row.push({
        id: `cell-${r}-${c}`,
        number: num,
        letter: columns[c].letter,
        isFree,
        row: r,
        col: c
      });
    }
    grid.push(row);
  }

  return grid;
}

/**
 * Cria a sequência completa de bolas do globo (1 a 75) embaralhadas
 */
export function generateDrawDeck() {
  const deck = [];
  for (let i = 1; i <= 75; i++) {
    deck.push(i);
  }
  return shuffle(deck);
}

/**
 * Verifica condições de vitória na cartela:
 * - Linhas horizontais (qualquer uma das 5)
 * - Linhas verticais / colunas (qualquer uma das 5)
 * - Diagonais (Principal \ ou Secundária /)
 * - Quatro Pontas (os 4 cantos da cartela)
 * - Cartela Cheia (opcional)
 */
export function checkBingoWins(grid, markedCellIds) {
  const isMarked = (cell) => cell.isFree || markedCellIds.has(cell.id);

  const completedRows = [];
  const completedCols = [];
  const completedDiagonals = [];
  const winningCellIds = new Set();

  // 1. Checar Linhas Horizontais
  for (let r = 0; r < 5; r++) {
    const rowComplete = grid[r].every(cell => isMarked(cell));
    if (rowComplete) {
      completedRows.push(r);
      grid[r].forEach(c => winningCellIds.add(c.id));
    }
  }

  // 2. Checar Colunas Verticais
  for (let c = 0; c < 5; c++) {
    let colComplete = true;
    for (let r = 0; r < 5; r++) {
      if (!isMarked(grid[r][c])) {
        colComplete = false;
        break;
      }
    }
    if (colComplete) {
      completedCols.push(c);
      for (let r = 0; r < 5; r++) winningCellIds.add(grid[r][c].id);
    }
  }

  // 3. Diagonal Principal (\)
  let diag1 = true;
  for (let i = 0; i < 5; i++) {
    if (!isMarked(grid[i][i])) {
      diag1 = false;
      break;
    }
  }
  if (diag1) {
    completedDiagonals.push(0);
    for (let i = 0; i < 5; i++) winningCellIds.add(grid[i][i].id);
  }

  // 4. Diagonal Secundária (/)
  let diag2 = true;
  for (let i = 0; i < 5; i++) {
    if (!isMarked(grid[i][4 - i])) {
      diag2 = false;
      break;
    }
  }
  if (diag2) {
    completedDiagonals.push(1);
    for (let i = 0; i < 5; i++) winningCellIds.add(grid[i][4 - i].id);
  }

  // 5. As Quatro Pontas (cantos [0,0], [0,4], [4,0], [4,4])
  const corners = [grid[0][0], grid[0][4], grid[4][0], grid[4][4]];
  const completedFourCorners = corners.every(c => isMarked(c));
  if (completedFourCorners) {
    corners.forEach(c => winningCellIds.add(c.id));
  }

  // Cartela Cheia
  let fullCard = true;
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (!isMarked(grid[r][c])) {
        fullCard = false;
        break;
      }
    }
    if (!fullCard) break;
  }

  // É Bingo se completou qualquer linha, coluna, diagonal ou quatro pontas!
  const isBingo = completedRows.length > 0 ||
                  completedCols.length > 0 ||
                  completedDiagonals.length > 0 ||
                  completedFourCorners ||
                  fullCard;

  let patternDescription = '';
  if (fullCard) patternDescription = 'Cartela Cheia';
  else if (completedFourCorners) patternDescription = 'Quatro Pontas';
  else if (completedDiagonals.length > 0) patternDescription = 'Diagonal';
  else if (completedCols.length > 0) patternDescription = 'Coluna';
  else if (completedRows.length > 0) patternDescription = 'Linha Horizontal';

  return {
    isBingo,
    patternDescription,
    winningCellIds,
    completedRows,
    completedCols,
    completedDiagonals,
    completedFourCorners,
    fullCard
  };
}
