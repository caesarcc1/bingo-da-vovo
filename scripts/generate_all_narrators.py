import asyncio
import os
import edge_tts

# Mapeamento fonético dos números
NUMEROS_PT = {
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
}

def get_letter(num):
    if 1 <= num <= 15: return 'B'
    if 16 <= num <= 30: return 'I'
    if 31 <= num <= 45: return 'N'
    if 46 <= num <= 60: return 'G'
    if 61 <= num <= 75: return 'O'
    return ''

# 75 Apelidos Tradicionais de Quermesse (sem repetir o número)
QUERMESSE_BORDÕES = {
    1: "Começou o jogo! Ronco do porco!",
    2: "A comadre e o compadre!",
    3: "Prato de trigo pra três tigres!",
    4: "As quatro patas da mesa!",
    5: "O cachorro do vizinho!",
    6: "Meia dúzia de ovos!",
    7: "Pintou o sete na parede!",
    8: "Biscoito quentinho no café!",
    9: "Pingo no pé da noiva!",
    10: "Craque de bola no arraiá!",
    11: "Um atrás do outro, as pernas do Pelé!",
    12: "Uma dúzia fechada!",
    13: "Número da sorte, viva Santo Antônio!",
    14: "Véspera de pagamento!",
    15: "Valsa da debutante com o compadre!",
    16: "A mocidade no arraiá!",
    17: "O macaco sapeca!",
    18: "Maior de idade, tirou a carteira!",
    19: "Na pontinha do pé!",
    20: "Olho de boi na fazenda!",
    21: "No jogo de cartas!",
    22: "Dois patinhos na lagoa!",
    23: "Meia-noite e meia!",
    24: "Rapaz alegre no arraiá!",
    25: "Papai Noel no arraiá!",
    26: "Dia de Sant'Ana!",
    27: "O boi zebu!",
    28: "Dente do juízo!",
    29: "Dia de São Pedro!",
    30: "A liga da justiça!",
    31: "Noite de réveillon!",
    32: "Dentes na boca!",
    33: "A idade de Cristo!",
    34: "Pato no prato!",
    35: "Festa boa na roça!",
    36: "Três dúzias no capricho!",
    37: "Pula a fogueira, iaiá!",
    38: "A justiça de Goiás!",
    39: "Quase quarentão!",
    40: "Quarentena da comadre!",
    41: "Tá esquentando o bingo!",
    42: "Feijão com arroz!",
    43: "Olha a chuva... é mentira!",
    44: "Dois bicos de pato, quá quá quá!",
    45: "Fim do primeiro tempo!",
    46: "Milho assado na fogueira!",
    47: "Foguete no céu!",
    48: "Dia de feira livre!",
    49: "Quase cinquentão!",
    50: "Meio século de vida!",
    51: "Uma boa ideia na garrafa!",
    52: "Semanas do ano!",
    53: "A sanfona tá tocando bonito!",
    54: "Pé de moleque crocante!",
    55: "Dois portugueses numa perna só!",
    56: "Bolo de fubá quentinho!",
    57: "Dança da quadrilha!",
    58: "Pau de sebo escorregadio!",
    59: "Segura a emoção na cartela!",
    60: "Chegou no sessentão!",
    61: "Corre que o bingo tá perto!",
    62: "Viva São João festeiro!",
    63: "Cebola na panela de barro!",
    64: "Casas do tabuleiro de xadrez!",
    65: "O forró tá arretado de bom!",
    66: "Dois tapas atrás da orelha!",
    67: "Viva os noivos da roça!",
    68: "Tá pertinho de bater a cartela!",
    69: "Um pra cima e outro pra baixo!",
    70: "Setentão cheio de saúde!",
    71: "A tampa da chaleira!",
    72: "Quentão na caneca de barro!",
    73: "Quem vai gritar bingo primeiro?!",
    74: "Prepara a voz pro grito de bingo!",
    75: "Fim da linha, acabou o globo!"
}

# Bordões do Silvio Santos falando o número apenas 1 VEZ
SILVIO_PREFIXES = [
    "Má oee! Letra {L}... {N}! Vem pra cá, vem pra cá!",
    "Ha-hai! Letra {L}... {N}! É bom ou não é?!",
    "Quem quer dinheiro?! Letra {L}... {N}!",
    "Olha o aviãozinho! Letra {L}... {N}!",
    "Atenção auditório! Letra {L}... {N}!",
    "Certa resposta! Letra {L}... {N}!",
    "Rrrô-rô! Letra {L}... {N}! Vem pra cá!",
    "Quem vai ganhar no auditório?! Letra {L}... {N}! Ha-hai!"
]

def get_silvio_phrase(num):
    letter = get_letter(num)
    nome = NUMEROS_PT[num]
    if num == 10:
        return "Má oee! Letra B... Craque de bola, dez! Vem pra cá!"
    elif num == 12:
        return "Uma dúzia de dinheiro! Letra B... Doze! Vem pra cá, vem pra cá!"
    elif num == 22:
        return "Dois patinhos na lagoa! Letra I... Vinte e dois! Ha-hai!"
    elif num == 24:
        return "Rrrô-rô! Letra I... Vinte e quatro! Vem pra cá!"
    elif num == 33:
        return "A idade de Cristo! Letra N... Trinta e três! Certa resposta!"
    elif num == 50:
        return "Cinquenta barras de ouro! Letra G... Cinquenta! Quem quer dinheiro?!"
    elif num == 51:
        return "Uma boa ideia, hein auditório?! Letra G... Cinquenta e um! Ha-hai!"
    elif num == 75:
        return "Última pedra do globo! Letra O... Setenta e cinco! Quem vai bater bingo?!"
    else:
        template = SILVIO_PREFIXES[num % len(SILVIO_PREFIXES)]
        return template.format(L=letter, N=nome)

def get_quermesse_phrase(num):
    letter = get_letter(num)
    nome = NUMEROS_PT[num]
    bordao = QUERMESSE_BORDÕES.get(num, "")
    return f"Olha a pedra! Letra {letter}... {nome}! {bordao}"

SILVIO_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "audio", "silvio")
QUERMESSE_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "audio", "quermesse")

os.makedirs(SILVIO_DIR, exist_ok=True)
os.makedirs(QUERMESSE_DIR, exist_ok=True)

async def generate_ball(num, sem):
    async with sem:
        # Silvio Santos (número falado 1 única vez)
        silvio_file = os.path.join(SILVIO_DIR, f"{num}.mp3")
        silvio_text = get_silvio_phrase(num)
        comm_s = edge_tts.Communicate(silvio_text, "pt-BR-AntonioNeural", rate="+12%", pitch="+12Hz")
        await comm_s.save(silvio_file)
        
        # Quermesse (número falado 1 única vez)
        quermesse_file = os.path.join(QUERMESSE_DIR, f"{num}.mp3")
        quermesse_text = get_quermesse_phrase(num)
        comm_q = edge_tts.Communicate(quermesse_text, "pt-BR-AntonioNeural", rate="+6%", pitch="+0Hz")
        await comm_q.save(quermesse_file)
        
        print(f"Pedra {num}/75 gerada (1x): {num}")

async def main():
    sem = asyncio.Semaphore(6)
    tasks = [generate_ball(num, sem) for num in range(1, 76)]
    await asyncio.gather(*tasks)
    print("TODOS os áudios de Silvio e Quermesse regerados sem repetição!")

if __name__ == "__main__":
    asyncio.run(main())
