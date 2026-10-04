# 👵 Bingo da Vovó (PWA para Tablet)

Um aplicativo de Bingo simples, acolhedor e 100% acessível, desenvolvido sob medida para uma senhora de 96 anos jogar em seu tablet sem propagandas, sem compras e sem frustrações com toques involuntários.

🔗 **Repositório GitHub**: [https://github.com/caesarcc1/bingo-da-vovo](https://github.com/caesarcc1/bingo-da-vovo)

---

## ✨ Principais Funcionalidades

1. **Cartela Única com Números Gigantes**:
   - Padrão tradicional de 75 bolas (B-I-N-G-O) com grade 5x5 e casa central livre.
   - Tipografia extragrande com contraste ideal para leitura confortável mesmo a certa distância.
2. **Marcador de Feijãozinho Nostálgico**:
   - Toque na cartela com visual clássico de feijãozinho 3D e som orgânico suave (*pop*).
   - Somente permite marcar números que já foram sorteados no globo para evitar confusão.
3. **Narração Didática em Voz Alta (Português do Brasil)**:
   - Locução pausada: *"Letra B... número 12! Doze! Um e dois!"*.
   - Botão **Repetir Voz** para ouvir a pedra atual novamente quantas vezes quiser.
4. **Musiquinhas de Fundo Relaxantes**:
   - Trilhas sonoras suaves (Calma, Alegre e Clássica) geradas via Web Audio API, com controle de volume e botão de silenciamento.
   - *Audio Ducking*: o volume da música abaixa automaticamente enquanto a voz do locutor anuncia a pedra.
5. **Blindagem contra Fechamento Acidental do Tablet**:
   - **PWA Instalável**: Funciona em tela cheia (`display: standalone`) sem abas de navegador nem barra de endereços.
   - **Screen Wake Lock**: Mantém a tela do tablet sempre acesa sem apagar por inatividade.
   - **Trava da Vovó**: O botão de reiniciar ou começar nova cartela exige segurar por 3 segundos para evitar perdas acidentais de partidas.
   - **Bloqueio de Gestos e Zoom**: Prevenção ativa de pinça e toques múltiplos rápidos que desconfiguram o layout.
   - **Guia da Família**: Tutorial integrado ensinando a ativar a **Fixação de App** (App Pinning) nativa do Android para bloquear o tablet 100% no jogo.

---

## 🚀 Como Hospedar no Vercel em 1 Minuto

1. Acesse [vercel.com](https://vercel.com) e faça login com sua conta GitHub (**caesarcc1**).
2. Clique em **"Add New..."** → **"Project"**.
3. Selecione o repositório **`bingo-da-vovo`**.
4. Deixe as configurações padrão detectadas (Framework Preset: **Vite**) e clique em **Deploy**.
5. Pronto! Em instantes você terá o link HTTPS permanente (ex: `https://bingo-da-vovo.vercel.app`).

---

## 📱 Como Instalar no Tablet Android da Vovó

1. Abra o link gerado pelo Vercel no navegador Google Chrome do tablet.
2. Toque nos **3 pontinhos (⋮)** no canto superior direito do Chrome.
3. Toque em **"Instalar aplicativo"** ou **"Adicionar à tela inicial"**.
4. Um ícone dourado do **Bingo da Vovó** será criado na tela principal do tablet.
5. *(Opcional / Recomendado)*: Ative a **Fixação de App** nas configurações de segurança do tablet para que nenhum gesto de arrastar feche o aplicativo.
