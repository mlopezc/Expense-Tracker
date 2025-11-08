# Architecture Decision Records (ADRs)

Este directorio contiene las Architecture Decision Records (ADRs) del proyecto ExpenseTracker. Los ADRs documentan las decisiones arquitectónicas significativas tomadas durante el desarrollo del proyecto, incluyendo el contexto, las alternativas consideradas, y las consecuencias de cada decisión.

---

## ¿Qué es un ADR?

Un Architecture Decision Record (ADR) es un documento que captura una decisión arquitectónica importante junto con su contexto y consecuencias. Los ADRs ayudan a:

- **Preservar el conocimiento**: Documentan el "por qué" detrás de las decisiones
- **Facilitar el onboarding**: Nuevos developers entienden las decisiones históricas
- **Evitar repetir debates**: Las decisiones ya tomadas están documentadas
- **Proporcionar contexto**: Futuras refactorings entienden las restricciones originales

## Formato de ADRs

Cada ADR sigue esta estructura estándar:

```markdown
# ADR-XXX: [Título Descriptivo]

**Estado**: Aceptado/Propuesto/Deprecado/Superseded

**Fecha**: YYYY-MM-DD

**Autores**: Nombre(s)

## Contexto
¿Qué problema estamos resolviendo? ¿Cuáles son las restricciones?

## Decisión
¿Qué decidimos hacer?

## Consecuencias
### Positivas
¿Qué beneficios obtenemos?

### Negativas
¿Qué trade-offs aceptamos?

## Alternativas Consideradas
¿Qué otras opciones evaluamos y por qué las rechazamos?

## Referencias
Links a documentación relevante, código, o recursos externos.
```

---

## Índice de ADRs

### Frontend

| ADR | Título | Estado | Fecha | Categoría |
|-----|--------|--------|-------|-----------|
| [ADR-001](./ADR-001-react-framework.md) | Elección de React como Framework Frontend | ✅ Aceptado | 2024-11 | Frontend / Framework |
| [ADR-002](./ADR-002-vite-build-tool.md) | Vite como Build Tool y Dev Server | ✅ Aceptado | 2024-11 | Frontend / Tooling |
| [ADR-003](./ADR-003-context-api-state-management.md) | Context API + useReducer para Gestión de Estado | ✅ Aceptado | 2024-11 | Frontend / State |
| [ADR-008](./ADR-008-tailwind-css-styling.md) | Tailwind CSS para Estilos | ✅ Aceptado | 2024-11 | Frontend / Styling |

### Backend

| ADR | Título | Estado | Fecha | Categoría |
|-----|--------|--------|-------|-----------|
| [ADR-009](./ADR-009-express-backend-framework.md) | Express.js como Framework Backend | ✅ Aceptado | 2024-11 | Backend / Framework |
| [ADR-006](./ADR-006-mvc-architecture-backend.md) | Arquitectura MVC en Backend | ✅ Aceptado | 2024-11 | Backend / Architecture |
| [ADR-004](./ADR-004-jwt-stateless-authentication.md) | Autenticación JWT Stateless | ✅ Aceptado | 2024-11 | Backend / Security |
| [ADR-005](./ADR-005-dual-database-strategy.md) | Estrategia Dual de Base de Datos (SQLite/PostgreSQL) | ✅ Aceptado | 2024-11 | Backend / Database |

### Proyecto General

| ADR | Título | Estado | Fecha | Categoría |
|-----|--------|--------|-------|-----------|
| [ADR-007](./ADR-007-monorepo-client-server-separation.md) | Monorepo con Separación Cliente-Servidor | ✅ Aceptado | 2024-11 | Project / Structure |
| [ADR-010](./ADR-010-testing-strategy.md) | Estrategia de Testing | ⏳ Propuesto | 2025-11 | Project / Quality |

---

## Resumen Ejecutivo de Decisiones

### Stack Tecnológico Principal

**Frontend:**
- **Framework**: React 18.2.0 (funcional, hooks)
- **Build Tool**: Vite 5.0.0 (HMR ultra-rápido)
- **State Management**: Context API + useReducer (sin Redux)
- **Estilos**: Tailwind CSS 3.3.6 (utility-first)
- **Routing**: React Router DOM 6.20.1

**Backend:**
- **Framework**: Express.js 4.18.2 (minimalista)
- **Arquitectura**: MVC (Models, Controllers, Routes)
- **Autenticación**: JWT tokens (stateless)
- **Base de Datos**: SQLite (dev) → PostgreSQL (prod)
- **ORM/Query Builder**: Knex.js 3.0.1 (preparado, no usado aún)

**Project Structure:**
- **Organization**: Monorepo (client/ + server/)
- **Orchestration**: Concurrently para dev paralelo

**Testing (Pendiente):**
- **Backend**: Jest + Supertest
- **Frontend**: Vitest + React Testing Library (propuesto)
- **E2E**: Playwright (propuesto)

---

## Decisiones por Categoría

### 🎨 User Interface & Experience

- **ADR-001**: React para UI interactiva y component-based
- **ADR-008**: Tailwind CSS para desarrollo rápido y consistencia
- **ADR-002**: Vite para desarrollo con HMR instantáneo

**Justificación clave**: Velocidad de desarrollo y experiencia de developer. Tailwind + Vite permiten iteración rápida de UI.

---

### 🔐 Security & Authentication

- **ADR-004**: JWT para autenticación stateless y escalable
- **bcryptjs**: Hash seguro de passwords con 10 salt rounds
- **Token expiration**: 7 días por token

**Justificación clave**: Escalabilidad horizontal sin shared sessions. Stateless permite microservices futuros.

---

### 💾 Data Persistence

- **ADR-005**: SQLite para desarrollo (zero config), PostgreSQL para producción (escalable)
- **Schema SQL estándar**: Compatible con ambos motores
- **Indexes**: Optimización de queries en user_id, date, category_id

**Justificación clave**: Balance entre simplicidad de desarrollo (SQLite) y preparación para producción (PostgreSQL).

---

### 🏗️ Architecture & Structure

- **ADR-006**: MVC para separación de responsabilidades clara
- **ADR-007**: Monorepo para desarrollo unificado, deployment flexible
- **Active Record Pattern**: Models con métodos de instancia y estáticos

**Justificación clave**: Mantenibilidad y escalabilidad. Estructura predecible facilita onboarding y cambios.

---

### 🧪 Quality Assurance

- **ADR-010**: Pirámide de testing (60% unit, 30% integration, 10% E2E)
- **Jest + Supertest**: Testing backend
- **Vitest + RTL**: Testing frontend (propuesto)
- **Coverage objetivo**: 75%

**Justificación clave**: Confianza en cambios y valor educativo. Tests enseñan mejores prácticas.

---

## Decisiones Destacadas

### ✅ Decisiones Exitosas

1. **Vite over CRA** (ADR-002)
   - **Impacto**: Dev server 10x más rápido
   - **Métrica**: < 1s cold start vs ~15s con webpack
   - **Satisfacción**: 9/10

2. **Tailwind CSS** (ADR-008)
   - **Impacto**: Desarrollo de UI 3x más rápido
   - **Métrica**: Bundle ~15KB vs ~150KB con Bootstrap
   - **Satisfacción**: 9/10

3. **Context API instead of Redux** (ADR-003)
   - **Impacto**: Simplicidad, zero dependencies
   - **Métrica**: -10KB bundle size, -50% boilerplate
   - **Satisfacción**: 8/10

### ⚠️ Trade-offs Aceptados

1. **JWT sin Refresh Tokens** (ADR-004)
   - **Trade-off**: No invalidación inmediata en logout
   - **Mitigación**: Expiración corta (7 días)
   - **Plan futuro**: Implementar refresh tokens en Fase 5

2. **Testing 0% Coverage** (ADR-010)
   - **Trade-off**: Sin protección contra regressions actualmente
   - **Justificación**: Prioridad en features funcionales primero
   - **Plan futuro**: Implementación en Fase 5 (ejercicio educativo)

3. **SQLite en Development** (ADR-005)
   - **Trade-off**: Diferencias menores con PostgreSQL
   - **Mitigación**: SQL estándar, migration path claro
   - **Beneficio**: Onboarding instantáneo

---

## Estado de ADRs

### Por Estado

- ✅ **Aceptados e Implementados**: 9 ADRs
- ⏳ **Propuestos (Pendientes)**: 1 ADR (Testing)
- ❌ **Deprecados**: 0 ADRs
- 🔄 **Superseded**: 0 ADRs

### Por Prioridad de Implementación

**Alta (Implementado):**
- ADR-001 a ADR-009

**Media (Fase 5):**
- ADR-010: Testing Strategy

**Futura Consideración:**
- TypeScript Migration
- Refresh Tokens
- Docker Containerization
- CI/CD Pipeline

---

## Proceso de ADRs

### ¿Cuándo Crear un ADR?

Crea un ADR cuando:
- Eliges entre múltiples frameworks/librerías significativas
- Defines patrones arquitectónicos para el proyecto
- Tomas decisiones que afectan múltiples partes del sistema
- La decisión es difícil de revertir
- Necesitas justificar una decisión no obvia

**No crear ADR para**:
- Decisiones triviales (naming, formatting)
- Cambios puramente estéticos
- Bug fixes
- Refactorings menores

### Proceso de Aprobación

1. **Propuesta**: Crear ADR con estado "Propuesto"
2. **Discusión**: Review con equipo (PR comments)
3. **Decisión**: Aprobar o rechazar
4. **Implementación**: Cambiar estado a "Aceptado" al implementar
5. **Review**: Actualizar con lessons learned

### Actualización de ADRs

Los ADRs son documentos **inmutables** de decisiones históricas. Sin embargo:

- **Sección "Referencias"**: Puede actualizarse con nuevos recursos
- **Sección "Estado"**: Puede cambiar (Aceptado → Deprecado)
- **Nuevo ADR**: Si una decisión cambia, crear nuevo ADR que supersede el anterior

**Ejemplo**:
```markdown
# ADR-003: Context API para State Management

**Estado**: Superseded by ADR-015

**Reemplazado por**: ADR-015 (Migración a Redux Toolkit)
**Fecha de deprecación**: 2025-06-01
**Razón**: Complejidad de estado creció más allá de Context API
```

---

## Herramientas y Templates

### ADR Template

```bash
# Crear nuevo ADR
cp docs/adr/TEMPLATE.md docs/adr/ADR-011-new-decision.md
```

### ADR Numbering

- **001-099**: Frontend decisions
- **100-199**: Backend decisions (futuro)
- **200-299**: Infrastructure decisions (futuro)

**Actual**: Numeración secuencial simple (001-010)

### Visualización de ADRs

**Herramientas recomendadas:**
- [adr-tools](https://github.com/npryce/adr-tools) - CLI para gestionar ADRs
- [adr-viewer](https://github.com/mrwilson/adr-viewer) - Visualizador web de ADRs
- [log4brains](https://github.com/thomvaill/log4brains) - Documentación arquitectónica con ADRs

---

## Recursos Adicionales

### Lecturas Recomendadas

1. [Documenting Architecture Decisions - Michael Nygard](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
2. [ADR GitHub Organization](https://adr.github.io/)
3. [Architecture Decision Records - Thoughtworks](https://www.thoughtworks.com/radar/techniques/lightweight-architecture-decision-records)
4. [When to Write an ADR](https://engineering.atspotify.com/2020/04/when-should-i-write-an-architecture-decision-record/)

### Proyectos Ejemplo

- [Backstage ADRs](https://backstage.io/docs/architecture-decisions/adr-template) - Spotify
- [Rust RFCs](https://github.com/rust-lang/rfcs) - Similar concept
- [Python PEPs](https://peps.python.org/) - Python Enhancement Proposals

### Tech Stack Overview

Para una visión completa del stack tecnológico, consulta:
- [Tech Stack Overview](/docs/tech-stack-overview.md)

---

## Contribuir

### Para Estudiantes

Los estudiantes pueden contribuir:

1. **Proponer nuevos ADRs**
   - Identificar decisiones no documentadas
   - Seguir template estándar
   - Abrir PR para discusión

2. **Mejorar ADRs existentes**
   - Agregar referencias
   - Corregir errores
   - Actualizar con lessons learned

3. **Implementar decisiones propuestas**
   - ADR-010 (Testing) es excelente oportunidad
   - Documentar en ADR los aprendizajes

### Para Instructores

Los instructores pueden usar ADRs como:

- **Material educativo**: Enseñar toma de decisiones arquitectónicas
- **Ejercicios**: Pedir a estudiantes escribir ADR para nuevas features
- **Discusión**: Debate sobre trade-offs de cada decisión

---

## Changelog

| Fecha | Cambio | Autor |
|-------|--------|-------|
| 2025-11-05 | Creación inicial de 10 ADRs | Análisis automatizado |
| 2024-11 | Decisiones implementadas en código | Equipo original |

---

## Contacto

Para preguntas sobre ADRs o decisiones arquitectónicas:
- Abrir issue en GitHub con label `architecture`
- Discutir en PR que propone cambios arquitectónicos

---

**Última actualización**: 2025-11-05
**Total de ADRs**: 10
**Estado del proyecto**: Fase 1 completada, Fase 5 (Testing) pendiente
