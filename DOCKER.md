# Docker Setup for Keerthi Portfolio

This document explains how to run the portfolio using Docker.

## Prerequisites

- Docker installed on your machine
- Docker Compose installed

## Quick Start

### Development Mode (with hot reload)

```bash
# Start development server
docker-compose --profile dev up

# Or build and start
docker-compose --profile dev up --build
```

Access the app at: `http://localhost:3000`

### Production Mode

```bash
# Start production server
docker-compose --profile prod up

# Or build and start
docker-compose --profile prod up --build

# Run in detached mode
docker-compose --profile prod up -d
```

Access the app at: `http://localhost:80`

## Individual Docker Commands

### Build Production Image

```bash
docker build -t keerthi-portfolio:latest .
```

### Run Production Container

```bash
docker run -d -p 80:80 --name keerthi-portfolio keerthi-portfolio:latest
```

### Build Development Image

```bash
docker build -f Dockerfile.dev -t keerthi-portfolio:dev .
```

### Run Development Container

```bash
docker run -p 3000:3000 -v $(pwd):/app -v /app/node_modules keerthi-portfolio:dev
```

## Useful Commands

```bash
# Stop all containers
docker-compose down

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose --profile dev up --build

# Remove all containers and images
docker-compose down --rmi all

# Shell into container
docker exec -it keerthi-portfolio-dev sh
```

## Architecture

```
┌─────────────────────────────────────────┐
│           Multi-stage Build             │
├─────────────────────────────────────────┤
│  Stage 1: Builder (node:20-alpine)      │
│  - Install dependencies                 │
│  - Build static assets                  │
├─────────────────────────────────────────┤
│  Stage 2: Production (nginx:alpine)     │
│  - Serve static files                   │
│  - Optimized for performance            │
├─────────────────────────────────────────┤
│  Stage 3: Development (node:20-alpine)  │
│  - Hot reload enabled                   │
│  - Volume mounted source                │
└─────────────────────────────────────────┘
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment mode | development |
| CHOKIDAR_USEPOLLING | Enable polling for file changes (Docker) | true |
