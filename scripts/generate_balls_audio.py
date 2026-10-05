import asyncio
import os
import edge_tts

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

VOICE = "pt-BR-FranciscaNeural"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "audio", "balls")

async def generate_single(num, sem):
    async with sem:
        letter = get_letter(num)
        nome = NUMEROS_PT[num]
        # Frase carinhosa e clara: "Letra B... doze! Doze!"
        text = f"Letra {letter}... {nome}! {nome}!"
        out_path = os.path.join(OUTPUT_DIR, f"{num}.mp3")
        
        communicate = edge_tts.Communicate(text, VOICE, rate="-5%", pitch="+0Hz")
        await communicate.save(out_path)
        print(f"Generated [{num}]: {text}")

async def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    sem = asyncio.Semaphore(5) # 5 concurrent requests
    tasks = [generate_single(num, sem) for num in range(1, 76)]
    await asyncio.gather(*tasks)
    print("Done generating all 75 bingo balls!")

if __name__ == "__main__":
    asyncio.run(main())
