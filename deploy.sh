#!/usr/bin/env bash
# ==============================================================================
# SCRIPT DE DEPLOY AUTOMATIZADO - MANDATOGOV NA VPS (/opt/mandato)
# Domínio: mandato.democracias.org
# ==============================================================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}======================================================================${NC}"
echo -e "${GREEN}🚀 INICIANDO DEPLOY DO MANDATOGOV (mandato.democracias.org)${NC}"
echo -e "${BLUE}======================================================================${NC}"

TARGET_DIR="/opt/mandato"

# 1. Cria diretório do projeto se não existir
if [ ! -d "$TARGET_DIR" ]; then
    echo -e "${YELLOW}📁 Criando diretório $TARGET_DIR...${NC}"
    sudo mkdir -p "$TARGET_DIR"
fi

cd "$TARGET_DIR"

# 2. Cria a rede Docker interna se não existir
if ! docker network ls | grep -q "mandato-net"; then
    echo -e "${YELLOW}🌐 Criando rede Docker 'mandato-net'...${NC}"
    docker network create mandato-net || true
else
    echo -e "${GREEN}✓ Rede 'mandato-net' já existe.${NC}"
fi

# Verifica se a rede do Traefik existe
if ! docker network ls | grep -q "traefik-ftjh"; then
    echo -e "${YELLOW}🌐 Criando rede Traefik 'traefik-ftjh'...${NC}"
    docker network create traefik-ftjh || true
else
    echo -e "${GREEN}✓ Rede 'traefik-ftjh' pronta.${NC}"
fi

# 3. Cria arquivo .env se não existir
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚙️  Criando .env a partir de .env.example...${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env
    else
        cat <<EOF > .env
DOMAIN=mandato.democracias.org
VITE_SUPABASE_URL=https://mandato.democracias.org
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mandatogov_anon_token_production
DB_PORT=5434
POSTGRES_DB=mandatodb
POSTGRES_USER=mandato_admin
POSTGRES_PASSWORD=mandato_secure_pass_2026
PGRST_PORT=3001
ADMINER_PORT=8085
EOF
    fi
    echo -e "${GREEN}✓ Arquivo .env gerado com sucesso.${NC}"
fi

# 4. Build e Start dos containers
echo -e "${YELLOW}🐳 Executando build e subindo containers via Docker Compose com Traefik...${NC}"
docker compose down || true
docker compose up -d --build

# 5. Aguarda saúde do banco de dados
echo -e "${YELLOW}⏳ Aguardando inicialização do banco de dados e migrações DDL...${NC}"
sleep 5
docker compose ps

echo -e "${BLUE}======================================================================${NC}"
echo -e "${GREEN}✅ DEPLOY CONCLUÍDO COM SUCESSO NO TRAEFIK!${NC}"
echo -e "${BLUE}======================================================================${NC}"
echo -e "Acesse seu sistema diretamente em:"
echo -e "  🔗 https://mandato.democracias.org"
echo -e "${BLUE}======================================================================${NC}"
