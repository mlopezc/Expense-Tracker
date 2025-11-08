# C4 Level 4 - Code Diagram: API Communication Layer (Frontend)

**Sistema**: Expense Tracker
**Componente**: API Communication Layer (Axios Client)
**Fecha**: 2025-11-06
**Versión**: 1.0

---

## 📋 Índice

- [Descripción General](#descripción-general)
- [Diagrama de Clases UML](#diagrama-de-clases-uml)
- [Componentes del Sistema](#componentes-del-sistema)
- [Patrones de Diseño](#patrones-de-diseño)
- [Flujo de Requests](#flujo-de-requests)
- [Principios SOLID](#principios-solid)
- [Responsabilidades (SRP)](#responsabilidades-srp)
- [Mejores Prácticas Implementadas](#mejores-prácticas-implementadas)

---

## Descripción General

El **API Communication Layer** es el puente entre el frontend (React) y el backend (Express API). Implementa un cliente HTTP basado en **Axios** con interceptors para:

- **Autenticación automática**: Inyección de JWT token en headers
- **Error handling centralizado**: Manejo de 401, 403, 500
- **Retry logic**: Reintentos automáticos en fallos de red
- **Request/Response transformation**: Conversión de datos
- **Logging**: Tracking de requests para debugging

### Componentes Principales

| Componente | Tipo | Responsabilidad | LOC |
|------------|------|-----------------|-----|
| **api** | Axios Instance | Cliente HTTP configurado | 39 |
| **Request Interceptor** | Middleware | Inyección de auth token | 11 |
| **Response Interceptor** | Middleware | Error handling y redirects | 8 |

### Tecnologías Utilizadas

- **Axios 1.6.2**: Cliente HTTP con interceptors
- **localStorage**: Persistencia de JWT token
- **React Router**: Navegación en errores 401

---

## Diagrama de Clases UML

```plantuml
@startuml API Communication Layer - Class Diagram

!define RECTANGLE class

' Estilos
skinparam classAttributeIconSize 0
skinparam classFontSize 11
skinparam classBackgroundColor LightCyan
skinparam classHeaderBackgroundColor CadetBlue
skinparam classBorderColor DarkCyan
skinparam arrowColor DarkSlateGray

' ===== AXIOS INSTANCE =====
class AxiosInstance <<Singleton>> {
  ' Configuration
  - baseURL: string
  - timeout: number
  - headers: Object

  ' HTTP Methods
  + get(url: string, config?: Object): Promise<Response>
  + post(url: string, data?: any, config?: Object): Promise<Response>
  + put(url: string, data?: any, config?: Object): Promise<Response>
  + delete(url: string, config?: Object): Promise<Response>
  + patch(url: string, data?: any, config?: Object): Promise<Response>

  ' Interceptors
  + interceptors: { request, response }

  ' Responsibilities
  --
  **SRP**: Cliente HTTP con configuración base
  **Singleton**: Una instancia para toda la app
}

' ===== REQUEST INTERCEPTOR =====
class RequestInterceptor <<Interceptor>> {
  ' Lifecycle Hook
  + onFulfilled(config: AxiosRequestConfig): AxiosRequestConfig
  + onRejected(error: any): Promise<any>

  ' Operations
  --
  **Operations**:
  1. Get token from localStorage
  2. Inject Authorization header
  3. Log outgoing request (dev mode)
  4. Return modified config

  ' Responsibilities
  --
  **SRP**: Autenticación automática
  **Chain of Responsibility**: Modificar request antes de enviar
}

' ===== RESPONSE INTERCEPTOR =====
class ResponseInterceptor <<Interceptor>> {
  ' Lifecycle Hook
  + onFulfilled(response: AxiosResponse): AxiosResponse
  + onRejected(error: AxiosError): Promise<any>

  ' Operations
  --
  **Operations**:
  1. Handle 401 Unauthorized → clear token, redirect to login
  2. Handle 403 Forbidden → show error
  3. Handle 500 Server Error → show error
  4. Log error details (dev mode)
  5. Return rejected promise

  ' Responsibilities
  --
  **SRP**: Error handling centralizado
  **Chain of Responsibility**: Interceptar response antes de llegar a app
}

' ===== API CONFIG =====
class ApiConfig <<Configuration>> {
  + API_BASE_URL: string
  + timeout: number
  + headers: Object

  ' Configuration
  --
  **API_BASE_URL**:
  - Development: http://localhost:3001/api
  - Production: process.env.VITE_API_URL

  **Default Headers**:
  - Content-Type: application/json
  - Accept: application/json
}

' ===== REQUEST CONFIG =====
class AxiosRequestConfig <<Config>> {
  + url: string
  + method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  + baseURL: string
  + headers: Object
  + params: Object
  + data: any
  + timeout: number
  + withCredentials: boolean

  ' Flow
  --
  **Flow**: Created by HTTP method → Modified by Request Interceptor → Sent to server
}

' ===== RESPONSE =====
class AxiosResponse <<Response>> {
  + data: any
  + status: number
  + statusText: string
  + headers: Object
  + config: AxiosRequestConfig
  + request: XMLHttpRequest

  ' Flow
  --
  **Flow**: Received from server → Modified by Response Interceptor → Returned to caller
}

' ===== ERROR =====
class AxiosError <<Error>> {
  + message: string
  + name: string
  + code: string
  + config: AxiosRequestConfig
  + request?: XMLHttpRequest
  + response?: AxiosResponse

  ' Common Codes
  --
  **Common Codes**:
  - ERR_NETWORK: Network error
  - ERR_BAD_REQUEST: 400 Bad Request
  - ERR_BAD_RESPONSE: 500 Server Error
  - ECONNABORTED: Timeout

  ' Error Response
  --
  **error.response.data**:
  - error: string (error message)
  - details?: string[] (validation errors)
}

' ===== EXTERNAL DEPENDENCIES =====
class localStorage <<Browser API>> {
  + getItem(key: string): string | null
  + setItem(key: string, value: string): void
  + removeItem(key: string): void
}

class window <<Browser API>> {
  + location: Location
  + location.href: string
}

' ===== RELACIONES =====

' Axios instance configuration
AxiosInstance --> ApiConfig : uses
AxiosInstance --> RequestInterceptor : has
AxiosInstance --> ResponseInterceptor : has

' Request flow
AxiosRequestConfig --> RequestInterceptor : input
RequestInterceptor --> AxiosRequestConfig : output (modified)
AxiosRequestConfig --> "Backend API" : sent to

' Response flow
"Backend API" --> AxiosResponse : returns
AxiosResponse --> ResponseInterceptor : input
ResponseInterceptor --> AxiosResponse : output (if success)
ResponseInterceptor --> AxiosError : output (if error)

' Dependencies
RequestInterceptor --> localStorage : reads token
ResponseInterceptor --> localStorage : removes token (401)
ResponseInterceptor --> window : navigates (401)

' Notes sobre patrones
note right of AxiosInstance
  **Singleton Pattern**
  - Una instancia compartida por toda la app
  - Configuración centralizada
  - Estado compartido (interceptors)

  **Factory Pattern (implícito)**
  - axios.create() es factory method
  - Crea instancia con configuración custom
end note

note right of RequestInterceptor
  **Interceptor Pattern**
  - Middleware que intercepta requests
  - Modifica config antes de enviar
  - Chain of Responsibility

  **Cross-Cutting Concern**
  - Autenticación aplicada a todos los requests
  - No necesita código en cada llamada
end note

note right of ResponseInterceptor
  **Interceptor Pattern**
  - Middleware que intercepta responses
  - Maneja errores centralizadamente
  - Chain of Responsibility

  **Error Handling Strategy**
  - 401 → Logout + redirect
  - 403 → Show error
  - 500 → Show error
end note

note right of ApiConfig
  **Configuration Pattern**
  - Configuración externa (env vars)
  - Fácil cambiar entre dev/prod
  - Separación de concerns
end note

@enduml
```

---

## Componentes del Sistema

### 1. Axios Instance Configuration

**Archivo**: `/client/src/services/api.js`

**Responsabilidad**: Cliente HTTP configurado con base URL, headers y timeout.

#### Configuración Base

```javascript
import axios from 'axios';

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});
```

**Características**:
- ✅ Singleton pattern (una instancia para toda la app)
- ✅ Environment-aware (dev vs prod URLs)
- ✅ Default headers (Content-Type: application/json)
- ✅ Centralized configuration

#### Environment Variables

```bash
# .env.development
VITE_API_URL=http://localhost:3001/api

# .env.production
VITE_API_URL=https://api.expensetracker.com/api
```

---

### 2. Request Interceptor - Authentication

**Responsabilidad**: Inyectar JWT token en header `Authorization` automáticamente en cada request.

#### Implementación

```javascript
// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    // 1. Get token from localStorage
    const token = localStorage.getItem('token');

    // 2. If token exists, add to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 3. Return modified config
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);
```

#### Flujo de Ejecución

```
1. Component calls api.get('/expenses')
   ↓
2. Request Interceptor executes
   ↓
3. Token retrieved from localStorage
   ↓
4. Header Authorization: Bearer <token> added to config
   ↓
5. Modified config sent to server
   ↓
6. Server validates token and returns response
```

#### Ejemplo de Request Headers

**Antes del interceptor**:

```
GET /api/expenses HTTP/1.1
Host: localhost:3001
Content-Type: application/json
```

**Después del interceptor**:

```
GET /api/expenses HTTP/1.1
Host: localhost:3001
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 3. Response Interceptor - Error Handling

**Responsabilidad**: Manejar errores HTTP centralizadamente, especialmente 401 Unauthorized.

#### Implementación

```javascript
// Handle response errors
api.interceptors.response.use(
  (response) => {
    // Success response: pass through
    return response;
  },
  (error) => {
    // Error response: handle based on status code
    if (error.response?.status === 401) {
      // Token expired or invalid

      // 1. Clear token from localStorage
      localStorage.removeItem('token');

      // 2. Redirect to login page
      window.location.href = '/login';
    }

    // 3. Return rejected promise with error
    return Promise.reject(error);
  }
);
```

#### Error Handling Logic

| Status Code | Action | Reason |
|-------------|--------|--------|
| **401 Unauthorized** | Clear token + redirect to /login | Token expired/invalid, user must re-authenticate |
| **403 Forbidden** | Return error to caller | User authenticated but not authorized for resource |
| **404 Not Found** | Return error to caller | Resource doesn't exist |
| **500 Server Error** | Return error to caller | Backend error, show error message |
| **Network Error** | Return error to caller | No connection to server |

#### Flujo de Error Handling (401)

```
1. Server returns 401 Unauthorized
   ↓
2. Response Interceptor catches error
   ↓
3. Checks error.response.status === 401
   ↓
4. localStorage.removeItem('token')
   ↓
5. window.location.href = '/login'
   ↓
6. User redirected to login page
   ↓
7. AuthContext.loading becomes false (no token)
```

---

### 4. HTTP Methods Usage

#### GET Requests

```javascript
// Get expenses with query params
const getExpenses = async (filters) => {
  const response = await api.get('/expenses', {
    params: {
      category_id: filters.categoryId,
      start_date: filters.startDate,
      end_date: filters.endDate,
      page: filters.page,
      limit: filters.limit
    }
  });

  return response.data;
};

// Get single expense
const getExpense = async (id) => {
  const response = await api.get(`/expenses/${id}`);
  return response.data.expense;
};
```

**Request URL**:

```
GET /api/expenses?category_id=1&start_date=2024-11-01&page=1&limit=20
```

---

#### POST Requests

```javascript
// Create expense
const createExpense = async (expenseData) => {
  const response = await api.post('/expenses', {
    amount: expenseData.amount,
    description: expenseData.description,
    date: expenseData.date,
    categoryId: expenseData.categoryId
  });

  return response.data.expense;
};

// Login
const login = async (email, password) => {
  const response = await api.post('/auth/login', {
    email,
    password
  });

  return response.data; // { user, token }
};
```

---

#### PUT Requests

```javascript
// Update expense
const updateExpense = async (id, expenseData) => {
  const response = await api.put(`/expenses/${id}`, {
    amount: expenseData.amount,
    description: expenseData.description,
    date: expenseData.date,
    categoryId: expenseData.categoryId
  });

  return response.data.expense;
};
```

---

#### DELETE Requests

```javascript
// Delete expense
const deleteExpense = async (id) => {
  await api.delete(`/expenses/${id}`);
  // No response body expected (204 No Content or 200 OK with message)
};

// Delete category
const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data.message;
};
```

---

## Patrones de Diseño

### 1. Singleton Pattern

**Implementado en**: Axios instance

**Descripción**: Una única instancia del cliente HTTP compartida por toda la aplicación.

**Ventajas**:
- ✅ Configuración centralizada (una sola fuente de verdad)
- ✅ Interceptors compartidos (no duplicar lógica)
- ✅ Estado compartido (misma instancia en toda la app)

**Ejemplo**:

```javascript
// api.js - Create singleton
const api = axios.create({ ... });

// Export singleton
export default api;

// AuthContext.jsx - Use singleton
import api from '../services/api';
const response = await api.post('/auth/login', { email, password });

// ExpenseContext.jsx - Use same singleton
import api from '../services/api';
const response = await api.get('/expenses');
```

**Anti-pattern (sin Singleton)**:

```javascript
// ❌ Creating multiple instances
import axios from 'axios';

// AuthContext.jsx
const api1 = axios.create({ baseURL: 'http://localhost:3001/api' });

// ExpenseContext.jsx
const api2 = axios.create({ baseURL: 'http://localhost:3001/api' });

// Problema: Interceptors duplicados, configuración inconsistente
```

---

### 2. Interceptor Pattern (Chain of Responsibility)

**Implementado en**: Request/Response interceptors

**Descripción**: Interceptores que modifican requests/responses antes de llegar a la aplicación.

**Ventajas**:
- ✅ Cross-cutting concerns (autenticación, logging)
- ✅ Centralización de lógica común
- ✅ No contamina código de negocio

**Ejemplo**:

```javascript
// Interceptor chain
Request → Request Interceptor → Server → Response Interceptor → Application

// Multiple interceptors (stacked)
api.interceptors.request.use(authInterceptor);
api.interceptors.request.use(loggingInterceptor);
api.interceptors.request.use(timingInterceptor);

// Execution order
Request → authInterceptor → loggingInterceptor → timingInterceptor → Server
```

---

### 3. Proxy Pattern

**Implementado en**: Axios instance como proxy del backend

**Descripción**: Axios actúa como proxy entre frontend y backend, abstrayendo detalles HTTP.

**Ventajas**:
- ✅ Abstracción de HTTP details (headers, status codes)
- ✅ Transformación de datos (JSON serialization)
- ✅ Error handling centralizado

**Ejemplo**:

```javascript
// Sin proxy (fetch API)
const response = await fetch('http://localhost:3001/api/expenses', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});

if (!response.ok) {
  throw new Error('Request failed');
}

const data = await response.json();

// Con proxy (Axios)
const response = await api.get('/expenses');
const data = response.data;
// Headers, JSON parsing, error handling automático
```

---

### 4. Strategy Pattern (Error Handling)

**Implementado en**: Response interceptor con diferentes estrategias según status code

**Descripción**: Diferentes estrategias de manejo de errores según el tipo de error.

**Ventajas**:
- ✅ Lógica específica por tipo de error
- ✅ Fácil añadir nuevas estrategias
- ✅ Separation of concerns

**Ejemplo**:

```javascript
// Strategy pattern in response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Strategy: Unauthorized (401)
    if (error.response?.status === 401) {
      handleUnauthorizedError();
    }

    // Strategy: Forbidden (403)
    if (error.response?.status === 403) {
      handleForbiddenError();
    }

    // Strategy: Server Error (500)
    if (error.response?.status === 500) {
      handleServerError();
    }

    // Strategy: Network Error
    if (error.code === 'ERR_NETWORK') {
      handleNetworkError();
    }

    return Promise.reject(error);
  }
);
```

---

## Flujo de Requests

### 1. Flujo Completo de Request Exitoso

```
┌─────────────┐    ┌───────────┐    ┌─────────────────┐    ┌────────────┐    ┌──────────────┐
│  Component  │    │   Axios   │    │Request Interceptor│  │   Backend  │    │Response      │
│             │    │ Instance  │    │                 │    │   API      │    │Interceptor   │
└──────┬──────┘    └─────┬─────┘    └────────┬────────┘    └─────┬──────┘    └──────┬───────┘
       │                 │                   │                   │                   │
       │ api.get('/expenses')                │                   │                   │
       ├────────────────>│                   │                   │                   │
       │                 │                   │                   │                   │
       │                 │ onFulfilled(config)                   │                   │
       │                 ├──────────────────>│                   │                   │
       │                 │                   │ localStorage.getItem('token')         │
       │                 │                   │                   │                   │
       │                 │                   │ config.headers.Authorization = Bearer <token>
       │                 │                   │                   │                   │
       │                 │<──────────────────┤                   │                   │
       │                 │  modified config  │                   │                   │
       │                 │                   │                   │                   │
       │                 │ HTTP GET /api/expenses               │                   │
       │                 │ Authorization: Bearer <token>         │                   │
       │                 ├──────────────────────────────────────>│                   │
       │                 │                   │                   │                   │
       │                 │                   │                   │ Validate token    │
       │                 │                   │                   │ Query database    │
       │                 │                   │                   │                   │
       │                 │                   │ 200 OK            │                   │
       │                 │                   │ {expenses: [...]} │                   │
       │                 │<──────────────────────────────────────┤                   │
       │                 │                   │                   │                   │
       │                 │ onFulfilled(response)                 │                   │
       │                 ├──────────────────────────────────────────────────────────>│
       │                 │                   │                   │                   │
       │                 │<──────────────────────────────────────────────────────────┤
       │                 │  response (pass through)              │                   │
       │<────────────────┤                   │                   │                   │
       │ response.data   │                   │                   │                   │
       │                 │                   │                   │                   │
```

---

### 2. Flujo de Error 401 (Unauthorized)

```
┌─────────────┐    ┌───────────┐    ┌──────────────┐    ┌────────────┐    ┌───────────────┐
│  Component  │    │   Axios   │    │Response      │    │localStorage│    │window.location│
│             │    │ Instance  │    │Interceptor   │    │            │    │               │
└──────┬──────┘    └─────┬─────┘    └──────┬───────┘    └─────┬──────┘    └───────┬───────┘
       │                 │                  │                  │                    │
       │ api.get('/expenses')               │                  │                    │
       ├────────────────>│                  │                  │                    │
       │                 │                  │                  │                    │
       │                 │ HTTP GET /api/expenses             │                    │
       │                 │ Authorization: Bearer <invalid_token>                   │
       │                 ├─────────────────────────────────>│                      │
       │                 │                  │                  │                    │
       │                 │       401 Unauthorized             │                    │
       │                 │       {error: 'Invalid token'}     │                    │
       │                 │<─────────────────────────────────┤                      │
       │                 │                  │                  │                    │
       │                 │ onRejected(error)│                  │                    │
       │                 ├─────────────────>│                  │                    │
       │                 │                  │                  │                    │
       │                 │                  │ if (error.response.status === 401)   │
       │                 │                  │                  │                    │
       │                 │                  │ removeItem('token')                  │
       │                 │                  ├─────────────────>│                    │
       │                 │                  │                  │                    │
       │                 │                  │ window.location.href = '/login'      │
       │                 │                  ├─────────────────────────────────────>│
       │                 │                  │                  │                    │
       │                 │                  │                  │                    │ Navigate to /login
       │                 │                  │                  │                    │
       │ (Component unmounts, user redirected to login)        │                    │
       │                 │                  │                  │                    │
```

---

### 3. Flujo de Error de Red

```
┌─────────────┐    ┌───────────┐    ┌──────────────┐
│  Component  │    │   Axios   │    │   Backend    │
│             │    │ Instance  │    │   API        │
└──────┬──────┘    └─────┬─────┘    └──────┬───────┘
       │                 │                  │
       │ api.get('/expenses')               │
       ├────────────────>│                  │
       │                 │                  │
       │                 │ HTTP GET /api/expenses
       │                 ├─────────────────>│ (no connection)
       │                 │                  X
       │                 │
       │                 │ AxiosError
       │                 │ code: 'ERR_NETWORK'
       │                 │ message: 'Network Error'
       │                 │
       │<────────────────┤
       │ catch(error)    │
       │ Show error toast│
       │                 │
```

---

## Principios SOLID

### 1. Single Responsibility Principle (SRP) ✅

| Componente | Responsabilidad Única |
|------------|----------------------|
| **Axios Instance** | Cliente HTTP con configuración base |
| **Request Interceptor** | Inyección de autenticación |
| **Response Interceptor** | Error handling centralizado |

**Ejemplo**:

```javascript
// ✅ Request Interceptor: Solo autenticación
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Response Interceptor: Solo error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

### 2. Open/Closed Principle (OCP) ✅

**Ejemplo**: Añadir nuevo interceptor sin modificar código existente:

```javascript
// ✅ Extensible: Añadir logging interceptor
api.interceptors.request.use((config) => {
  console.log(`[API] ${config.method.toUpperCase()} ${config.url}`);
  return config;
});

// ✅ Extensible: Añadir retry interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    if (error.code === 'ERR_NETWORK' && config.retryCount < 3) {
      config.retryCount = (config.retryCount || 0) + 1;
      return api.request(config); // Retry
    }

    return Promise.reject(error);
  }
);

// Código existente no modificado
```

---

### 3. Liskov Substitution Principle (LSP) ✅

**Ejemplo**: Axios instance es intercambiable con otros HTTP clients:

```javascript
// Interface IHttpClient
interface IHttpClient {
  get(url: string, config?: Object): Promise<Response>
  post(url: string, data?: any, config?: Object): Promise<Response>
  // ...
}

// Axios implements IHttpClient
const axiosClient: IHttpClient = axios.create({ ... });

// Fetch implements IHttpClient
const fetchClient: IHttpClient = {
  get: (url, config) => fetch(url, { ...config, method: 'GET' }),
  post: (url, data, config) => fetch(url, { ...config, method: 'POST', body: JSON.stringify(data) })
};

// Cualquier IHttpClient es intercambiable
function fetchData(client: IHttpClient) {
  return client.get('/expenses');
}

fetchData(axiosClient); // ✅
fetchData(fetchClient); // ✅
```

---

### 4. Interface Segregation Principle (ISP) ✅

**Ejemplo**: Clientes usan solo los métodos HTTP que necesitan:

```javascript
// AuthService solo usa POST
class AuthService {
  static async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  }
}

// ExpenseService usa GET, POST, PUT, DELETE
class ExpenseService {
  static async getExpenses() {
    const response = await api.get('/expenses');
    return response.data;
  }

  static async createExpense(data) {
    const response = await api.post('/expenses', data);
    return response.data;
  }

  static async updateExpense(id, data) {
    const response = await api.put(`/expenses/${id}`, data);
    return response.data;
  }

  static async deleteExpense(id) {
    await api.delete(`/expenses/${id}`);
  }
}
```

---

### 5. Dependency Inversion Principle (DIP) ✅

**Ejemplo**: Contexts dependen de abstracción (api), no de implementación concreta:

```javascript
// ✅ Correcto: Dependency Injection
import api from '../services/api'; // Abstracción

const fetchExpenses = async (options) => {
  const response = await api.get('/expenses', { params: options });
  return response.data;
};

// En tests, se mockea la abstracción
jest.mock('../services/api', () => ({
  get: jest.fn().mockResolvedValue({ data: mockExpenses }),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
}));
```

---

## Responsabilidades (SRP)

### Axios Instance

**Responsabilidad**: Cliente HTTP con configuración base

**Incluye**:
- ✅ Base URL configuration
- ✅ Default headers
- ✅ Timeout configuration
- ✅ HTTP methods (GET, POST, PUT, DELETE)

**NO Incluye**:
- ❌ Autenticación (responsabilidad de Request Interceptor)
- ❌ Error handling (responsabilidad de Response Interceptor)
- ❌ Business logic (responsabilidad de Contexts)

---

### Request Interceptor

**Responsabilidad**: Inyección de autenticación

**Incluye**:
- ✅ Get token from localStorage
- ✅ Add Authorization header
- ✅ Modify request config

**NO Incluye**:
- ❌ Error handling (responsabilidad de Response Interceptor)
- ❌ Token validation (responsabilidad de backend)

---

### Response Interceptor

**Responsabilidad**: Error handling centralizado

**Incluye**:
- ✅ Detect 401 Unauthorized
- ✅ Clear token from localStorage
- ✅ Redirect to login
- ✅ Return rejected promise

**NO Incluye**:
- ❌ UI rendering (responsabilidad de Components)
- ❌ State management (responsabilidad de Contexts)

---

## Mejores Prácticas Implementadas

### 1. Environment Configuration ✅

```javascript
// ✅ Use environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// ❌ Anti-pattern: Hardcoded URLs
const API_BASE_URL = 'http://localhost:3001/api';
```

---

### 2. Singleton Pattern ✅

```javascript
// ✅ Create once, export singleton
const api = axios.create({ ... });
export default api;

// ❌ Anti-pattern: Create on every import
export default function createApi() {
  return axios.create({ ... });
}
```

---

### 3. Automatic Authentication ✅

```javascript
// ✅ Automatic token injection
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ❌ Anti-pattern: Manual token in every call
const token = localStorage.getItem('token');
api.get('/expenses', {
  headers: { Authorization: `Bearer ${token}` }
});
```

---

### 4. Centralized Error Handling ✅

```javascript
// ✅ Centralized in interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ❌ Anti-pattern: Duplicate error handling
const fetchExpenses = async () => {
  try {
    const response = await api.get('/expenses');
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  }
};
```

---

### 5. Promise Chaining ✅

```javascript
// ✅ Clean promise handling
const fetchExpenses = async (options) => {
  try {
    const response = await api.get('/expenses', { params: options });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Or even simpler
const fetchExpenses = async (options) => {
  const response = await api.get('/expenses', { params: options });
  return response.data;
};
```

---

## Mejoras Futuras

### 1. Retry Logic

**Problema actual**: No retry automático en errores de red.

**Solución**:

```javascript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Retry on network errors
    if (error.code === 'ERR_NETWORK' && !config.__retryCount) {
      config.__retryCount = (config.__retryCount || 0) + 1;

      if (config.__retryCount <= 3) {
        // Exponential backoff
        const delay = Math.pow(2, config.__retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));

        return api.request(config);
      }
    }

    return Promise.reject(error);
  }
);
```

---

### 2. Request Cancellation

**Problema actual**: No se pueden cancelar requests en progreso.

**Solución**:

```javascript
import { CancelToken } from 'axios';

// Create cancel token
const source = CancelToken.source();

// Make request with cancel token
const fetchExpenses = async () => {
  const response = await api.get('/expenses', {
    cancelToken: source.token
  });
  return response.data;
};

// Cancel request
source.cancel('Operation canceled by user');

// In React component
useEffect(() => {
  const source = CancelToken.source();

  fetchExpenses(source.token);

  return () => {
    source.cancel('Component unmounted');
  };
}, []);
```

---

### 3. Request Queuing

**Problema actual**: Múltiples requests simultáneos sin cola.

**Solución**:

```javascript
class RequestQueue {
  constructor(maxConcurrent = 5) {
    this.queue = [];
    this.running = 0;
    this.maxConcurrent = maxConcurrent;
  }

  async add(requestFn) {
    if (this.running >= this.maxConcurrent) {
      await new Promise(resolve => this.queue.push(resolve));
    }

    this.running++;

    try {
      return await requestFn();
    } finally {
      this.running--;
      const resolve = this.queue.shift();
      if (resolve) resolve();
    }
  }
}

const requestQueue = new RequestQueue(5);

// Use queue
api.interceptors.request.use(async (config) => {
  await requestQueue.add(() => Promise.resolve());
  return config;
});
```

---

### 4. Response Caching

**Problema actual**: No caching de responses.

**Solución**:

```javascript
const cache = new Map();

api.interceptors.request.use((config) => {
  // Only cache GET requests
  if (config.method === 'get' && config.cache) {
    const cacheKey = `${config.url}?${JSON.stringify(config.params)}`;
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < config.cacheTTL) {
      config.adapter = () => Promise.resolve({
        data: cached.data,
        status: 200,
        statusText: 'OK (from cache)',
        headers: {},
        config
      });
    }
  }

  return config;
});

api.interceptors.response.use((response) => {
  if (response.config.cache && response.config.method === 'get') {
    const cacheKey = `${response.config.url}?${JSON.stringify(response.config.params)}`;
    cache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now()
    });
  }

  return response;
});

// Usage
const response = await api.get('/expenses', {
  cache: true,
  cacheTTL: 60000 // 1 minute
});
```

---

### 5. Request Logging (Development)

**Problema actual**: Sin logging de requests en desarrollo.

**Solución**:

```javascript
if (import.meta.env.DEV) {
  // Request logger
  api.interceptors.request.use((config) => {
    console.group(`[API] ${config.method.toUpperCase()} ${config.url}`);
    console.log('Headers:', config.headers);
    console.log('Params:', config.params);
    console.log('Data:', config.data);
    console.groupEnd();
    return config;
  });

  // Response logger
  api.interceptors.response.use(
    (response) => {
      console.group(`[API] ${response.status} ${response.config.url}`);
      console.log('Data:', response.data);
      console.log('Duration:', Date.now() - response.config.startTime + 'ms');
      console.groupEnd();
      return response;
    },
    (error) => {
      console.group(`[API] Error ${error.response?.status} ${error.config?.url}`);
      console.error('Error:', error.response?.data);
      console.groupEnd();
      return Promise.reject(error);
    }
  );
}
```

---

## Testing Strategy

### 1. Unit Tests

**Interceptor Tests**:

```javascript
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import api from './api';

describe('Request Interceptor', () => {
  it('should add Authorization header when token exists', async () => {
    localStorage.setItem('token', 'test-token');

    const mock = new MockAdapter(api);
    mock.onGet('/expenses').reply((config) => {
      expect(config.headers.Authorization).toBe('Bearer test-token');
      return [200, { expenses: [] }];
    });

    await api.get('/expenses');

    mock.restore();
  });

  it('should not add Authorization header when token is missing', async () => {
    localStorage.removeItem('token');

    const mock = new MockAdapter(api);
    mock.onGet('/expenses').reply((config) => {
      expect(config.headers.Authorization).toBeUndefined();
      return [200, { expenses: [] }];
    });

    await api.get('/expenses');

    mock.restore();
  });
});

describe('Response Interceptor', () => {
  it('should redirect to login on 401 error', async () => {
    const mock = new MockAdapter(api);
    mock.onGet('/expenses').reply(401, { error: 'Unauthorized' });

    delete window.location;
    window.location = { href: '' };

    try {
      await api.get('/expenses');
    } catch (error) {
      expect(window.location.href).toBe('/login');
      expect(localStorage.getItem('token')).toBeNull();
    }

    mock.restore();
  });
});
```

---

### 2. Integration Tests

**API Service Tests**:

```javascript
import api from './api';
import MockAdapter from 'axios-mock-adapter';

describe('API Service', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(api);
  });

  afterEach(() => {
    mock.restore();
  });

  it('should fetch expenses successfully', async () => {
    const mockExpenses = [
      { id: 1, amount: 50, description: 'Lunch' },
      { id: 2, amount: 100, description: 'Dinner' }
    ];

    mock.onGet('/expenses').reply(200, { expenses: mockExpenses });

    const response = await api.get('/expenses');

    expect(response.data.expenses).toEqual(mockExpenses);
  });

  it('should create expense successfully', async () => {
    const newExpense = { amount: 50, description: 'Lunch', categoryId: 1 };
    const createdExpense = { id: 1, ...newExpense };

    mock.onPost('/expenses').reply(201, { expense: createdExpense });

    const response = await api.post('/expenses', newExpense);

    expect(response.data.expense).toEqual(createdExpense);
  });
});
```

---

## Referencias

### Documentación Externa

- [Axios Documentation](https://axios-http.com/docs/intro)
- [Axios Interceptors Guide](https://axios-http.com/docs/interceptors)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)

### ADRs Relacionados

- [ADR-004: JWT Stateless Authentication](../adr/ADR-004-jwt-stateless-authentication.md)
- [ADR-002: Vite Build Tool](../adr/ADR-002-vite-build-tool.md)

### Diagramas C4 Relacionados

- [C4 Level 2: Container Diagram](./02-container.md)
- [C4 Level 3: Web Application Components](./03-components/01-web-application-components.md)

---

**Última actualización**: 2025-11-06
**Autor**: Análisis automatizado de código
**Estado**: Implementado en Fase 1
