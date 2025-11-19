# Guía de Despliegue – Proyecto WalunHub (Django + React) usando Docker en un VPS

Este documento describe el proceso de despliegue de un proyecto compuesto por **Django (backend)** y **React + TypeScript (frontend)** utilizando **Docker y Docker Compose** en un servidor VPS.  
La base de datos utilizada es la que viene por defecto con Django (SQLite).

---

## 1. Requisitos del Servidor

Para poder desplegar el proyecto, el servidor debe tener instalados:

- Docker  
- Docker Compose  
- Git  

Instalación recomendada:

```bash
sudo apt update
sudo apt install docker.io docker-compose git -y
````

Verificar:

```bash
docker --version
docker-compose --version
```

---

## 2. Estructura del Proyecto

La estructura del repositorio debe ser similar a la siguiente:

```
ecommerce/
│
├── back/               # Backend Django
│   ├── Dockerfile
│   ├── manage.py
│   ├── requirements.txt
│   └── proyecto/       # Código del backend
│
├── front/              # Frontend React
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│
├── nginx/
│   └── default.conf    # Configuración de Nginx
│
└── docker-compose.yml
```

---

## 3. Dockerfile del Backend (Django)

Archivo ubicado en `back/Dockerfile`:

```dockerfile
FROM python:3.13-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["gunicorn", "proyecto.wsgi:application", "--bind", "0.0.0.0:8000"]
```

---

## 4. Dockerfile del Frontend (React)

Archivo ubicado en `front/Dockerfile`:

```dockerfile
FROM node:18 as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:latest
COPY --from=build /app/dist /usr/share/nginx/html
```

*(Si se usa Create React App, reemplazar `dist` por `build`.)*

---

## 5. Configuración de Nginx

Archivo `nginx/default.conf`:

```nginx
server {
    listen 80;

    # FRONTEND
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    # BACKEND (Django)
    location /api/ {
        proxy_pass http://backend:8000/api/;
    }
}
```

---

## 6. Archivo docker-compose.yml

Archivo en la raíz del proyecto:

```yaml
version: "3.9"

services:

  backend:
    build: ./back
    container_name: ecommerce-back
    command: gunicorn proyecto.wsgi:application --bind 0.0.0.0:8000
    volumes:
      - ./back:/app
    env_file:
      - ./back/.env
    ports:
      - "8000:8000"

  frontend:
    build: ./front
    container_name: ecommerce-front
    ports:
      - "3000:80"
    depends_on:
      - backend

  nginx:
    image: nginx:latest
    container_name: ecommerce-nginx
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
    ports:
      - "80:80"
    depends_on:
      - backend
      - frontend
```

---

## 7. Variables de Entorno del Backend

Archivo `back/.env`:

```env
DEBUG=False
SECRET_KEY=tu-clave-secreta
ALLOWED_HOSTS=*
DATABASE_URL=sqlite:///db.sqlite3
```

---

## 8. Construcción y Despliegue del Proyecto

### Construir los contenedores

```bash
docker-compose build
```

### Levantar el proyecto

```bash
docker-compose up -d
```

### Ver el estado de los servicios

```bash
docker-compose ps
```

### Ver logs

```bash
docker-compose logs -f
```

---

## 9. Migraciones de Django

Aplicar migraciones dentro del contenedor:

```bash
docker-compose exec backend python manage.py migrate
```

Si es necesario crear nuevas migraciones:

```bash
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate
```

---

## 10. Acceso al Proyecto

* Frontend: `http://IP_DEL_SERVIDOR`
* Backend (API): `http://IP_DEL_SERVIDOR/api/`
* Django admin: `http://IP_DEL_SERVIDOR/api/admin/`

---

## 11. Actualización del Proyecto

En caso de actualizar el código:

```bash
git pull
docker-compose build
docker-compose up -d
```

---

## 12. Detener todos los servicios

```bash
docker-compose down
```

---
