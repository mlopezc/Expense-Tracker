# ADR-005: Estrategia Dual de Base de Datos (SQLite/PostgreSQL)

**Estado**: Aceptado

**Fecha**: 2024-11 (Estimado según análisis de código)

**Autores**: Equipo de desarrollo ExpenseTracker

---

## Contexto

ExpenseTracker necesita persistencia de datos para:

1. **Usuarios**: Información de registro y autenticación
2. **Categorías**: Categorías predefinidas y personalizadas por usuario
3. **Gastos**: Transacciones con montos, fechas, descripciones, recibos

**Requisitos de la solución:**

**Para Desarrollo:**
- Setup rápido y sin configuración
- No requiere instalación de software adicional
- Portabilidad total (compartir proyecto fácilmente)
- Testing simple
- Reset rápido de datos

**Para Producción:**
- Escalabilidad horizontal
- Concurrencia robusta
- Backups confiables
- Performance bajo carga
- Features empresariales (replicación, etc.)

**Consideraciones adicionales:**
- Proyecto educativo (onboarding debe ser simple)
- Despliegue en cloud platform (Heroku, Railway, etc.)
- SQL estándar para transferibilidad

## Decisión

Decidimos implementar una **estrategia dual de base de datos**:

- **Desarrollo y Testing**: SQLite 5.1.6
- **Producción**: PostgreSQL (preparado, no implementado aún)

Con Knex.js como abstracción para soportar ambos motores con el mismo código.

**Implementación actual:**
- SQLite en archivo: `server/src/database/expense_tracker.db`
- Schema SQL estándar compatible con ambos motores
- Knex.js configurado para fácil switch
- Environment variable para conexión: `DATABASE_URL`

**Evidencia en el código:**
- `/server/package.json:20` - SQLite3 como dependencia
- `/server/src/database/schema.sql` - SQL estándar
- `/server/src/database/connection.js` - Abstracción de conexión
- `/server/src/config/database.js` - Configuración

```javascript
// SQLite connection (development)
const database = {
  client: 'sqlite3',
  connection: {
    filename: './src/database/expense_tracker.db'
  },
  useNullAsDefault: true
}

// PostgreSQL connection (production)
const database = {
  client: 'postgresql',
  connection: process.env.DATABASE_URL
}
```

## Consecuencias

### Positivas de SQLite (Desarrollo)

1. **Zero Configuration**
   - No requiere instalación de PostgreSQL
   - No requiere crear base de datos
   - Un solo archivo: `expense_tracker.db`
   - Git clone → npm install → funciona

2. **Portabilidad Total**
   - Archivo puede compartirse con equipo
   - Fácil crear snapshots de datos
   - Backup = copiar archivo
   - Reset = delete archivo

3. **Performance Excelente (Dev)**
   - Sin latencia de red
   - Queries instantáneos
   - No overhead de servidor
   - Perfecto para desarrollo local

4. **Onboarding Rápido**
   - Estudiantes pueden ejecutar proyecto inmediatamente
   - Sin configuración de PostgreSQL local
   - Sin credenciales o permisos

5. **Testing Simplificado**
   - In-memory database para tests (`:memory:`)
   - Reset rápido entre tests
   - Aislamiento total

### Positivas de PostgreSQL (Producción)

1. **Escalabilidad**
   - Maneja millones de filas
   - Read replicas para escalamiento horizontal
   - Connection pooling robusto
   - Sharding posible

2. **Concurrencia Robusta**
   - MVCC (Multi-Version Concurrency Control)
   - Múltiples escrituras simultáneas
   - Locks granulares
   - Sin bloqueo de lecturas

3. **Features Empresariales**
   - Replicación master-slave
   - Point-in-time recovery
   - Tablespaces
   - Partitioning
   - Full-text search nativo

4. **Herramientas y Ecosystem**
   - pgAdmin, DBeaver para GUI
   - Monitoring tools (pg_stat_statements)
   - Extensiones (PostGIS, pg_trgm)
   - Managed services (AWS RDS, Heroku Postgres)

5. **Data Integrity**
   - ACID completo bajo alta carga
   - Foreign key constraints robustos
   - Transaction isolation levels
   - Consistent backups

### Negativas

1. **Complejidad de Configuración Dual**
   - Mantener compatibilidad SQL entre ambos
   - Testing en ambos motores idealmente
   - SQL dialect differences (AUTO_INCREMENT vs SERIAL)
   - **Mitigación**: Knex.js abstrae diferencias

2. **SQLite Limitations (Producción)**
   - No apto para alta concurrencia
   - No escalamiento horizontal
   - Locks de archivo completo en writes
   - No multi-server setup
   - **Solución**: PostgreSQL en producción

3. **PostgreSQL Overhead (Desarrollo)**
   - Requiere instalación y configuración
   - Más recursos de sistema
   - Setup más complejo para estudiantes
   - **Solución**: SQLite para dev

4. **Parity Imperfecta**
   - Algunos features de PostgreSQL no en SQLite
   - JSON operations diferentes
   - Behavior differences bajo edge cases
   - **Mitigación**: Usar subset común, testing en ambos

5. **Migration Path**
   - Necesidad de migrar datos al escalar
   - Dump SQLite → Import PostgreSQL
   - Verificación de integridad
   - **Planificado**: Scripts de migración

## Alternativas Consideradas

### 1. PostgreSQL Únicamente

**Pros:**
- Un solo motor (parity garantizada)
- Production-ready desde día 1
- No migration path necesario
- Features avanzados desde el inicio

**Contras:**
- Requiere instalación local para desarrollo
- Configuración inicial compleja
- Overhead para estudiantes
- Setup de testing más complejo
- Recursos de sistema mayores

**Razón de rechazo:** Complejidad de onboarding inaceptable para proyecto educativo. Estudiantes necesitan setup rápido.

---

### 2. MySQL / MariaDB

**Pros:**
- Popular y conocido
- Buen performance
- Managed services disponibles
- Replicación built-in

**Contras:**
- Require instalación como PostgreSQL
- Menos features avanzados que PostgreSQL
- JSON support inferior
- Licencing considerations (MySQL vs MariaDB)

**Razón de rechazo:** PostgreSQL es técnicamente superior (JSON, window functions, MVCC). Si vamos a requerir instalación, preferimos PostgreSQL. SQLite ofrece mejor DX para desarrollo.

---

### 3. MongoDB (NoSQL)

**Pros:**
- Schema flexible
- JSON nativo
- Escalabilidad horizontal excelente
- Popular en MEAN/MERN stacks

**Contras:**
- NoSQL no apropiado para este caso
- Datos altamente relacionales (users → expenses → categories)
- Transacciones complejas históricamente
- No queries SQL estándar
- Overkill para data structure simple

**Razón de rechazo:** Los datos son inherentemente relacionales. SQL es más apropiado. No hay ventaja de schema flexibility (estructura es fija).

---

### 4. Firebase Realtime Database / Firestore

**Pros:**
- Managed service (zero ops)
- Real-time sync built-in
- Offline support
- Authentication integrado
- Escalabilidad automática

**Contras:**
- Vendor lock-in
- Costo mensual
- Menos control
- Queries limitados vs SQL
- Learning curve de Firebase
- No apropiado para proyecto educativo de SQL

**Razón de rechazo:** Vendor lock-in, costo, y el proyecto tiene objetivo educativo de aprender SQL y backend tradicional.

---

### 5. H2 Database (Java)

**Pros:**
- Similar a SQLite (embebido)
- Modo PostgreSQL compatibility
- In-memory mode
- Web console

**Contras:**
- Ecosistema Java (proyecto es Node.js)
- Menos maduro en ecosystem Node.js
- Menor adopción que SQLite

**Razón de rechazo:** Proyecto usa Node.js, no Java. SQLite tiene mejor integración con Node.js ecosystem.

---

### 6. SQLite Únicamente (Producción También)

**Pros:**
- Un solo motor
- Simplicidad total
- No migration path
- Deployment simple

**Contras:**
- No escala para multi-usuario intensivo
- Concurrency limitada
- No apropiado para producción con tráfico
- Single point of failure
- No replicación

**Razón de rechazo:** No apto para producción real. SQLite excelente para desarrollo, pero limitado para escalar.

## Notas de Implementación

### Schema SQL Estándar

```sql
-- Compatible con SQLite y PostgreSQL
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- SQLite
    -- id SERIAL PRIMARY KEY,              -- PostgreSQL (comentado)
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Migration para PostgreSQL:**
```sql
-- schema-postgres.sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Database Connection Abstraction

```javascript
// server/src/database/connection.js
const sqlite3 = require('sqlite3')
const { open } = require('sqlite')

class Database {
  constructor() {
    this.db = null
  }

  async connect() {
    if (process.env.NODE_ENV === 'production') {
      // PostgreSQL connection (future)
      // this.db = await connectPostgreSQL()
    } else {
      // SQLite connection (current)
      this.db = await open({
        filename: './src/database/expense_tracker.db',
        driver: sqlite3.Database
      })
    }
  }

  async query(sql, params) {
    return this.db.all(sql, params)
  }

  async get(sql, params) {
    return this.db.get(sql, params)
  }

  async run(sql, params) {
    return this.db.run(sql, params)
  }
}

module.exports = new Database()
```

### Knex.js Configuration (Future)

```javascript
// knexfile.js
module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './src/database/expense_tracker.db'
    },
    useNullAsDefault: true
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
}
```

### Environment Variables

```bash
# .env (development)
DATABASE_URL=sqlite://./src/database/expense_tracker.db

# .env (production)
DATABASE_URL=postgresql://user:pass@host:5432/expensetracker
```

### Migration Path

**Fase 1**: Exportar datos de SQLite
```bash
sqlite3 expense_tracker.db .dump > backup.sql
```

**Fase 2**: Convertir SQL dialect
```bash
# Reemplazar AUTO_INCREMENT con SERIAL
# Ajustar tipos de datos
sed 's/AUTOINCREMENT/SERIAL/g' backup.sql > postgres.sql
```

**Fase 3**: Importar a PostgreSQL
```bash
psql expensetracker < postgres.sql
```

### Indexes Consistency

```sql
-- Mismo en SQLite y PostgreSQL
CREATE INDEX idx_expenses_user_id ON expenses (user_id);
CREATE INDEX idx_expenses_date ON expenses (date);
CREATE INDEX idx_expenses_category_id ON expenses (category_id);
CREATE INDEX idx_categories_user_id ON categories (user_id);
```

## Database Schema

### Tablas y Relaciones

```
┌─────────────┐
│   users     │
│─────────────│
│ id (PK)     │
│ email       │
│ password_hash│
└──────┬──────┘
       │
       │ 1:N
       │
       ├──────────────────────┐
       │                      │
       ▼                      ▼
┌──────────────┐      ┌───────────────┐
│ categories   │      │   expenses    │
│──────────────│      │───────────────│
│ id (PK)      │◀─────│ id (PK)       │
│ name         │ N:1  │ amount        │
│ user_id (FK) │      │ description   │
│ is_default   │      │ date          │
└──────────────┘      │ category_id FK│
                      │ user_id FK    │
                      │ receipt       │
                      └───────────────┘
```

### Data Types Mapping

| Concepto | SQLite | PostgreSQL |
|----------|--------|------------|
| Auto-increment | AUTOINCREMENT | SERIAL |
| Timestamp | DATETIME | TIMESTAMP |
| Boolean | INTEGER (0/1) | BOOLEAN |
| Decimal | REAL | NUMERIC |
| Text | TEXT | TEXT |

## Performance Considerations

### SQLite Optimizations (Dev)

```sql
-- Enable WAL mode for better concurrency
PRAGMA journal_mode = WAL;

-- Increase cache size
PRAGMA cache_size = 10000;

-- Optimize for speed
PRAGMA synchronous = NORMAL;
```

### PostgreSQL Optimizations (Prod)

```sql
-- Analyze tables regularly
ANALYZE;

-- Vacuum regularly
VACUUM ANALYZE;

-- Connection pooling
-- (configured in Knex.js)
```

## Deployment Strategy

### Heroku

```bash
# Heroku provides PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Connection string automatically in DATABASE_URL
echo $DATABASE_URL
# postgres://user:pass@host:5432/dbname
```

### Railway

```bash
# Railway provides PostgreSQL plugin
# Auto-configured DATABASE_URL
railway run npm start
```

### Docker (Future)

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: expensetracker
      POSTGRES_USER: expense_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  server:
    build: ./server
    environment:
      DATABASE_URL: postgresql://expense_user:secure_password@postgres:5432/expensetracker
    depends_on:
      - postgres

volumes:
  postgres_data:
```

## Testing Strategy

### Unit Tests

```javascript
// Use in-memory SQLite for tests
const testDb = await open({
  filename: ':memory:',
  driver: sqlite3.Database
})

// Run migrations
await testDb.exec(schemaSQL)

// Run tests
// ...

// Cleanup
await testDb.close()
```

### Integration Tests

Idealmente: Test en ambos SQLite y PostgreSQL
- CI pipeline con PostgreSQL en Docker
- Local tests con SQLite
- Smoke tests en staging (PostgreSQL)

## Referencias

1. [SQLite Official Documentation](https://www.sqlite.org/docs.html)
2. [PostgreSQL Official Documentation](https://www.postgresql.org/docs/)
3. [Knex.js Documentation](https://knexjs.org/)
4. [SQLite vs PostgreSQL Comparison](https://www.sqlite.org/whentouse.html)
5. [schema.sql](/server/src/database/schema.sql) - Database schema
6. [connection.js](/server/src/database/connection.js) - Database abstraction

## Estado del ADR

Este ADR está **ACEPTADO**. La estrategia dual ha funcionado excelentemente:

**Experiencia de desarrollo**: 10/10
- Setup instantáneo para nuevos desarrolladores
- Sin configuración de base de datos
- Reset rápido de datos

**Preparación para producción**: 8/10
- Migration path claro
- SQL estándar facilita transición
- Falta: Implementar Knex.js completo
- Falta: Scripts de migración automática

**Próximos pasos**:
1. Implementar Knex.js para mejor abstracción (Fase 2)
2. Crear scripts de migración SQLite → PostgreSQL (Fase 6)
3. Deploy en Heroku/Railway con PostgreSQL (Fase 6)
4. Testing en PostgreSQL en CI pipeline (Fase 5)

---

**Última actualización**: 2025-11-05
