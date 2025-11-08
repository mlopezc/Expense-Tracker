# ADR-001: Elección de React como Framework Frontend

**Estado**: Aceptado

**Fecha**: 2024-11 (Estimado según análisis de código)

**Autores**: Equipo de desarrollo ExpenseTracker

---

## Contexto

Necesitábamos seleccionar un framework de frontend para construir una Single Page Application (SPA) moderna para el seguimiento de gastos personales. La aplicación requiere:

- Interfaz de usuario interactiva y dinámica
- Gestión de estado complejo (autenticación, gastos, categorías)
- Actualización eficiente del DOM
- Componentes reutilizables
- Ecosistema maduro con librerías de soporte
- Curva de aprendizaje razonable para el equipo
- Comunidad activa y soporte a largo plazo

El proyecto está orientado a servir como plataforma educativa para estudiantes, por lo que la popularidad y empleabilidad del framework también son consideraciones importantes.

## Decisión

Decidimos usar **React 18.2.0** como framework frontend principal para la aplicación ExpenseTracker.

**Implementación específica:**
- React 18 con Concurrent Features
- Componentes funcionales exclusivamente (no clases)
- React Hooks para lógica de estado y efectos
- JSX para definición de componentes
- Arquitectura basada en componentes modulares

**Evidencia en el código:**
- `/client/package.json:14` - React como dependencia principal
- `/client/src/App.jsx` - Componente raíz usando hooks
- `/client/src/components/*` - 16 componentes funcionales

## Consecuencias

### Positivas

1. **Ecosistema Maduro**
   - Acceso a miles de librerías compatibles (React Router, Chart.js, etc.)
   - Soluciones probadas para problemas comunes
   - Documentación extensa y actualizada

2. **Performance Optimizado**
   - Virtual DOM para actualizaciones eficientes
   - Concurrent Features en React 18 (automatic batching, transitions)
   - Code splitting y lazy loading nativos

3. **Developer Experience**
   - Hot Module Replacement con Vite
   - React DevTools para debugging
   - Fast Refresh mantiene estado durante desarrollo
   - Mensajes de error descriptivos

4. **Empleabilidad**
   - React es el framework más demandado en el mercado laboral
   - Habilidad transferible para estudiantes
   - Gran comunidad para resolver dudas

5. **Component Reusability**
   - Sistema de componentes fomenta reutilización
   - Fácil crear bibliotecas de componentes compartidos
   - Composición sobre herencia

### Negativas

1. **Curva de Aprendizaje**
   - Requiere entender JSX, hooks, y conceptos React-specific
   - Hooks pueden ser confusos inicialmente (useEffect dependencies)
   - Diferentes paradigmas que HTML/JS tradicional

2. **Bundle Size**
   - React + ReactDOM ≈ 45KB (gzipped)
   - Más pesado que frameworks ligeros como Preact o Svelte
   - Impacto en First Contentful Paint

3. **Boilerplate**
   - Requiere configuración de build tool (Vite)
   - Necesidad de librerías adicionales (router, state management)
   - No incluye soluciones para routing, forms, HTTP

4. **Dependency Updates**
   - Necesidad de mantenimiento constante de dependencias
   - Riesgo de breaking changes en major versions
   - Deprecación de APIs (ej: componentWillMount)

5. **SEO Considerations**
   - SPA requiere estrategias especiales para SEO
   - Necesidad de Server-Side Rendering (SSR) o Static Generation para SEO óptimo
   - No crítico para esta aplicación (requiere autenticación)

## Alternativas Consideradas

### 1. Vue.js 3

**Pros:**
- Curva de aprendizaje más suave
- Documentación excelente en español
- Composition API similar a React Hooks
- Bundle más pequeño (~35KB)
- Templates más familiares para desarrolladores HTML

**Contras:**
- Ecosistema menor que React
- Menos oferta laboral
- Comunidad más pequeña
- Menos recursos educativos

**Razón de rechazo:** Menor empleabilidad para estudiantes, ecosistema más limitado para features avanzados.

---

### 2. Angular 16+

**Pros:**
- Framework completo (batteries included)
- TypeScript por defecto
- Excelente para aplicaciones empresariales grandes
- Dependency injection robusto
- CLI potente

**Contras:**
- Curva de aprendizaje muy empinada
- Verboso y opinado
- Bundle size grande
- Overkill para aplicación de este tamaño
- Menor flexibilidad

**Razón de rechazo:** Complejidad excesiva para el alcance del proyecto, curva de aprendizaje demasiado empinada para plataforma educativa.

---

### 3. Svelte 4

**Pros:**
- Sin Virtual DOM (compilado a vanilla JS)
- Bundle size mínimo
- Performance excelente
- Menos código boilerplate
- Sintaxis limpia e intuitiva

**Contras:**
- Ecosistema inmaduro
- Menos librerías de terceros
- Comunidad pequeña
- Empleo limitado en el mercado
- Menor cantidad de recursos educativos

**Razón de rechazo:** Ecosistema inmaduro, menor valor educativo para empleabilidad de estudiantes.

---

### 4. Vanilla JavaScript

**Pros:**
- Sin dependencias
- Control total
- Bundle size cero (framework)
- Aprendizaje de fundamentos

**Contras:**
- Reinventar la rueda
- Manejo manual de DOM tedioso y propenso a errores
- Dificultad para mantener código complejo
- Sin herramientas de desarrollo modernas
- Escalabilidad limitada

**Razón de rechazo:** Complejidad de desarrollo excesiva, dificultad para mantener código a medida que crece la aplicación.

---

### 5. Next.js (React Framework)

**Pros:**
- Server-Side Rendering built-in
- File-based routing
- API routes integradas
- Optimizaciones automáticas
- Excelente developer experience

**Contras:**
- Mayor complejidad
- Overkill para SPA simple
- Require Node.js server (no static hosting)
- Learning curve adicional
- Limitaciones de configuración

**Razón de rechazo:** Complejidad innecesaria para SPA sin requisitos SEO, mayor overhead operacional.

## Notas de Implementación

### Patrón de Componentes Adoptado

```javascript
// Patrón estándar usado en el proyecto
import React from 'react'

function ExpenseForm({ onSubmit, initialData }) {
  const [amount, setAmount] = React.useState(initialData?.amount || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ amount })
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* JSX markup */}
    </form>
  )
}

export default ExpenseForm
```

### Estructura de Componentes

```
src/components/
├── common/       # Componentes reutilizables (Layout, Navbar)
├── forms/        # Formularios especializados
├── expenses/     # Features de gastos
└── categories/   # Features de categorías
```

### Hooks Utilizados

- `useState` - Estado local de componentes
- `useEffect` - Efectos secundarios (API calls, subscriptions)
- `useContext` - Consumo de contextos globales
- `useReducer` - Estado complejo con múltiples acciones
- Custom hooks - `useAuth()` para lógica de autenticación

## Referencias

1. [React Official Documentation](https://react.dev)
2. [Why Did We Build React?](https://legacy.reactjs.org/blog/2013/06/05/why-react.html)
3. [Introducing React 18](https://react.dev/blog/2022/03/29/react-v18)
4. [Client package.json](/client/package.json) - Configuración del proyecto
5. [App.jsx](/client/src/App.jsx) - Componente raíz

## Estado del ADR

Este ADR está **ACEPTADO** y en producción activa en el proyecto. La decisión ha demostrado ser correcta basándose en:

- Velocidad de desarrollo lograda
- Facilidad de encontrar soluciones a problemas
- Ecosistema rico de librerías (React Router, Chart.js)
- Experiencia positiva del equipo de desarrollo

No hay planes actuales de migrar a otro framework.

---

**Última actualización**: 2025-11-05
