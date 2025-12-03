# build vite
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# servește cu nginx și PROXY la /api
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

RUN printf 'server {\n\
  listen 80;\n\
  server_name _;\n\
  root /usr/share/nginx/html;\n\
  # SPA fallback\n\
  location / {\n\
    try_files $uri /index.html;\n\
  }\n\
  # PROXY pentru backend\n\
  location /api/ {\n\
    proxy_pass http://gateway-service:8080;\n\
    proxy_set_header Host $host;\n\
    proxy_set_header X-Real-IP $remote_addr;\n\
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n\
    proxy_set_header X-Forwarded-Proto $scheme;\n\
  }\n\
}\n' > /etc/nginx/conf.d/default.conf
