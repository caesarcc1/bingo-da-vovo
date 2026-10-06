import asyncio
import os
import edge_tts

VOICE = "pt-BR-FranciscaNeural"
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "..", "public", "audio", "countdown.mp3")

async def generate():
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    # Frase com pausas naturais bem ritmadas
    text = "Preparar!... Três!... Dois!... Um!... Valendo! Boa sorte!"
    # Rate normal ou ligeiramente animado
    communicate = edge_tts.Communicate(text, VOICE, rate="+5%", pitch="+0Hz")
    await communicate.save(OUTPUT_FILE)
    print(f"Generated {OUTPUT_FILE} successfully!")

if __name__ == "__main__":
    asyncio.run(generate())
