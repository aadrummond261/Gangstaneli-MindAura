# Gangstaneli MindAura

Gangstaneli MindAura is a mental wellness app with mood tracking, aura feedback,
AI chat, medication tracking, profile media capture, routines, support contacts,
therapy links, and a Spring Boot SQLite backend.

## Project Name

Deployment name: `gangstaneli-mindaura`

Expected personal-site URL after creating the Render services:

```text
https://gangstaneli-mindaura.onrender.com
```

Expected backend URL:

```text
https://gangstaneli-mindaura-api.onrender.com
```

## Local Development

Start the frontend:

```bash
npm install
npm run dev
```

Start the backend:

```bash
cd Backend
mvn spring-boot:run
```

The backend uses SQLite at `Backend/data/mindaura.db`.

## Environment

Frontend:

```bash
VITE_API_BASE_URL=http://localhost:8080
```

Backend:

```bash
PORT=8080
OPENAI_API_KEY=your_openai_key
SQLITE_DATABASE_URL=jdbc:sqlite:data/mindaura.db
```

`OPENAI_API_KEY` is optional. Without it, the frontend AI chat falls back to
local supportive responses.

## Docker Deployment

Run the full app under the project name:

```bash
docker compose up --build
```

Frontend:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:8080
```

The Docker volume `gangstaneli-mindaura-data` keeps the SQLite database
persistent across container restarts.

## Render Deployment

This repo includes `render.yaml` at the GitHub repo root with service names
based on the project name:

- `gangstaneli-mindaura`
- `gangstaneli-mindaura-api`

In Render, create a new Blueprint from the repo root. The public URL will not
exist until Render finishes creating the services. Set `OPENAI_API_KEY` on the
backend service if you want live OpenAI chat. The frontend is configured to call:

```text
https://gangstaneli-mindaura-api.onrender.com
```

## Production Build Checks

Frontend:

```bash
npm run lint
npm run build
```

Backend:

```bash
cd Backend
mvn test
```
