# ==============================================================================
# Multi-stage Dockerfile para MandatoGov (Frontend React + Vite + Tailwind + TypeScript)
# ==============================================================================

# Estágio 1: Build da aplicação
FROM node:20-alpine AS builder

WORKDIR /app

# Instala dependências
COPY package*.json ./
RUN npm ci || npm install

# Copia código-fonte e compila para produção
COPY . .

# Argumentos de ambiente em tempo de build (caso necessários pelo Vite)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

RUN npm run build

# ==============================================================================
# Estágio 2: Imagem leve Nginx para servir os arquivos estáticos compilados
# ==============================================================================
FROM nginx:alpine AS runner

# Remove configuração padrão do Nginx
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copia a configuração customizada do Nginx com SPA fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos compilados do estágio anterior
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
