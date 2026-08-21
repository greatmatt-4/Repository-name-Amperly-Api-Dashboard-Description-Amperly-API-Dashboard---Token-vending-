# Amperly API Dashboard - Fullstack Setup

This repository now contains a minimal full-stack implementation for the Amperly API Dashboard (token vending + light confirmation).

What I added
- server/: Node + Express API with SQLite storage (token vending, light confirmation)
- client/: small static frontend (HTML/JS/CSS) that talks to the API
- Dockerfile for server and docker-compose.yml for local dev
- Updated README instructions for running locally and with Docker

Quick start (dev)

1. Install dependencies and run server

   cd server
   npm install
   node index.js

2. Open client in a browser

   Open client/index.html (the server also serves the client from / if you run the server)

Run with Docker

   docker-compose up --build

API endpoints
- POST /api/vend-token    -> create a token record (body JSON)
- POST /api/confirm-light -> mark light confirmation for a ref
- GET  /api/tokens        -> list tokens (debug)

