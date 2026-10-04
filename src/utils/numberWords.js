// Utilitário para conversão didática de números e narração do Bingo em Português

const NUMEROS_PT = {
  1: 'um', 2: 'dois', 3: 'três', 4: 'quatro', 5: 'cinco',
  6: 'seis', 7: 'sete', 8: 'oito', 9: 'nove', 10: 'dez',
  11: 'onze', 12: 'doze', 13: 'treze', 14: 'quatorze', 15: 'quinze',
  16: 'dezesseis', 17: 'dezessete', 18: 'dezoito', 19: 'dezenove', 20: 'vinte',
  21: 'vinte e um', 22: 'vinte e dois', 23: 'vinte e três', 24: 'vinte e quatro', 25: 'vinte e cinco',
  26: 'vinte e seis', 27: 'vinte e sete', 28: 'vinte e oito', 29: 'vinte e nove', 30: 'trinta',
  31: 'trinta e um', 32: 'trinta e dois', 33: 'trinta e três', 34: 'trinta e quatro', 35: 'trinta e cinco',
  36: 'trinta e seis', 37: 'trinta e sete', 38: 'trinta e oito', 39: 'trinta e nove', 40: 'quarenta',
  41: 'quarenta e um', 42: 'quarenta e dois', 43: 'quarenta e três', 44: 'quarenta e quatro', 45: 'quarenta e cinco',
  46: 'quarenta e seis', 47: 'quarenta e sete', 48: 'quarenta e oito', 49: 'quarenta e nove', 50: 'cinquenta',
  51: 'cinquenta e um', 52: 'cinquenta e dois', 53: 'cinquenta e três', 54: 'cinquenta e quatro', 55: 'cinquenta e cinco',
  56: 'cinquenta e seis', 57: 'cinquenta e sete', 58: 'cinquenta e oito', 59: 'cinquenta e nove', 60: 'sessenta',
  61: 'sessenta e um', 62: 'sessenta e dois', 63: 'sessenta e três', 64: 'sessenta e quatro', 65: 'sessenta e cinco',
  66: 'sessenta e seis', 67: 'sessenta e sete', 68: 'sessenta e oito', 69: 'sessenta e nove', 70: 'setenta',
  71: 'setenta e um', 72: 'setenta e dois', 73: 'setenta e três', 74: 'setenta e quatro', 75: 'setenta e cinco'
};

const DIGITOS_PT = {
  '0': 'zero',
  '1': 'um',
  '2': 'dois',
  '3': 'três',
  '4': 'quatro',
  '5': 'cinco',
  '6': 'seis',
  '7': 'sete',
  '8': 'oito',
  '9': 'nove'
};

/**
 * Retorna a coluna/letra do bingo para um número de 1 a 75
 */
export function getBingoLetter(num) {
  if (num >= 1 && num <= 15) return 'B';
  if (num >= 16 && num <= 30) return 'I';
  if (num >= 31 && num <= 45) return 'N';
  if (num >= 46 && num <= 60) return 'G';
  if (num >= 61 && num <= 75) return 'O';
  return '';
}

/**
 * Cores temáticas bem contrastantes para cada letra do B-I-N-G-O
 */
export const BINGO_COLORS = {
  B: {
    bg: 'bg-blue-600',
    text: 'text-blue-700',
    border: 'border-blue-500',
    light: 'bg-blue-50',
    ring: 'ring-blue-400',
    badge: '#2563eb'
  },
  I: {
    bg: 'bg-red-600',
    text: 'text-red-700',
    border: 'border-red-500',
    light: 'bg-red-50',
    ring: 'ring-red-400',
    badge: '#dc2626'
  },
  N: {
    bg: 'bg-emerald-600',
    text: 'text-emerald-700',
    border: 'border-emerald-500',
    light: 'bg-emerald-50',
    ring: 'ring-emerald-400',
    badge: '#059669'
  },
  G: {
    bg: 'bg-amber-600',
    text: 'text-amber-700',
    border: 'border-amber-500',
    light: 'bg-amber-50',
    ring: 'ring-amber-400',
    badge: '#d97706'
  },
  O: {
    bg: 'bg-purple-600',
    text: 'text-purple-700',
    border: 'border-purple-500',
    light: 'bg-purple-50',
    ring: 'ring-purple-400',
    badge: '#9333ea'
  }
};

/**
 * Gera a frase completa e didática para narração em voz alta
 * Ex: "Letra B... número doze! Doze! Um e dois!"
 */
export function getNarrationPhrase(num) {
  const letter = getBingoLetter(num);
  const nome = NUMEROS_PT[num] || String(num);
  
  if (num < 10) {
    return `Letra ${letter}... número ${num}! ${nome}!`;
  }
  
  const digitos = String(num).split('').map(d => DIGITOS_PT[d]).join(' e ');
  return `Letra ${letter}... número ${num}! ${nome}! ${digitos}!`;
}
