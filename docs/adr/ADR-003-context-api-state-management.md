# ADR-003: Context API + useReducer para Gestión de Estado

**Estado**: Aceptado

**Fecha**: 2024-11 (Estimado según análisis de código)

**Autores**: Equipo de desarrollo ExpenseTracker

---

## Contexto

La aplicación ExpenseTracker requiere gestión de estado global para:

1. **Autenticación de Usuario**
   - Usuario actual autenticado
   - Token JWT
   - Estado de loading durante validación
   - Errores de autenticación

2. **Datos de Gastos**
   - Lista de gastos del usuario
   - Gastos filtrados por categoría/fecha
   - Estado de loading durante fetches
   - Caché de datos

3. **Categorías**
   - Categorías disponibles
   - Categorías personalizadas del usuario

**Requisitos de la solución:**
- Compartir estado entre múltiples componentes sin prop drilling
- Actualizaciones predecibles y rastreables
- Performance adecuado (evitar re-renders innecesarios)
- Debugging facilitado
- Curva de aprendizaje razonable
- Sin overhead de bibliotecas externas grandes

## Decisión

Decidimos usar **React Context API combinado con useReducer hook** para gestión de estado global, en lugar de bibliotecas de terceros como Redux.

**Implementación:**

1. **AuthContext** - Gestión de autenticación
2. **ExpenseContext** - Gestión de gastos y categorías

Patrón Flux-like con reducers para actualizaciones de estado predecibles.

**Evidencia en el código:**
- `/client/src/context/AuthContext.jsx:1-137` - Context de autenticación
- `/client/src/context/ExpenseContext.jsx` - Context de gastos
- `/client/src/App.jsx:15-16` - Providers anidados

```javascript
// AuthContext implementation
const AuthContext = createContext(null)

function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null }
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null
      }
    case 'AUTH_ERROR':
      return { ...state, loading: false, error: action.payload }
    case 'LOGOUT':
      return { ...initialState, loading: false, token: null }
    // ...
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const login = async (email, password) => {
    dispatch({ type: 'AUTH_START' })
    // ... API call
    dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

## Consecuencias

### Positivas

1. **Zero Dependencies**
   - No requiere instalación de bibliotecas adicionales
   - Bundle size reducido (vs Redux ~10KB)
   - Menos surface area para vulnerabilidades
   - Una dependency menos que mantener

2. **API Familiar**
   - Parte del core de React
   - Mismo pattern que useState pero escalado
   - Custom hooks para encapsular lógica
   - Documentación oficial de React

3. **Suficiente para el Alcance**
   - Dos contexts principales: Auth y Expenses
   - Estado no excesivamente complejo
   - No requiere time-travel debugging
   - No requiere middleware sofisticado

4. **Performance Adecuado**
   - Re-renders limitados a subscribers del context
   - Puede optimizarse con useMemo si necesario
   - Sin overhead de store global único
   - Contexts separados evitan updates innecesarios

5. **Debugging Razonable**
   - React DevTools muestra contexts
   - Actions tipadas en reducers
   - Fácil agregar logging en reducers
   - Stack traces claros

6. **Type Safety Posible**
   - Fácilmente migrable a TypeScript
   - Actions pueden ser type-checked
   - Estado tiene shape bien definido

7. **Testabilidad**
   - Fácil mockear contexts en tests
   - Reducers son funciones puras (easy to test)
   - Providers pueden wrappear componentes en tests

### Negativas

1. **No Hay DevTools Especializadas**
   - Sin Redux DevTools para time-travel
   - Sin visualización de action history
   - Debugging más manual
   - **Mitigación**: Agregar logging custom en reducers si necesario

2. **Boilerplate Moderado**
   - Cada context requiere:
     - Context creation
     - Reducer function
     - Provider component
     - Custom hook
   - Más código que useState simple
   - **Mitigación**: Templates reutilizables, generadores de código

3. **Prop Drilling en Funciones**
   - Funciones (login, logout) deben pasarse via Context
   - No hay `dispatch` global accesible
   - **Mitigación**: Custom hooks encapsulan acceso

4. **Re-render Considerations**
   - Todos los consumers re-renderizan cuando context cambia
   - Requiere optimización manual con useMemo/memo
   - **Impacto**: Limitado en este proyecto (pocos consumers por context)

5. **No Hay Middleware Ecosystem**
   - Sin Redux middleware (thunks, sagas)
   - Lógica async manual en action creators
   - Sin logging/crash reporting built-in
   - **Mitigación**: Lógica async en functions, no en reducers

6. **Escalabilidad Limitada**
   - Para apps muy grandes, puede volverse complejo
   - Sin patterns establecidos para organizarse a gran escala
   - **No aplica**: Proyecto es tamaño pequeño-mediano

## Alternativas Consideradas

### 1. Redux + Redux Toolkit

**Pros:**
- Store global único centralizado
- Redux DevTools excepcionales
- Time-travel debugging
- Middleware ecosystem (thunk, saga)
- Pattern muy establecido
- Escalabilidad probada

**Contras:**
- Overhead significativo (~10KB + 3KB Toolkit)
- Boilerplate considerable
- Curva de aprendizaje empinada
- Overkill para este proyecto
- Actions, reducers, store setup
- Conectar componentes complejo

**Razón de rechazo:** Complejidad innecesaria para el alcance del proyecto. El estado no es lo suficientemente complejo para justificar Redux. Context API es suficiente y más simple.

---

### 2. Zustand

**Pros:**
- API minimalista
- Bundle size pequeño (~1KB)
- Performance excelente
- Sin boilerplate
- No requiere providers
- TypeScript support excelente

**Contras:**
- Dependencia externa adicional
- Menos conocido que Redux
- Menos recursos educativos
- Pattern menos familiar para principiantes

**Razón de rechazo:** Aunque excelente, agrega dependency cuando Context API built-in es suficiente. Para un proyecto educativo, preferimos soluciones built-in de React.

---

### 3. Jotai / Recoil (Atomic State)

**Pros:**
- Modelo atómico de estado
- Re-renders muy optimizados
- Fácil compartir pequeños pedazos de estado
- API simple
- Performance excelente

**Contras:**
- Dependencia externa
- Paradigma diferente (atoms vs stores)
- Menos maduro que Redux
- Curva de aprendizaje adicional
- Menor adopción

**Razón de rechazo:** Paradigma atómico es overkill. El estado del proyecto se agrupa naturalmente en contexts (Auth, Expenses), no en átomos independientes.

---

### 4. MobX

**Pros:**
- Reactive programming automático
- Menos boilerplate que Redux
- Re-renders optimizados automáticamente
- API intuitiva
- Performance excelente

**Contras:**
- Paradigma muy diferente (OOP, observables)
- Curva de aprendizaje
- Debugging puede ser mágico/opaco
- Menos popular que Redux
- Decorators requieren config adicional

**Razón de rechazo:** Paradigma reactivo tiene curva de aprendizaje. Context API es más transparente y familiar para desarrolladores React.

---

### 5. useState + Props (Prop Drilling)

**Pros:**
- Más simple posible
- Sin abstracciones
- Fácil de entender
- No requiere Context API

**Contras:**
- Prop drilling excesivo (5+ niveles)
- Difícil mantener
- Re-renders innecesarios de componentes intermedios
- Tedioso pasar props por toda la jerarquía
- Difícil refactorizar estructura

**Razón de rechazo:** Prop drilling hace el código difícil de mantener. Con componentes anidados (Layout > Navbar > UserMenu), pasar props es tedioso y frágil.

---

### 6. Redux Query / React Query (Data Fetching)

**Pros:**
- Especializado en data fetching
- Caché automático
- Invalidación inteligente
- Optimistic updates
- Background refetching

**Contras:**
- Solo para server state
- No resuelve client state (UI state)
- Dependency adicional
- Curva de aprendizaje
- Requiere configuración

**Razón de rechazo:** Excelente para caché de API, pero no resuelve client state. Requeriría Context API de todas formas. Complexity adicional no justificada por el alcance del proyecto.

## Notas de Implementación

### Estructura de Contexts

```
src/context/
├── AuthContext.jsx       # Autenticación, usuario, token
└── ExpenseContext.jsx    # Gastos, categorías, filtros
```

### Provider Hierarchy

```javascript
// App.jsx
<AuthProvider>
  <ExpenseProvider>
    <Routes>
      {/* Application routes */}
    </Routes>
  </ExpenseProvider>
</AuthProvider>
```

**Orden importante**: `AuthProvider` primero porque `ExpenseProvider` puede necesitar información de autenticación.

### Custom Hooks Pattern

```javascript
// Hook personalizado facilita consumo
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Uso en componente
function Dashboard() {
  const { user, logout } = useAuth()
  return <div>Welcome {user.firstName}</div>
}
```

### Estado de AuthContext

```javascript
const initialState = {
  user: null,           // User object o null
  token: localStorage.getItem('token'),
  loading: true,        // Loading estado inicial
  error: null          // Error message si existe
}
```

### Actions de AuthContext

- `AUTH_START` - Inicia operación de auth
- `AUTH_SUCCESS` - Login/register exitoso
- `AUTH_ERROR` - Error en auth
- `LOGOUT` - Cierra sesión
- `SET_LOADING` - Cambia estado loading
- `CLEAR_ERROR` - Limpia errores

### Persistencia de Estado

```javascript
// Token persiste en localStorage
useEffect(() => {
  const initializeAuth = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      // Validate token with backend
      const response = await api.get('/auth/me')
      dispatch({ type: 'AUTH_SUCCESS', payload: { user: response.data.user, token } })
    }
  }
  initializeAuth()
}, [])
```

## Optimizaciones Posibles (Futuras)

Si el proyecto crece y performance se vuelve problema:

1. **Split Contexts**
   ```javascript
   // Separar estado de funciones para evitar re-renders
   <AuthStateContext.Provider>
     <AuthDispatchContext.Provider>
   ```

2. **useMemo para Values**
   ```javascript
   const value = useMemo(() => ({
     ...state, login, logout
   }), [state])
   ```

3. **Selectores con useMemo**
   ```javascript
   const filteredExpenses = useMemo(() =>
     expenses.filter(e => e.category === selectedCategory),
     [expenses, selectedCategory]
   )
   ```

## Referencias

1. [React Context API Documentation](https://react.dev/reference/react/useContext)
2. [useReducer Hook](https://react.dev/reference/react/useReducer)
3. [You Might Not Need Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367) - Dan Abramov
4. [AuthContext.jsx](/client/src/context/AuthContext.jsx) - Implementación real
5. [App.jsx](/client/src/App.jsx) - Provider hierarchy

## Estado del ADR

Este ADR está **ACEPTADO**. La decisión ha sido validada por:

- Simplicidad del código resultante
- Performance adecuado sin optimizaciones
- Facilidad de onboarding de nuevos desarrolladores
- Sin quejas del equipo sobre gestión de estado

Si el proyecto crece significativamente (10x features), se reconsideraría Redux Toolkit o Zustand.

**Umbral de reconsideración**:
- Más de 5 contexts globales
- Necesidad de time-travel debugging
- Performance issues por re-renders excesivos

Por ahora: **No action needed**.

---

**Última actualización**: 2025-11-05
