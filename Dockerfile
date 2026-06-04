# ===========================================================
# StreamKar Training Bot — Single Container
# ===========================================================
# Build:  docker build -t streamkar .
# Run:    docker run -p 3000:3000 --env-file backend/.env streamkar
# Open:   http://localhost:3000
# ===========================================================

# ---- Stage 1: Build React Frontend ----
FROM node:20-alpine AS frontend-build

WORKDIR /frontend

COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci --silent

COPY frontend/ .
RUN npm run build


# ---- Stage 2: Final Image (Python + Nginx) ----
FROM python:3.12-slim

# Install nginx and supervisor
RUN apt-get update && \
    apt-get install -y --no-install-recommends nginx supervisor && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/main.py backend/main_tfidf.py backend/faqs.json ./
COPY backend/static/ ./static/

# Copy built React frontend
COPY --from=frontend-build /frontend/dist /var/www/html

# Nginx config
COPY frontend/nginx.conf /etc/nginx/sites-available/default

# Supervisor config (runs all 3 processes)
RUN cat > /etc/supervisor/conf.d/streamkar.conf <<'EOF'
[supervisord]
nodaemon=true
logfile=/dev/stdout
logfile_maxbytes=0

[program:rag-backend]
command=python /app/main.py
directory=/app
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0

[program:tfidf-backend]
command=python /app/main_tfidf.py
directory=/app
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0

[program:nginx]
command=nginx -g "daemon off;"
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
EOF

EXPOSE 3000

CMD ["supervisord", "-c", "/etc/supervisor/supervisord.conf"]
