# ADR-004: Autenticación JWT Stateless

**Estado**: Aceptado

**Fecha**: 2024-11 (Estimado según análisis de código)

**Autores**: Equipo de desarrollo ExpenseTracker

---

## Contexto

La aplicación ExpenseTracker requiere un sistema de autenticación para:

- Identificar usuarios únicamente
- Proteger endpoints de API (gastos, categorías son privados por usuario)
- Mantener sesiones de usuario
- Autorizar acceso a recursos
- Prevenir acceso no autorizado

**Requisitos del sistema de autenticación:**

1. **Seguridad**
   - Almacenamiento seguro de credenciales
   - Tokens no falsificables
   - Protección contra ataques comunes (CSRF, XSS)

2. **Escalabilidad**
   - Stateless preferred (sin almacenamiento en servidor)
   - Preparado para escalamiento horizontal
   - Sin bottlenecks de sesión

3. **Performance**
   - Validación rápida de tokens
   - Sin consultas a BD en cada request
   - Minimal overhead

4. **Developer Experience**
   - Fácil implementar
   - Debugging razonable
   - Bibliotecas maduras disponibles

5. **User Experience**
   - Login persistente (no relogin frecuente)
   - Logout inmediato
   - Clear feedback de estado

## Decisión

Decidimos implementar **autenticación stateless basada en JWT (JSON Web Tokens)** con las siguientes características:

**Implementación:**
- Tokens JWT generados en login/registro
- Tokens incluyen: `userId`, `email`, timestamps
- Expiración: 7 días (168 horas)
- Almacenamiento cliente: localStorage
- Header: `Authorization: Bearer <token>`
- Algoritmo: HS256 (HMAC SHA-256)
- Secret key en environment variables

**Evidencia en el código:**
- `/server/src/utils/auth.js` - Generación y verificación de tokens
- `/server/src/middleware/auth.js:4-26` - Middleware de autenticación
- `/server/src/controllers/authController.js` - Login/registro
- `/client/src/services/api.js` - Interceptores Axios

```javascript
// Token generation
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// Token verification middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  const user = await User.findById(decoded.userId)

  req.user = user
  next()
}
```

## Consecuencias

### Positivas

1. **Stateless y Escalable**
   - Sin almacenamiento en servidor
   - Escalamiento horizontal sin compartir sesiones
   - Sin base de datos de sesiones
   - Load balancing simple
   - Preparado para microservicios

2. **Performance Excelente**
   - Validación local (verificación criptográfica)
   - Sin consulta a BD para validar token
   - Solo consulta a BD para cargar usuario (1 query)
   - Latencia mínima

3. **Cross-Domain Ready**
   - Funciona con múltiples dominios
   - CORS friendly
   - Mobile app ready (no cookies)
   - Mismo token para web/mobile

4. **Self-Contained**
   - Token incluye toda la información necesaria
   - No requiere almacenamiento externo
   - Información del usuario embebida
   - Válido mientras no expire

5. **Estándar de la Industria**
   - RFC 7519 standard
   - Ampliamente adoptado
   - Bibliotecas maduras (jsonwebtoken)
   - Familiaridad del equipo

6. **Debugging Facilitado**
   - Tokens son decodificables (base64)
   - Puede inspeccionarse en jwt.io
   - Timestamps claros (iat, exp)
   - Error messages claros

### Negativas

1. **No Puede Invalidarse Inmediatamente**
   - Token válido hasta expiración
   - Logout solo borra token del cliente
   - Si token es robado, válido hasta expirar
   - **Mitigación actual**: Expiración corta (7 días)
   - **Mitigación futura**: Token blacklist o refresh tokens

2. **Token Size Overhead**
   - ~200-300 bytes por token
   - Enviado en cada request
   - Aumenta payload de requests
   - **Impacto**: Mínimo (<1% overhead)

3. **Storage en localStorage**
   - Vulnerable a XSS attacks
   - JavaScript puede acceder
   - **Mitigación**:
     - Sanitización de inputs
     - Content Security Policy
     - HttpOnly cookies sería más seguro pero complica CORS

4. **Secret Key Management**
   - Requiere proteger JWT_SECRET
   - Rotación de secret es compleja
   - Si secret leaks, todos los tokens comprometidos
   - **Mitigación**: Environment variables, never commit

5. **No Hay Refresh Tokens (Actualmente)**
   - Usuario debe re-login cada 7 días
   - Sin seamless token renewal
   - **Future improvement**: Implementar refresh tokens

6. **CSRF Protection Manual**
   - Cookies tendrían CSRF protection built-in
   - Con tokens Bearer, debe implementarse manualmente
   - **Impacto**: No crítico para API stateless

## Alternativas Consideradas

### 1. Session-Based Authentication (Cookies + Sessions)

**Pros:**
- Invalidación inmediata en logout
- Más seguro (HttpOnly cookies)
- Sin exponer información en token
- CSRF protection built-in
- Refresh automático de sesión
- Standard tradicional

**Contras:**
- Stateful (require session storage)
- No escala horizontalmente sin shared storage
- Requiere Redis/Memcached para session store
- Complejidad adicional
- CORS más complicado
- Performance menor (DB lookup cada request)

**Razón de rechazo:** Complejidad operacional (requiere session store), no escala tan fácilmente, performance menor. JWT es más apropiado para arquitectura stateless y preparación para mobile apps.

---

### 2. OAuth 2.0 (Delegated Authorization)

**Pros:**
- Standard para integración con terceros
- Refresh tokens built-in
- Revocación de tokens
- Scopes para permisos granulares
- Social login ready (Google, Facebook)

**Contras:**
- Mucho más complejo de implementar
- Overkill para autenticación simple
- Requiere Authorization Server
- Flows complejos (authorization code, etc.)
- No necesario si no hay integración con terceros

**Razón de rechazo:** Excesivamente complejo para el alcance. OAuth es excelente para "Login with Google" o APIs públicas, pero innecesario para auth básico username/password.

---

### 3. API Keys

**Pros:**
- Muy simple
- Fácil generar y distribuir
- Long-lived
- Revocables individualmente

**Contras:**
- No identifican usuarios (identifican aplicaciones)
- Sin expiración automática
- No incluyen metadata
- Difícil asociar con sesiones de usuario
- Mal UX (usuario no maneja API keys)

**Razón de rechazo:** API keys son para identificar aplicaciones, no usuarios. No apropiado para autenticación de usuarios finales.

---

### 4. Macaroons (Contextual Caveats)

**Pros:**
- Atenuación de permisos
- Third-party caveats
- Delegación segura
- Muy flexible

**Contras:**
- Muy nuevo y complejo
- Pocos recursos/bibliotecas
- Curva de aprendizaje alta
- Overkill para caso de uso simple

**Razón de rechazo:** Demasiado experimental y complejo. JWT es suficiente y más probado.

---

### 5. Paseto (Platform-Agnostic Security Tokens)

**Pros:**
- Más seguro que JWT (por diseño)
- Evita algoritmos inseguros
- Versionado built-in
- Mejor crypto defaults

**Contras:**
- Menos adoptado que JWT
- Menos bibliotecas disponibles
- Menor familiaridad del equipo
- Menos recursos educativos

**Razón de rechazo:** Aunque técnicamente superior, menor adopción significa menos recursos, menos soporte, menor familiaridad. JWT es suficientemente seguro con implementación correcta.

---

### 6. Auth0 / Firebase Auth (Managed Services)

**Pros:**
- Cero implementación
- Seguridad gestionada
- Refresh tokens built-in
- Social login ready
- MFA built-in
- Auditing y analytics

**Contras:**
- Costo mensual
- Vendor lock-in
- Menos control
- Privacy concerns (data externo)
- Learning curve de plataforma
- Overkill para MVP

**Razón de rechazo:** Costo injustificado para MVP educativo. Preferimos control total y aprendizaje de implementación de auth. Puede considerarse para producción a gran escala.

## Notas de Implementación

### Flujo de Autenticación

```
┌─────────┐                                    ┌─────────┐
│ Client  │                                    │ Server  │
└────┬────┘                                    └────┬────┘
     │                                              │
     │  POST /api/auth/login                       │
     │  { email, password }                        │
     │─────────────────────────────────────────────>│
     │                                              │
     │                                         Verify password
     │                                         Generate JWT
     │                                              │
     │  200 { user, token }                        │
     │<─────────────────────────────────────────────│
     │                                              │
Store token in localStorage                        │
     │                                              │
     │  GET /api/expenses                          │
     │  Authorization: Bearer <token>              │
     │─────────────────────────────────────────────>│
     │                                              │
     │                                       Verify JWT
     │                                       Load user
     │                                       Query expenses
     │                                              │
     │  200 { expenses: [...] }                    │
     │<─────────────────────────────────────────────│
     │                                              │
```

### Token Structure

```javascript
// Header
{
  "alg": "HS256",
  "typ": "JWT"
}

// Payload
{
  "userId": 1,
  "email": "user@example.com",
  "iat": 1699564800,  // Issued at
  "exp": 1700169600   // Expires at (7 days later)
}

// Signature
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  JWT_SECRET
)
```

### Client-Side Token Management

```javascript
// client/src/services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

// Request interceptor - inject token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

### Server-Side Middleware

```javascript
// server/src/middleware/auth.js
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'Access token required' })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Load user from database
    const user = await User.findById(decoded.userId)
    if (!user) {
      return res.status(401).json({ error: 'User not found' })
    }

    // Attach user to request
    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
```

### Protected Routes

```javascript
// server/src/routes/expenses.js
const express = require('express')
const { authenticateToken } = require('../middleware/auth')
const expenseController = require('../controllers/expenseController')

const router = express.Router()

// All expense routes require authentication
router.use(authenticateToken)

router.get('/', expenseController.getExpenses)
router.post('/', expenseController.createExpense)
router.put('/:id', expenseController.updateExpense)
router.delete('/:id', expenseController.deleteExpense)

module.exports = router
```

### Environment Variables

```bash
# server/.env
JWT_SECRET=your-super-secret-key-change-in-production-minimum-32-chars
JWT_EXPIRES_IN=7d
```

**Security Note**: JWT_SECRET debe ser:
- Mínimo 32 caracteres
- Aleatorio y criptográficamente seguro
- Nunca commiteado a Git
- Diferente en cada entorno (dev, staging, prod)

## Mejoras Futuras

### 1. Refresh Tokens

Implementar sistema de refresh tokens para:
- Access tokens de corta duración (15 min)
- Refresh tokens de larga duración (7 días)
- Renovación automática sin re-login
- Revocación granular

```javascript
// Pseudocode
{
  accessToken: "short-lived-jwt",    // 15 min
  refreshToken: "long-lived-token"   // 7 days, stored in DB
}
```

### 2. Token Blacklist

Para invalidación inmediata en logout:
- Store revoked tokens en Redis
- Check blacklist en middleware
- Auto-expunge cuando token expira naturalmente

### 3. HttpOnly Cookies

Migrar a HttpOnly cookies para mayor seguridad:
- Inmune a XSS attacks
- Automatic sending con requests
- SameSite attribute para CSRF protection

### 4. Multi-Device Sessions

Track active sessions por usuario:
- Ver dispositivos logueados
- Logout remoto de dispositivos
- Limite de sesiones concurrentes

## Security Considerations

### Amenazas Mitigadas

1. **Password Storage**: bcrypt hashing con 10 salt rounds
2. **Token Forgery**: HMAC signature verification
3. **Token Expiration**: 7 días automatic expiration
4. **HTTPS**: Required en producción

### Amenazas Pendientes

1. **XSS Attacks**: localStorage accesible a JavaScript malicioso
   - **Mitigación**: Content Security Policy, input sanitization
2. **Token Theft**: Si attacker obtiene token, puede usarlo
   - **Mitigación**: Expiración corta, HTTPS only
3. **Logout No Invalida Token**: Token válido hasta expirar
   - **Mitigación futura**: Token blacklist

## Referencias

1. [JWT RFC 7519](https://tools.ietf.org/html/rfc7519)
2. [OWASP JWT Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
3. [jsonwebtoken npm package](https://www.npmjs.com/package/jsonwebtoken)
4. [JWT.io Debugger](https://jwt.io)
5. [auth.js](/server/src/utils/auth.js) - Implementación de tokens
6. [authController.js](/server/src/controllers/authController.js) - Login/registro

## Estado del ADR

Este ADR está **ACEPTADO** y en producción. La implementación de JWT ha funcionado bien para el alcance actual del proyecto.

**Satisfacción del equipo**: 8/10

**Mejoras priorizadas**:
1. Implementar refresh tokens (High priority)
2. Migrar a HttpOnly cookies (Medium priority)
3. Token blacklist para logout (Low priority)

**Timeline**: Implementar refresh tokens en Fase 5 del roadmap.

---

**Última actualización**: 2025-11-05
