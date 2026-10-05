#!/bin/bash
# Script de deploy rápido no servidor Hetzner (178.156.222.232)
echo "👵 Iniciando Deploy do Servidor Bingo da Família na Hetzner..."

docker compose down
docker compose up -d --build

echo "✅ Servidor rodando com sucesso na porta 3001!"
echo "Teste de saúde: curl http://localhost:3001/health"
