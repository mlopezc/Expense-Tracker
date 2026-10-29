# Expense Tracker

Aplicación web full-stack para registrar y consultar gastos personales. Tiene un cliente React + Vite y una API REST Express con SQLite. [evidencia: package.json:4] [evidencia: client/package.json:7] [evidencia: server/package.json:15] [evidencia: server/package.json:21]

> Es un repositorio de entrenamiento para practicar documentación y pruebas. [evidencia: docs/prd/criterios-de-aceptacion.md:1-3]

## Funcionalidades principales

**Implementadas**

- **Autenticación con JWT**: registro, login, logout y consulta del usuario actual. [evidencia: server/src/routes/auth.js:7-16]
- **Gastos**: crear, listar, ver, editar y borrar. Solo el dueño accede a cada gasto. [evidencia: server/src/routes/expenses.js:10-25] [evidencia: server/src/controllers/expenseController.js:108-110]
- **Filtros y paginación**: por categoría, rango de fechas y texto, con orden configurable. La respuesta incluye el total y el promedio. [evidencia: server/src/controllers/expenseController.js:30-39] [evidencia: server/src/controllers/expenseController.js:78-92]
- **Categorías**: 9 categorías globales predefinidas, más categorías propias con color e icono. [evidencia: server/src/database/seed.sql:2-11] [evidencia: server/src/controllers/categoryController.js:4-9]
- **Datos demo**: un usuario con gastos de los últimos 3 meses. [evidencia: server/src/database/seed-demo.js:1-4]

**No implementadas todavía**

- Reportes: los endpoints `/api/reports/*` son stubs, y la página Reports muestra "coming soon". [evidencia: server/src/routes/reports.js:5-26] [evidencia: client/src/pages/Reports.jsx:10]
- Subida de recibos: existe el campo `receiptFilename`, pero no hay endpoint de subida. [evidencia: server/src/controllers/expenseController.js:15] [evidencia: docs/context.md:261]
- Presupuesto mensual por categoría (CA-4 a CA-6). [evidencia: docs/prd/criterios-de-aceptacion.md:23-25]

## Stack tecnológico

| Capa | Tecnologías | Evidencia |
|---|---|---|
| Runtime | Node 20 | [evidencia: .nvmrc:1] |
| Frontend | React 18, React Router 6, axios, Tailwind CSS 3, Vite 5 | [evidencia: client/package.json:14-17] [evidencia: client/package.json:27] [evidencia: client/package.json:32] |
| Backend | Express 4, sqlite3, jsonwebtoken, bcryptjs, Joi, morgan, cors, dotenv | [evidencia: server/package.json:15-24] |
| Pruebas | Jest 29 + supertest (server) | [evidencia: server/package.json:28-29] |
| Herramientas | ESLint 8 (client y server), concurrently | [evidencia: server/package.json:30] [evidencia: client/package.json:28] [evidencia: package.json:26] |

Hay dependencias instaladas que el código no usa: `knex`, `multer`, `chart.js`, `react-chartjs-2`, `date-fns` y `@heroicons/react`. [evidencia: docs/context.md:286-290]

## Estructura del proyecto

```
Expense-Tracker/
├── client/          # Frontend React + Vite (components, context, pages, services, styles)
├── server/          # API REST Express (server.js + src/: routes, controllers, models, database, middleware, utils, config)
│   └── uploads/     # Carpeta servida como estática en /uploads
├── docs/            # Documentación: context.md (contexto técnico) y prd/ (criterios de aceptación)
├── CLAUDE.md        # Comandos y reglas de documentación y pruebas del repo
├── package.json     # Scripts que orquestan client y server
├── .nvmrc           # Versión de Node (20)
└── .prettierrc      # Configuración de Prettier (Prettier no está instalado como dependencia)
```

Evidencia: [evidencia: client/package.json:5-8] [evidencia: server/package.json:4] [evidencia: server/src/app.js:19] [evidencia: package.json:6-15] [evidencia: .nvmrc:1]. Que Prettier no esté instalado se comprobó en los tres `package.json`. [evidencia: package.json:25-27] [evidencia: server/package.json:26-31] [evidencia: client/package.json:23-35]

## Quickstart

> Todos los comandos de esta sección se ejecutaron con éxito el 2026-10-27 (Node v20.19.2, npm 10.8.2, macOS).

### Requisitos

- Node 20. Con nvm: `nvm use`. [evidencia: .nvmrc:1]
- npm

### Instalación

```bash
git clone <url-del-repositorio>
cd Expense-Tracker
npm run install:all   # npm install en la raíz, client/ y server/
```

[evidencia: package.json:14]

### Variables de entorno

```bash
cp server/.env.example server/.env
```

[evidencia: server/.env.example:1-2] `server/.env` está en `.gitignore`. [evidencia: .gitignore:51-54]

Variables que lee el código:

| Variable | Por defecto | Notas | Evidencia |
|---|---|---|---|
| `JWT_SECRET` | ninguno | **Obligatoria.** La plantilla trae `change-me`; cámbiala. Para generar una: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` | [evidencia: server/src/utils/auth.js:10] [evidencia: server/.env.example:13-14] |
| `JWT_EXPIRES_IN` | `7d` | Duración del token | [evidencia: server/src/utils/auth.js:7] |
| `PORT` | `3001` | Puerto del server | [evidencia: server/server.js:6] |
| `NODE_ENV` | — | `test` desactiva morgan; `development` incluye el mensaje de error en las respuestas 500 | [evidencia: server/src/app.js:12] [evidencia: server/src/app.js:41] |
| `SQLITE_DB_PATH` | `server/src/database/expense_tracker.db` | Ruta relativa a `server/`, o `:memory:` | [evidencia: server/src/database/connection.js:7-16] |
| `VITE_API_URL` (client) | `http://localhost:3001/api` | URL base de la API | [evidencia: client/src/services/api.js:3] |

`.env.example` también define `JWT_REFRESH_SECRET`, `MAX_FILE_SIZE`, `UPLOAD_PATH`, `CLIENT_URL` y `RATE_LIMIT_*`, pero el código no las lee. [evidencia: docs/context.md:211]

### Base de datos

No hay paso manual. Al arrancar, el server crea las tablas y siembra las categorías por defecto si no existen. [evidencia: server/src/database/connection.js:42-72] Se comprobó arrancando con un archivo de BD nuevo.

Datos demo (opcional):

```bash
npm run seed:demo
# Usuario demo: demo@expense-tracker.dev / demo1234
```

[evidencia: package.json:13] [evidencia: server/src/database/seed-demo.js:11-16]

### Cómo correrlo

```bash
npm run dev
```

Arranca el server con nodemon y el client con Vite. [evidencia: package.json:7-9]

- Client: http://localhost:3000. Abre el navegador solo. [evidencia: client/vite.config.js:9-10]
- API: http://localhost:3001/api. Para comprobar que responde: `curl http://localhost:3001/api/health`. [evidencia: server/server.js:6] [evidencia: server/src/app.js:22-28]
- Vite redirige `/api` a `localhost:3001`. [evidencia: client/vite.config.js:11-17]

Lo que se comprobó: `/api/health` respondió 200 en los puertos 3001 y 3000 (vía proxy), el client respondió 200 y el login con el usuario demo respondió 200.

## Comandos de desarrollo

| Acción | Comando | Estado al 2026-10-27 | Evidencia |
|---|---|---|---|
| Dev (server + client) | `npm run dev` | ✅ | [evidencia: package.json:7] |
| Solo server (nodemon) | `npm run dev:server` | ✅ (a través de `npm run dev`) | [evidencia: package.json:8] |
| Solo client (Vite) | `npm run dev:client` | ✅ (a través de `npm run dev`) | [evidencia: package.json:9] |
| Build del client (`client/dist`, con sourcemaps) | `npm run build` | ✅ | [evidencia: package.json:10] [evidencia: client/vite.config.js:19-21] |
| Server en producción | `npm start` | ✅ | [evidencia: package.json:11] [evidencia: server/package.json:7] |
| Pruebas (Jest, server) | `npm test` | ⚠️ Termina con exit 0, pero no ejecuta nada: no hay pruebas y el script usa `--passWithNoTests` | [evidencia: package.json:12] [evidencia: server/package.json:10] |
| Lint del server | `cd server && npm run lint` | ❌ Exit 1: 3 errores | [evidencia: server/package.json:11] |
| Lint del client | `cd client && npm run lint` | ❌ Exit 1: 68 errores y 3 warnings (`--max-warnings 0`) | [evidencia: client/package.json:10] |
| Autocorregir lint | `npm run lint:fix` (en `server/` o `client/`) | No se ejecutó | [evidencia: server/package.json:12] [evidencia: client/package.json:11] |

- No hay script `lint` en la raíz. [evidencia: package.json:6-15]
- El client no tiene pruebas: falta un script `test`. [NOT FOUND] [evidencia: client/package.json:6-12]
- No hay herramienta E2E instalada. [NOT FOUND]
- Para pruebas de la API: `server/src/app.js` exporta la app sin abrir la BD ni escuchar, así que sirve con supertest. Usa `SQLITE_DB_PATH=:memory:` para no tocar la BD de desarrollo. [evidencia: server/src/app.js:6-8] [evidencia: server/src/database/connection.js:12-14]

## Cómo contribuir

- Las reglas de documentación y pruebas están en [`CLAUDE.md`](CLAUDE.md):
  - Documentación: no inventar nada y citar la evidencia de cada afirmación.
  - Pruebas: no tocar código de producción sin avisar, no debilitar ni saltar pruebas, y reportar los bugs en lugar de esconderlos.
  - E2E: usar `data-testid` y no usar esperas fijas.
- Los criterios de aceptación de [`docs/prd/criterios-de-aceptacion.md`](docs/prd/criterios-de-aceptacion.md) son la fuente de verdad para las pruebas. [evidencia: docs/prd/criterios-de-aceptacion.md:3]
- Los cambios entran por pull request desde una rama. Ejemplo: PR #1 desde `bootcamp/sesion-5-prep` (commit `56f3438`).
- Corre el lint del paquete que modifiques. Ojo: hoy ya falla en `main` (ver la tabla de arriba).

## Troubleshooting

| Síntoma | Causa / solución | Evidencia |
|---|---|---|
| La app te manda a `/login` sin que cierres sesión | Cualquier respuesta 401 borra el token de `localStorage` y redirige a `/login`. Vuelve a iniciar sesión. | [evidencia: client/src/services/api.js:27-35] |
| El puerto 3001 está ocupado | Cambia `PORT` en `server/.env`. El proxy de Vite apunta fijo a `localhost:3001`, así que también tienes que ajustar `VITE_API_URL` en el client. | [evidencia: server/server.js:6] [evidencia: client/vite.config.js:13] [evidencia: client/src/services/api.js:3] |
| Quieres empezar con una BD limpia | Borra `server/src/database/expense_tracker.db` (o el archivo de `SQLITE_DB_PATH`). El server la recrea con las categorías por defecto al arrancar. | [evidencia: server/src/database/connection.js:7-16] [evidencia: server/src/database/connection.js:42-72] |
| Los datos demo quedaron modificados | Corre `npm run seed:demo` otra vez: reinicia los gastos del usuario demo. | [evidencia: server/src/database/seed-demo.js:4] |
| Aviso `Browserslist: browsers data (caniuse-lite) is ... old` en `dev`/`build` | Es solo un aviso: el build termina con exit 0. Se quita con `npx update-browserslist-db@latest`. | Salida de `npm run build`, 2026-10-27 |
| `npm test` muestra "No tests found" | Es lo esperado: todavía no hay pruebas. | [evidencia: server/package.json:10] |
| Un `PUT` con solo algunos campos devuelve 500 | Es un bug conocido: `update` escribe todas las columnas. | [evidencia: docs/context.md:269-271] |

## Documentación

Más detalle en [`/docs`](docs/):

- [`docs/context.md`](docs/context.md): arquitectura, endpoints, modelos de datos, configuración, estado de las pruebas y hallazgos (bugs, riesgos, dependencias).
- [`docs/prd/criterios-de-aceptacion.md`](docs/prd/criterios-de-aceptacion.md): criterios de aceptación CA-1 a CA-6.

## Licencia

MIT. [evidencia: package.json:24] No existe un archivo `LICENSE` en el repo. [NOT FOUND]
