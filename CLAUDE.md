# CLAUDE.md

## Proyecto

- Aplicación full-stack de control de gastos: cliente React + Vite (`client/`) y API Express con SQLite/Knex (`server/`). [evidencia: package.json:4] [evidencia: client/package.json:7] [evidencia: server/package.json:15] [evidencia: server/package.json:21-22]
- Versión de Node: 20. [evidencia: .nvmrc:1]

### Comandos

| Acción | Comando | Evidencia |
|---|---|---|
| Instalar (raíz, client y server) | `npm run install:all` | [evidencia: package.json:14] |
| Configurar entorno del server | `cp server/.env.example server/.env` | [evidencia: server/.env.example:1-2] |
| Correr en desarrollo (server + client) | `npm run dev` | [evidencia: package.json:7] |
| Correr solo el server (nodemon, puerto 3001) | `npm run dev:server` | [evidencia: package.json:8] [evidencia: server/server.js:6] |
| Correr solo el client (Vite, puerto 3000) | `npm run dev:client` | [evidencia: package.json:9] [evidencia: client/vite.config.js:9] |
| Build del client | `npm run build` | [evidencia: package.json:10] |
| Producción (server) | `npm start` | [evidencia: package.json:11] |
| Datos demo | `npm run seed:demo` | [evidencia: package.json:13] |
| Pruebas (Jest en server) | `npm test` | [evidencia: package.json:12] [evidencia: server/package.json:10] |
| Lint server | `cd server && npm run lint` | [evidencia: server/package.json:11] |
| Lint client | `cd client && npm run lint` | [evidencia: client/package.json:10] |

- `npm test` usa `jest --passWithNoTests`, así que pasa aunque no exista ninguna prueba. [evidencia: server/package.json:10]
- Pruebas del client: [NOT FOUND] — `client/package.json` no define script `test`.
- Herramienta E2E (Cypress/Playwright): [NOT FOUND] — no está en ningún `package.json`.
- No hay script `lint` en la raíz. [evidencia: package.json:6-15]

## Reglas de documentación

- No inventar nada que no esté en el código, la configuración o el historial de git.
- Cada afirmación técnica lleva `[evidencia: ruta:línea]`.
- Si es una inferencia sin evidencia directa: `[ASSUMPTION: motivo]`.
- Si se buscó y no existe: `[NOT FOUND]`.

## Reglas de pruebas

- Nunca modificar código de producción para que una prueba pase sin avisar primero.
- Nunca debilitar, saltar (`.skip`) ni borrar una prueba para que la suite pase.
- Si una prueba revela un bug real, reportarlo; no "arreglarlo" ajustando la prueba.
- Usar `data-testid` para selectores E2E; nada de esperas fijas (`cy.wait(ms)`).
