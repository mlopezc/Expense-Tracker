# C4 Model - Level 1: System Context Diagram

**Proyecto:** ExpenseTracker
**Versión:** 1.0
**Fecha:** 2025-11-05
**Nivel:** Context (C4 Level 1)

---

## 1. Introducción

Este documento describe el **Diagrama de Contexto** (C4 Level 1) del sistema ExpenseTracker. El diagrama de contexto muestra una vista de alto nivel del sistema, sus usuarios, y los sistemas externos con los que interactúa.

### Propósito del Diagrama de Contexto

El diagrama de contexto establece:
- Los **límites del sistema** ExpenseTracker
- Los **actores externos** (personas) que interactúan con el sistema
- Los **sistemas externos** con los que se integra
- Las **relaciones y flujos de datos** principales entre entidades

### Audiencia

Este diagrama es útil para:
- **Stakeholders no técnicos**: Visión general del sistema
- **Arquitectos**: Comprensión de las dependencias externas
- **Desarrolladores**: Contexto de las integraciones
- **Product Owners**: Alcance funcional del sistema

---

## 2. Diagrama de Contexto (PlantUML)

```plantuml
@startuml C4_Context_ExpenseTracker
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml

' Título y descripción
title System Context Diagram for ExpenseTracker

' Definición de personas (actores externos)
Person(user, "Personal User", "Individual who wants to track and analyze their personal expenses, manage budgets, and understand spending habits.")

' Sistema principal
System(expenseTracker, "Expense Tracker System", "Allows users to record, categorize, analyze expenses, generate reports, and manage personal finances. Provides web-based interface for expense management.")

' Sistemas externos
System_Ext(database, "Database System", "Stores user accounts, expense records, categories, and transaction history. SQLite (development) or PostgreSQL (production).")

System_Ext(fileStorage, "File Storage System", "Stores receipt images and attachments uploaded by users. Local file system or cloud storage.")

System_Ext(emailService, "Email Service", "Sends transactional emails for password resets, account notifications, and expense alerts. (Future enhancement)")

System_Ext(exportService, "Data Export Service", "Generates CSV, PDF, and Excel reports from expense data for external analysis. (Future enhancement)")

' Relaciones entre actores y sistemas
Rel(user, expenseTracker, "Uses", "HTTPS, Web Browser")
Rel_Down(user, expenseTracker, "Manages expenses, views reports, exports data")

Rel(expenseTracker, database, "Reads from and writes to", "SQL Protocol / JDBC")
Rel_Down(expenseTracker, database, "Stores and retrieves expense data, user information, categories")

Rel(expenseTracker, fileStorage, "Uploads and retrieves", "File System API")
Rel_Down(expenseTracker, fileStorage, "Stores receipt images and documents")

Rel(expenseTracker, emailService, "Sends emails using", "SMTP / API", "Future")
Rel_Down(expenseTracker, emailService, "Password resets, notifications")

Rel(expenseTracker, exportService, "Generates reports using", "REST API / Library", "Future")
Rel_Down(expenseTracker, exportService, "CSV, PDF export functionality")

' Notas adicionales
note right of expenseTracker
  **Technology Stack:**
  - Frontend: React 18 + Vite
  - Backend: Express.js + Node.js
  - Auth: JWT Tokens
  - API: RESTful
end note

note right of database
  **Current State:**
  - Development: SQLite
  - Production: PostgreSQL (planned)
  **Data Stored:**
  - Users, Expenses, Categories
  - Transaction history
end note

SHOW_LEGEND()

@enduml
```

---

## 3. Descripción del Sistema

### 3.1 Sistema Principal: Expense Tracker

**Descripción General:**
ExpenseTracker es una aplicación web full-stack diseñada para ayudar a usuarios individuales a gestionar sus finanzas personales. El sistema permite registrar gastos diarios, organizarlos por categorías, visualizar patrones de gasto mediante gráficos, y generar reportes para análisis financiero.

**Características Principales:**
- Registro y autenticación de usuarios con JWT
- CRUD completo de gastos (crear, leer, actualizar, eliminar)
- Gestión de categorías personalizadas y predefinidas
- Visualización de datos con gráficos (Chart.js)
- Filtrado y búsqueda de gastos por fecha, categoría, monto
- Adjuntar recibos (imágenes) a transacciones
- Exportación de datos en formato CSV/JSON
- Dashboard con resumen de gastos y estadísticas
- Reportes mensuales y anuales

**Tecnología:**
- **Frontend**: React 18.2.0, Vite 5.0.0, Tailwind CSS
- **Backend**: Express.js 4.18.2, Node.js
- **Autenticación**: JWT (JSON Web Tokens)
- **API**: REST con formato JSON

**Límites del Sistema:**
El sistema **incluye**:
- Interfaz web de usuario (SPA React)
- API REST backend
- Lógica de negocio de gestión de gastos
- Sistema de autenticación y autorización
- Procesamiento de datos y generación de estadísticas

El sistema **excluye**:
- Gestión de base de datos (considerado sistema externo)
- Almacenamiento físico de archivos (sistema externo)
- Envío de emails (sistema externo, futuro)
- Procesamiento de imágenes avanzado (OCR, futuro)
- Integración con bancos o servicios financieros

---

## 4. Actores Externos (Personas)

### Tabla de Actores

| Actor | Tipo | Descripción | Responsabilidades | Interacciones Principales |
|-------|------|-------------|-------------------|---------------------------|
| **Personal User** | Usuario Final | Individuo que desea rastrear y analizar sus gastos personales | - Registrarse en el sistema<br>- Iniciar sesión<br>- Crear, editar, eliminar gastos<br>- Gestionar categorías<br>- Ver dashboards y reportes<br>- Exportar datos<br>- Adjuntar recibos | - Accede vía navegador web (HTTPS)<br>- Interactúa con UI React<br>- Consume API REST<br>- Sube archivos (recibos) |

### Detalles del Actor: Personal User

**Perfil de Usuario:**
- **Demografía**: Adultos de 18-65 años
- **Nivel Técnico**: Usuario básico de computadora
- **Motivación**: Control de finanzas personales, presupuestos, análisis de gastos
- **Dispositivos**: Desktop, laptop, tablet (responsive design)

**Casos de Uso Principales:**
1. **Registro y Login**
   - Crear cuenta nueva con email y contraseña
   - Autenticarse con credenciales
   - Recuperar contraseña olvidada (futuro)

2. **Gestión de Gastos**
   - Añadir gasto nuevo (monto, descripción, categoría, fecha)
   - Editar gastos existentes
   - Eliminar gastos
   - Adjuntar recibo fotográfico a gasto
   - Buscar y filtrar gastos

3. **Gestión de Categorías**
   - Ver categorías predefinidas
   - Crear categorías personalizadas
   - Editar/eliminar categorías propias

4. **Análisis y Reportes**
   - Ver dashboard con resumen mensual
   - Visualizar gráficos de gastos por categoría
   - Generar reportes por rango de fechas
   - Exportar datos a CSV/JSON

**Flujo de Trabajo Típico:**
```
1. Usuario abre navegador → 2. Accede a ExpenseTracker
3. Inicia sesión → 4. Ve dashboard con resumen
5. Añade nuevo gasto del día → 6. Adjunta foto de recibo
7. Revisa gráfico de gastos mensuales → 8. Exporta datos para análisis
9. Cierra sesión
```

---

## 5. Sistemas Externos

### Tabla de Sistemas Externos

| Sistema | Estado | Tipo | Descripción | Protocolo/Tecnología | Propósito de Integración | Dependencia |
|---------|--------|------|-------------|---------------------|--------------------------|-------------|
| **Database System** | ✅ Implementado | Persistencia | Base de datos relacional para almacenar todos los datos del sistema | SQL, JDBC/Native drivers | Persistencia permanente de usuarios, gastos, categorías | **Crítica** |
| **File Storage System** | ✅ Implementado | Almacenamiento | Sistema de archivos para almacenar imágenes de recibos y documentos | File System API, Multer | Almacenar attachments de usuarios | **Alta** |
| **Email Service** | ⏳ Futuro | Notificaciones | Servicio de envío de emails transaccionales | SMTP, API (SendGrid, AWS SES) | Recuperación de contraseña, notificaciones | **Media** |
| **Data Export Service** | ⏳ Futuro | Reportes | Generador de reportes en múltiples formatos | REST API, Libraries (jsPDF, xlsx) | Exportación avanzada de datos | **Baja** |

---

### 5.1 Database System

**Descripción:**
Sistema de gestión de base de datos relacional que almacena toda la información persistente de ExpenseTracker.

**Implementación Actual:**
- **Desarrollo**: SQLite 5.1.6 (base de datos embebida en archivo)
- **Producción (Planeado)**: PostgreSQL 15+ (servidor dedicado)

**Datos Almacenados:**
- **Tabla `users`**: Información de usuarios (id, email, password_hash, nombre, timestamps)
- **Tabla `categories`**: Categorías de gastos (id, nombre, color, icono, user_id)
- **Tabla `expenses`**: Registros de gastos (id, monto, descripción, fecha, categoria_id, user_id, receipt_filename)

**Protocolo de Comunicación:**
- Queries SQL directos (SQLite)
- PostgreSQL Protocol (producción futura)
- ORM/Query Builder: Knex.js (configurado, no implementado)

**Flujo de Datos:**
```
ExpenseTracker → SQL Query → Database
Database → Result Set → ExpenseTracker
```

**Operaciones Típicas:**
- `INSERT INTO expenses`: Crear nuevo gasto
- `SELECT * FROM expenses WHERE user_id = ?`: Obtener gastos de usuario
- `UPDATE expenses SET amount = ? WHERE id = ?`: Actualizar gasto
- `DELETE FROM expenses WHERE id = ?`: Eliminar gasto

**Características Técnicas:**
- **Transacciones**: ACID compliance
- **Índices**: Optimización en user_id, date, category_id
- **Relaciones**: Foreign keys con CASCADE DELETE
- **Backups**: Archivo .db copiable (SQLite) / pg_dump (PostgreSQL)

**Dependencia:**
- **Criticidad**: **CRÍTICA** - Sin base de datos, el sistema no funciona
- **Disponibilidad**: 99.9% (producción)
- **Failover**: Backup automático diario (producción)

---

### 5.2 File Storage System

**Descripción:**
Sistema de almacenamiento de archivos para guardar imágenes de recibos y documentos adjuntos a gastos.

**Implementación Actual:**
- **Ubicación**: `/server/uploads/` (directorio local)
- **Biblioteca**: Multer 1.4.5 (middleware Express para multipart/form-data)
- **Formato Soportado**: Imágenes (JPEG, PNG, WebP)

**Flujo de Upload:**
```
Usuario → Frontend (FormData) → API POST /api/expenses/:id/receipt
→ Multer Middleware → File Storage → Filename guardado en DB
```

**Estructura de Almacenamiento:**
```
/server/uploads/
├── receipts/
│   ├── {user_id}/
│   │   ├── {expense_id}_{timestamp}.jpg
│   │   └── {expense_id}_{timestamp}.png
```

**Operaciones:**
- **Upload**: Guardar imagen de recibo al crear/editar gasto
- **Retrieve**: Servir imagen vía Express static middleware
- **Delete**: Eliminar archivo al eliminar gasto

**Configuración:**
- **Tamaño máximo**: 5 MB por archivo
- **Validación**: MIME type checking
- **Naming**: UUID + timestamp para evitar colisiones

**Futuras Mejoras (Roadmap Fase 6):**
- Migración a cloud storage (AWS S3, Cloudinary, Google Cloud Storage)
- Compresión automática de imágenes
- OCR para extraer datos de recibos
- Thumbnails automáticos

**Dependencia:**
- **Criticidad**: **ALTA** - Funcionalidad importante pero no bloqueante
- **Fallback**: Sistema funciona sin attachments si falla storage

---

### 5.3 Email Service (Futuro)

**Descripción:**
Servicio de envío de correos electrónicos transaccionales para notificaciones y funcionalidades de usuario.

**Estado:** ⏳ **No Implementado** (planeado para Fase 6)

**Casos de Uso Planeados:**
1. **Recuperación de Contraseña**
   - Enviar link de reset al email del usuario
   - Token temporal de una sola uso

2. **Bienvenida**
   - Email de confirmación al registrarse
   - Guía rápida de uso

3. **Notificaciones** (futuro)
   - Alertas de presupuesto excedido
   - Resumen mensual de gastos
   - Recordatorios de gastos recurrentes

**Proveedores Considerados:**
- **SendGrid**: API robusta, free tier generoso
- **AWS SES**: Integración con AWS, bajo costo
- **Nodemailer + Gmail SMTP**: Solución simple para desarrollo
- **Mailgun**: Alternativa a SendGrid

**Integración Propuesta:**
```javascript
// Pseudocode
const emailService = require('./services/email')

// Password reset
await emailService.sendPasswordReset({
  to: user.email,
  token: resetToken,
  expires: '1 hour'
})

// Welcome email
await emailService.sendWelcome({
  to: user.email,
  name: user.firstName
})
```

**Protocolo:**
- SMTP (Simple Mail Transfer Protocol)
- REST API (SendGrid, Mailgun)

**Dependencia:**
- **Criticidad**: **MEDIA** - Nice to have, no crítico para MVP
- **Fallback**: Sistema funciona sin emails

---

### 5.4 Data Export Service (Futuro)

**Descripción:**
Servicio para generar reportes y exportar datos en múltiples formatos para análisis externo.

**Estado:** ⏳ **Parcialmente Implementado** (export básico, mejoras en Fase 5)

**Formatos Planeados:**
1. **CSV** (implementado)
   - Formato simple para Excel, Google Sheets
   - Encoding: UTF-8 con BOM

2. **PDF** (futuro)
   - Reportes formateados con gráficos
   - Biblioteca: jsPDF, pdfmake

3. **Excel** (futuro)
   - Formato .xlsx con múltiples hojas
   - Biblioteca: xlsx, exceljs

4. **JSON** (implementado)
   - Export completo de datos para backup
   - Formato estructurado para APIs

**Implementación Actual:**
```javascript
// Endpoint de export básico
GET /api/reports/export?format=csv&start_date=2024-01-01&end_date=2024-12-31

Response:
Content-Type: text/csv
Content-Disposition: attachment; filename="expenses_2024.csv"

Date,Amount,Category,Description
2024-01-15,50.00,Food & Dining,Lunch at cafe
...
```

**Futuras Capacidades:**
- Reportes personalizables con plantillas
- Gráficos embebidos en PDF
- Scheduled exports (envío por email semanal/mensual)
- Integración con Google Sheets API

**Bibliotecas:**
- **csv-writer**: Generación de CSV
- **jsPDF**: Generación de PDF
- **xlsx**: Generación de Excel
- **Chart.js-to-image**: Convertir gráficos a imágenes para PDF

**Dependencia:**
- **Criticidad**: **BAJA** - Feature enhancement, no bloqueante
- **Fallback**: Export manual copy-paste

---

## 6. Relaciones y Flujos de Datos

### 6.1 Mapa de Relaciones

| Desde | Hacia | Protocolo | Dirección | Descripción | Frecuencia | Datos Transmitidos |
|-------|-------|-----------|-----------|-------------|------------|--------------------|
| Personal User | Expense Tracker | HTTPS | Bidireccional | Usuario interactúa con aplicación web | Continua (sesiones) | Credentials, expense data, reports |
| Expense Tracker | Database System | SQL | Bidireccional | Persistencia de datos | Por transacción | User records, expenses, categories |
| Expense Tracker | File Storage | File I/O | Bidireccional | Almacenamiento de archivos | Por upload | Receipt images (JPEG/PNG) |
| Expense Tracker | Email Service | SMTP/API | Unidireccional | Envío de emails | Bajo demanda | Email templates, user data |
| Expense Tracker | Export Service | Library Call | Unidireccional | Generación de reportes | Bajo demanda | Expense data, charts |

---

### 6.2 Flujo de Datos Principal: Crear Gasto con Recibo

**Secuencia:**
```
┌─────────────┐                                    ┌──────────────────┐
│ Personal    │                                    │ Expense Tracker  │
│ User        │                                    │ System           │
└──────┬──────┘                                    └────────┬─────────┘
       │                                                    │
       │ 1. Open "Add Expense" form                        │
       │───────────────────────────────────────────────────>│
       │                                                    │
       │ 2. Fill form (amount, description, category)      │
       │ 3. Select receipt image file                      │
       │ 4. Click "Submit"                                 │
       │───────────────────────────────────────────────────>│
       │                                                    │
       │                                    ┌───────────────┴────────────┐
       │                                    │ 5. Validate JWT token      │
       │                                    │ 6. Validate input data     │
       │                                    └───────────────┬────────────┘
       │                                                    │
       │                                         ┌──────────▼──────────┐
       │                                         │ Database System     │
       │                         7. INSERT expense record   │
       │                                         │          ├──────────>│
       │                                         │          │           │
       │                                         │ 8. Return expense_id│
       │                                         │<─────────┤           │
       │                                         └──────────┬──────────┘
       │                                                    │
       │                                         ┌──────────▼──────────┐
       │                                         │ File Storage System │
       │                         9. Save receipt image     │
       │                                         │          ├──────────>│
       │                                         │          │           │
       │                                         │ 10. Return filename │
       │                                         │<─────────┤           │
       │                                         └──────────┬──────────┘
       │                                                    │
       │                                    ┌───────────────┴────────────┐
       │                                    │ 11. Update expense record  │
       │                                    │     with receipt_filename  │
       │                                    └───────────────┬────────────┘
       │                                                    │
       │ 12. Response: 201 Created                         │
       │      { expense: {...}, receipt_url: "..." }       │
       │<───────────────────────────────────────────────────│
       │                                                    │
       │ 13. Display success message                       │
       │ 14. Redirect to expenses list                     │
       │                                                    │
```

**Datos Transferidos:**

1. **User → System**:
   ```json
   POST /api/expenses
   Content-Type: multipart/form-data
   Authorization: Bearer {jwt_token}

   {
     "amount": 50.00,
     "description": "Lunch at restaurant",
     "category_id": 1,
     "date": "2024-11-05",
     "receipt": [File Binary Data]
   }
   ```

2. **System → Database**:
   ```sql
   INSERT INTO expenses (amount, description, category_id, user_id, date, receipt_filename)
   VALUES (50.00, 'Lunch at restaurant', 1, 123, '2024-11-05', 'receipt_123_1699564800.jpg');
   ```

3. **System → File Storage**:
   ```
   Write file: /uploads/receipts/123/expense_456_1699564800.jpg
   Binary data: [JPEG image bytes]
   ```

4. **System → User**:
   ```json
   201 Created
   {
     "message": "Expense created successfully",
     "expense": {
       "id": 456,
       "amount": 50.00,
       "description": "Lunch at restaurant",
       "category_id": 1,
       "date": "2024-11-05",
       "receipt_url": "/uploads/receipts/123/expense_456_1699564800.jpg",
       "created_at": "2024-11-05T14:30:00Z"
     }
   }
   ```

---

### 6.3 Flujo de Autenticación

```
┌─────────────┐                      ┌──────────────────┐                   ┌──────────────┐
│ User        │                      │ Expense Tracker  │                   │ Database     │
└──────┬──────┘                      └────────┬─────────┘                   └──────┬───────┘
       │                                      │                                     │
       │ 1. POST /api/auth/login              │                                     │
       │    { email, password }               │                                     │
       │─────────────────────────────────────>│                                     │
       │                                      │                                     │
       │                                      │ 2. SELECT user WHERE email = ?      │
       │                                      │────────────────────────────────────>│
       │                                      │                                     │
       │                                      │ 3. Return user record               │
       │                                      │<────────────────────────────────────│
       │                                      │                                     │
       │                         ┌────────────┴──────────────┐                     │
       │                         │ 4. Verify password hash   │                     │
       │                         │    using bcrypt.compare() │                     │
       │                         └────────────┬──────────────┘                     │
       │                                      │                                     │
       │                         ┌────────────┴──────────────┐                     │
       │                         │ 5. Generate JWT token     │                     │
       │                         │    with user info & expiry│                     │
       │                         └────────────┬──────────────┘                     │
       │                                      │                                     │
       │ 6. Response: 200 OK                  │                                     │
       │    { user: {...}, token: "..." }     │                                     │
       │<─────────────────────────────────────│                                     │
       │                                      │                                     │
       │ 7. Store token in localStorage       │                                     │
       │                                      │                                     │
       │ 8. Subsequent requests include token:│                                     │
       │    Authorization: Bearer {token}     │                                     │
       │─────────────────────────────────────>│                                     │
       │                                      │                                     │
       │                         ┌────────────┴──────────────┐                     │
       │                         │ 9. Verify JWT signature   │                     │
       │                         │    Extract user_id         │                     │
       │                         └────────────┬──────────────┘                     │
       │                                      │                                     │
       │                                      │ 10. Load user from DB (if needed)   │
       │                                      │────────────────────────────────────>│
       │                                      │                                     │
       │                                      │ 11. Return user data                │
       │                                      │<────────────────────────────────────│
       │                                      │                                     │
       │ 12. Process authenticated request    │                                     │
       │<─────────────────────────────────────│                                     │
```

---

## 7. Consideraciones de Seguridad y Privacidad

### 7.1 Seguridad en las Fronteras

| Frontera | Mecanismo de Seguridad | Implementación |
|----------|------------------------|----------------|
| **User → System** | - HTTPS/TLS encryption<br>- JWT authentication<br>- Input validation<br>- CORS configuration | - Force HTTPS in production<br>- JWT tokens (7 days expiry)<br>- Joi validation schemas<br>- cors middleware |
| **System → Database** | - Parameterized queries<br>- Connection encryption<br>- Principle of least privilege | - SQL prepared statements<br>- SSL connection (PostgreSQL)<br>- Dedicated DB user with limited permissions |
| **System → File Storage** | - File type validation<br>- Size limits<br>- Path traversal prevention | - MIME type checking<br>- 5MB max file size<br>- UUID-based filenames |

### 7.2 Datos Sensibles

**Datos Personales Almacenados:**
- Email addresses (identificador único)
- Nombres (firstName, lastName)
- Contraseñas (hasheadas con bcrypt, 10 salt rounds)
- Historial financiero (gastos, montos)
- Imágenes de recibos (potencialmente información sensible)

**Protecciones:**
- Contraseñas nunca almacenadas en texto plano
- JWT tokens no contienen información sensible (solo user_id, email)
- Datos financieros solo accesibles por el usuario propietario
- Logs no incluyen datos sensibles

**Compliance:**
- GDPR considerations: Right to access, right to deletion
- Data retention policy: A definir
- Backup encryption: A implementar en producción

---

## 8. Escalabilidad y Performance

### 8.1 Escalamiento del Sistema

**Escalamiento Horizontal (Futuro):**
```
         ┌──────────────┐
         │ Load Balancer│
         └──────┬───────┘
                │
       ┌────────┼────────┐
       │        │        │
┌──────▼─────┐ │ ┌─────▼──────┐
│ App Server │ │ │ App Server │
│ Instance 1 │ │ │ Instance 2 │
└──────┬─────┘ │ └─────┬──────┘
       │        │        │
       └────────┼────────┘
                │
         ┌──────▼───────┐
         │  PostgreSQL  │
         │   (Primary)  │
         └──────┬───────┘
                │
         ┌──────▼───────┐
         │  PostgreSQL  │
         │   (Replica)  │
         └──────────────┘
```

**Componentes Stateless:**
- Backend Express app (stateless por diseño con JWT)
- Frontend servido desde CDN
- Sesiones no almacenadas en servidor

**Puntos de Contención:**
- Database (mitigado con read replicas, caching)
- File Storage (mitigado con CDN, cloud storage)

### 8.2 Performance Considerations

**Métricas Objetivo:**
- Latencia API: < 200ms (p95)
- Time to First Byte: < 500ms
- Database queries: < 50ms (p95)
- Concurrent users: 1000+ (con escalamiento)

**Optimizaciones Implementadas:**
- Database indexes en columnas frecuentes (user_id, date)
- Vite para build optimizado (code splitting, tree-shaking)
- Tailwind CSS purge (solo CSS usado)

**Optimizaciones Futuras:**
- Redis caching para queries frecuentes
- CDN para static assets
- Database connection pooling
- API response caching (ETags)

---

## 9. Deployment y Entornos

### 9.1 Arquitectura de Deployment (Actual)

**Development Environment:**
```
Developer Laptop
├── Client (React)     → http://localhost:3000
│   └── Vite Dev Server
├── Server (Express)   → http://localhost:3001
│   └── Nodemon
└── Database (SQLite)  → ./server/src/database/expense_tracker.db
```

**Production Environment (Planeado):**
```
Cloud Provider (Heroku / Railway / AWS)
├── Frontend
│   ├── Static Hosting (Vercel / Netlify)
│   └── CDN
├── Backend
│   ├── Node.js App Server (Docker container)
│   └── Load Balancer (AWS ALB / Nginx)
└── Database
    └── Managed PostgreSQL (AWS RDS / Heroku Postgres)
```

### 9.2 Entornos

| Entorno | Propósito | Database | File Storage | URL |
|---------|-----------|----------|--------------|-----|
| **Development** | Desarrollo local | SQLite local | Local filesystem | http://localhost:3000 |
| **Staging** | Testing pre-producción | PostgreSQL (staging) | AWS S3 / Local | https://staging.expensetracker.com |
| **Production** | Usuarios finales | PostgreSQL (production) | AWS S3 / Cloudinary | https://expensetracker.com |

---

## 10. Evolución Futura del Sistema

### 10.1 Sistemas Externos Futuros

**Fase 2-3 (Corto Plazo):**
- ✅ Ninguna integración adicional planeada

**Fase 4-5 (Mediano Plazo):**
- 📧 **Email Service**: Notificaciones y recuperación de contraseña
- 📊 **Advanced Export Service**: Reportes PDF con gráficos
- ☁️ **Cloud Storage**: Migración de file storage a S3/Cloudinary

**Fase 6+ (Largo Plazo - Fuera de Roadmap Actual):**
- 🏦 **Banking API Integration**: Import automático de transacciones bancarias
  - Plaid API, Teller API
  - Read-only access a cuentas bancarias
  - Reconciliación automática de gastos

- 🔔 **Push Notifications**: Notificaciones móviles
  - Firebase Cloud Messaging
  - Alertas de presupuesto en tiempo real

- 🤖 **AI/ML Service**: Categorización automática
  - TensorFlow.js / OpenAI API
  - Predicción de categorías basada en descripción
  - Detección de gastos anómalos

- 📱 **Mobile App**: Aplicación nativa móvil
  - React Native app
  - Comparte mismo backend REST API

- 📈 **Analytics Service**: Analytics avanzado
  - Google Analytics / Mixpanel
  - User behavior tracking
  - Feature usage metrics

### 10.2 Impacto en Diagrama de Contexto

**Diagrama Futuro (Conceptual):**
```
Personal User → Expense Tracker System
                     ↓
    ┌────────────────┼────────────────┐
    ↓                ↓                ↓
Database        Email Service    Cloud Storage
                     ↓
            ┌────────┴────────┐
            ↓                 ↓
    Banking API         AI Service
```

---

## 11. Referencias

### 11.1 Documentación Relacionada

- [Tech Stack Overview](/docs/tech-stack-overview.md)
- [ADR-001: React Framework](/docs/adr/ADR-001-react-framework.md)
- [ADR-004: JWT Authentication](/docs/adr/ADR-004-jwt-stateless-authentication.md)
- [ADR-005: Database Strategy](/docs/adr/ADR-005-dual-database-strategy.md)
- [ADR-007: Monorepo Structure](/docs/adr/ADR-007-monorepo-client-server-separation.md)
- [Roadmap.md](/Roadmap.md)

### 11.2 Estándares y Metodologías

- [C4 Model Documentation](https://c4model.com/)
- [PlantUML C4 Standard Library](https://github.com/plantuml-stdlib/C4-PlantUML)
- [REST API Best Practices](https://restfulapi.net/)

### 11.3 Herramientas para Visualización

**Renderizar Diagrama PlantUML:**
1. **Online**: [PlantUML Web Server](http://www.plantuml.com/plantuml/uml/)
2. **VSCode**: Extension "PlantUML"
3. **CLI**: `plantuml 01-context.md`
4. **IntelliJ**: Built-in PlantUML support

**Ejemplo de renderizado:**
```bash
# Instalar PlantUML
brew install plantuml

# Generar imagen
plantuml 01-context.md

# Output: 01-context.png
```

---

## 12. Changelog

| Versión | Fecha | Cambios | Autor |
|---------|-------|---------|-------|
| 1.0 | 2025-11-05 | Creación inicial del diagrama de contexto | Sistema de análisis |
| | | - Identificación de actores y sistemas | |
| | | - Diagrama PlantUML completo | |
| | | - Documentación exhaustiva | |

---

## 13. Aprobación

| Rol | Nombre | Firma | Fecha |
|-----|--------|-------|-------|
| Arquitecto de Software | [Pendiente] | | |
| Product Owner | [Pendiente] | | |
| Tech Lead | [Pendiente] | | |

---

**Última actualización:** 2025-11-05
**Próxima revisión:** Fase 3 (Frontend completado)
**Estado:** ✅ Aprobado para implementación

---

## Notas Finales

Este diagrama de contexto representa el estado actual y futuro planeado del sistema ExpenseTracker. A medida que el proyecto evoluciona:

- Nuevas integraciones se documentarán aquí
- El diagrama PlantUML se actualizará
- Las relaciones y flujos se refinarán

Para el siguiente nivel de detalle (C4 Level 2 - Container Diagram), consultar: `/docs/c4-model/02-container.md` (pendiente de creación).
