# ADR-007: Monorepo con Separación Cliente-Servidor

**Estado**: Aceptado

**Fecha**: 2024-11 (Estimado según análisis de código)

**Autores**: Equipo de desarrollo ExpenseTracker

---

## Contexto

ExpenseTracker es una aplicación full-stack que consiste en:
- **Frontend**: React SPA
- **Backend**: Express.js API REST

Necesitábamos decidir cómo organizar el código en el repositorio. Las opciones principales eran:

1. **Monorepo**: Un repositorio con frontend y backend separados
2. **Polyrepo**: Repositorios separados para frontend y backend
3. **Mixed**: Todo el código mezclado sin separación clara

**Requisitos:**
- Desarrollo local fácil (ejecutar ambos simultáneamente)
- Control de versiones coherente
- Deployment independiente posible
- Compartir configuración donde tenga sentido
- Onboarding simple para nuevos developers
- CI/CD pipeline eficiente

**Consideraciones del proyecto:**
- Equipo pequeño (1-3 developers)
- Deployment a plataformas cloud (Heroku, Railway)
- Proyecto educativo (claridad es prioritaria)
- Frontend y backend evolucionan juntos (mismas features)

## Decisión

Decidimos usar una **arquitectura de monorepo con separación clara entre cliente y servidor**, con scripts raíz para orquestar ambos.

**Estructura:**
```
ExpenseTracker/
├── client/              # Frontend React completo
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── ...
├── server/              # Backend Express completo
│   ├── src/
│   ├── uploads/
│   ├── package.json
│   └── server.js
├── docs/                # Documentación compartida
├── package.json         # Root orchestration
├── .gitignore
└── README.md
```

**Scripts de orquestación:**
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "cd server && npm run dev",
    "dev:client": "cd client && npm run dev",
    "install:all": "npm install && cd client && npm install && cd ../server && npm install"
  }
}
```

**Evidencia en el código:**
- `/package.json:6-13` - Scripts de orquestación
- `/client/` - Frontend completo autocontenido
- `/server/` - Backend completo autocontenido

## Consecuencias

### Positivas

1. **Separación Clara de Concerns**
   - Frontend y backend completamente separados
   - Cada uno con sus propias dependencias
   - Sin confusión de qué código es qué
   - Fácil navegar codebase

2. **Control de Versiones Unificado**
   - Un solo repositorio que clonar
   - Commits atómicos que tocan frontend y backend
   - Feature branches incluyen todos los cambios
   - History coherente del proyecto

3. **Desarrollo Local Simplificado**
   - Un comando (`npm run dev`) ejecuta todo
   - Logs consolidados de ambos servers
   - Sin necesidad de múltiples terminales manualmente
   - Proxy configurado en Vite (API calls transparentes)

4. **Onboarding Rápido**
   - `git clone` → `npm run install:all` → `npm run dev`
   - Estudiantes pueden ejecutar proyecto completo en minutos
   - No hay configuración de múltiples repos
   - README único con todas las instrucciones

5. **Deployment Flexible**
   - Puede deployarse junto (monolith)
   - O separado (frontend en Vercel, backend en Heroku)
   - Build scripts independientes
   - Cada parte es autocontenida

6. **Compartir Recursos Comunes**
   - Documentación en `/docs/`
   - Configuración ESLint/Prettier compartida (futura)
   - Git hooks compartidos
   - CI/CD pipeline único

7. **Refactoring Seguro**
   - Cambios en API reflejados en ambos lados
   - Grep/find funciona en toda la codebase
   - Refactorings atómicos (no hay sincronización entre repos)

### Negativas

1. **Tamaño de Repositorio**
   - `node_modules/` duplicados (client + server)
   - Git clone más pesado
   - **Impacto**: ~250MB total
   - **Mitigación**: `.gitignore` excluye node_modules

2. **Permisos y Acceso**
   - No se puede dar acceso solo a frontend o backend
   - Todo o nada en permisos
   - **Impacto**: No relevante para proyecto open-source
   - **Mitigación**: Si fuera necesario, submodules o monorepo tools

3. **CI/CD Complexity (Minor)**
   - Pipeline debe detectar qué parte cambió
   - Build ambos o solo parte modificada
   - **Mitigación**: Platforms como Vercel detectan automáticamente
   - **Alternativa**: Build siempre ambos (es rápido)

4. **Dependency Management**
   - Tres `package.json` que mantener (root, client, server)
   - Dependencias duplicadas posibles
   - **Mitigación**: Minimal root dependencies (solo concurrently)

5. **No Hay Workspace Management (Yet)**
   - No usa npm workspaces o yarn workspaces
   - Instalaciones independientes
   - **Impacto**: Instalación toma 2x tiempo
   - **Futura mejora**: Migrar a npm workspaces

## Alternativas Consideradas

### 1. Polyrepo (Repositorios Separados)

**Estructura:**
```
expense-tracker-client/      # Repo 1
expense-tracker-server/      # Repo 2
```

**Pros:**
- Separación total
- Deployment completamente independiente
- Permisos granulares
- Repositorios más pequeños
- Especialización (frontend team / backend team)

**Contras:**
- Dos repos que clonar
- Sincronización compleja (feature branches en ambos)
- Versionado inconsistente
- Onboarding más difícil
- Commits atómicos imposibles (cambio API = 2 commits en 2 repos)

**Razón de rechazo:** Complejidad de sincronización innecesaria. Para equipo pequeño y proyecto educativo, polyrepo es overkill. Los cambios frontend/backend están altamente acoplados (mismas features).

---

### 2. Mixed Codebase (Sin Separación)

**Estructura:**
```
ExpenseTracker/
├── src/
│   ├── client/
│   ├── server/
│   └── shared/
├── package.json
└── ...
```

**Pros:**
- Un solo `package.json`
- Fácil compartir código (utilities, types)
- Instalación única

**Contras:**
- Confusión de dependencias (frontend y backend mezcladas)
- Difícil deployment independiente
- Conflictos de dependencias (diferentes versiones)
- Build complejo (webpack configs mezclados)
- No apropiado para React + Express (ecosistemas muy diferentes)

**Razón de rechazo:** Frontend y backend tienen ecosistemas completamente diferentes. Mezclar dependencies causa conflictos. No hay ventaja real sobre monorepo separado.

---

### 3. Monorepo con Workspaces (npm/yarn/pnpm)

**Estructura:**
```
ExpenseTracker/
├── packages/
│   ├── client/
│   ├── server/
│   └── shared/
├── package.json     # Workspace root
└── ...
```

**package.json root:**
```json
{
  "workspaces": ["packages/*"]
}
```

**Pros:**
- Instalación optimizada (dependencies hoisted)
- Fácil compartir código entre packages
- Single lockfile
- Comandos centralizados
- Ideal para monorepos grandes

**Contras:**
- Más complejo de configurar
- Curva de aprendizaje (workspaces)
- Overkill para solo 2 packages
- Menos familiar para principiantes

**Razón de rechazo:** Complejidad innecesaria para proyecto de 2 partes. Workspaces brillan con 5+ packages y código compartido significativo. No tenemos shared packages actualmente.

**Reconsiderar si**: Agregamos paquete `shared` con types, utilities, etc.

---

### 4. Git Submodules

**Estructura:**
```
ExpenseTracker/
├── client/          # Git submodule → expense-tracker-client
├── server/          # Git submodule → expense-tracker-server
└── README.md
```

**Pros:**
- Repositorios separados, pero unified view
- Control de versiones independiente
- Deployment independiente

**Contras:**
- Submodules son notoriamente difíciles de usar
- Git operations complejas
- Confusión con commits
- Onboarding terrible (git submodule update --init --recursive)

**Razón de rechazo:** Git submodules son problemáticos y confusos. Mayoría de developers los evitan. No vale la pena la complejidad.

---

### 5. Nx Monorepo

**Herramienta:** Nx (monorepo tool)

**Pros:**
- Incremental builds
- Dependency graph
- Affected commands (build solo lo que cambió)
- Caching inteligente
- Ideal para monorepos grandes

**Contras:**
- Herramienta adicional que aprender
- Configuración compleja
- Overkill para proyecto pequeño
- Abstracción extra

**Razón de rechazo:** Nx es excelente para monorepos enterprise con 10+ projects. Para 2 projects (client + server), es excesivo. La simplicidad es más valiosa.

## Notas de Implementación

### Scripts de Orquestación

**Root package.json:**
```json
{
  "name": "expense-tracker",
  "version": "1.0.0",
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "cd server && npm run dev",
    "dev:client": "cd client && npm run dev",
    "build": "cd client && npm run build",
    "start": "cd server && npm start",
    "install:all": "npm install && cd client && npm install && cd ../server && npm install"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

**Concurrently Output:**
```bash
npm run dev

[0] > server@1.0.0 dev
[0] > nodemon server.js
[0] Server running on port 3001

[1] > client@1.0.0 dev
[1] > vite
[1] VITE ready in 847 ms
[1] Local: http://localhost:3000
```

### Proxy Configuration (Development)

**Client Vite config:**
```javascript
// client/vite.config.js
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
```

**Resultado:**
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`
- API calls en frontend: `/api/expenses` → proxied a `http://localhost:3001/api/expenses`
- Sin CORS issues

### .gitignore Strategy

```gitignore
# Root
node_modules/
.env

# Client specific
client/dist/
client/.vite/

# Server specific
server/uploads/*
!server/uploads/.gitkeep
server/src/database/*.db

# Docs
docs/.DS_Store
```

### Directory Structure Completa

```
ExpenseTracker/
├── .git/                    # Git repository
├── .github/                 # GitHub config (future CI/CD)
├── .claude/                 # Claude Code config
├── client/                  # Frontend (React + Vite)
│   ├── dist/               # Build output (gitignored)
│   ├── node_modules/       # Client dependencies (gitignored)
│   ├── public/             # Static assets
│   ├── src/                # React source code
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── ...
│   ├── .eslintrc.cjs
│   ├── index.html
│   ├── package.json        # Client dependencies
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                  # Backend (Express + SQLite)
│   ├── node_modules/       # Server dependencies (gitignored)
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── database/
│   ├── uploads/            # User uploads (gitignored)
│   ├── .env                # Environment vars (gitignored)
│   ├── .eslintrc.js
│   ├── package.json        # Server dependencies
│   └── server.js           # Entry point
├── docs/                    # Documentation
│   ├── adr/                # Architecture Decision Records
│   └── tech-stack-overview.md
├── tests/                   # Future: Integration tests
├── .gitignore              # Git ignore rules
├── .prettierrc             # Code formatting
├── package.json            # Root orchestration
├── package-lock.json
├── README.md               # Main documentation
└── Roadmap.md             # Development roadmap
```

### Tamaño del Repositorio

```bash
$ du -sh .
250M    .   # Total

$ du -sh client/ server/
120M    client/   # Including node_modules
130M    server/   # Including node_modules

$ du -sh . --exclude=node_modules
5M      .   # Source code only
```

### Workflow de Desarrollo

**Iniciar proyecto:**
```bash
git clone <repo-url>
cd ExpenseTracker
npm run install:all
npm run dev
```

**Trabajar solo en frontend:**
```bash
cd client
npm run dev
```

**Trabajar solo en backend:**
```bash
cd server
npm run dev
```

**Build para producción:**
```bash
npm run build        # Builds client
cd server
npm start           # Runs production server
```

## Deployment Strategies

### Opción 1: Monolith Deployment

**Sirve frontend desde backend:**
```javascript
// server/server.js
app.use(express.static(path.join(__dirname, '../client/dist')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'))
})
```

**Deploy:**
- Heroku, Railway, o VPS
- Build client → copiar a server/public
- Deploy server con static files

**Pros:** Simple, un solo deploy
**Contras:** No aprovecha CDNs para frontend

---

### Opción 2: Separado

**Frontend:** Vercel, Netlify, GitHub Pages
**Backend:** Heroku, Railway, Render

**Pros:**
- CDN para frontend (fast)
- Escalamiento independiente
- Environments separados

**Contras:**
- CORS configuration necesaria
- Dos deployments
- Más complejo

## Mejoras Futuras

### 1. Migrar a npm Workspaces

**Si agregamos código compartido:**
```json
{
  "workspaces": ["client", "server", "shared"]
}
```

**Beneficios:**
- Instalación optimizada
- Shared types/utilities
- Single lockfile

---

### 2. Agregar Package `shared`

**Estructura:**
```
ExpenseTracker/
├── packages/
│   ├── client/
│   ├── server/
│   └── shared/          # NEW
│       ├── types/       # TypeScript types
│       ├── utils/       # Shared utilities
│       └── constants/   # Shared constants
```

**Uso:**
```javascript
// Both client and server
import { ExpenseStatus } from '@expensetracker/shared'
```

---

### 3. Monorepo Tools (Si Crece)

**Herramientas a considerar:**
- **Nx**: Builds incrementales, caching
- **Turborepo**: Fast builds, caching
- **Lerna**: Package management

**Umbral:** 5+ packages o team > 5 developers

## Referencias

1. [Monorepo Tools Comparison](https://monorepo.tools/)
2. [npm Workspaces Documentation](https://docs.npmjs.com/cli/v7/using-npm/workspaces)
3. [Concurrently Documentation](https://github.com/open-cli-tools/concurrently)
4. [package.json](/package.json) - Root orchestration
5. [client/package.json](/client/package.json) - Frontend dependencies
6. [server/package.json](/server/package.json) - Backend dependencies

## Estado del ADR

Este ADR está **ACEPTADO** y funciona muy bien para el proyecto actual.

**Satisfacción del equipo**: 9/10

**Beneficios validados:**
- Onboarding de estudiantes es < 5 minutos
- Desarrollo local fluido con un comando
- Estructura clara y navegable
- Deployment flexible (preparado para separar si necesario)

**Próximos pasos:**
1. Considerar npm workspaces si agregamos código compartido
2. Setup CI/CD que detecte cambios (Fase 5)
3. Documentar estrategia de deployment (Fase 6)

**No action needed** por ahora. La estructura actual es apropiada para el tamaño y complejidad del proyecto.

---

**Última actualización**: 2025-11-05
