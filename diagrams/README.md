# Diagramas de Arquitectura - Expense Tracker

Esta carpeta contiene una suite completa de diagramas de arquitectura en formato PlantUML que documenta la estructura y funcionamiento de la aplicación Expense Tracker.

## Índice de Diagramas

### 1. Arquitectura General (C4 Model - Nivel 1)
**Archivo:** `01-architecture-general.puml`

Diagrama de contexto del sistema que muestra:
- Actores principales (Usuario)
- Sistema Expense Tracker como caja negra
- Sistemas externos (Navegador, Sistema de archivos)
- Relaciones de alto nivel

**Propósito:** Entender el contexto general y los límites del sistema.

---

### 2. Arquitectura de Componentes (C4 Model - Nivel 2)
**Archivo:** `02-components-architecture.puml`

Diagrama de contenedores que muestra:
- Single Page Application (React)
- API REST (Express.js)
- Base de Datos (SQLite/PostgreSQL)
- Almacenamiento de archivos
- Componentes internos de cada contenedor

**Propósito:** Visualizar la arquitectura de alto nivel y las tecnologías utilizadas.

---

### 3. Componentes Frontend en Detalle
**Archivo:** `03-frontend-components.puml`

Diagrama detallado del frontend que incluye:
- Estructura de routing (React Router)
- Context Providers (Auth, Expense)
- Páginas principales (Dashboard, Expenses, Categories, Reports)
- Componentes reutilizables
- Servicios y utilidades

**Propósito:** Documentar la organización interna del frontend React.

---

### 4. Servicios Backend en Detalle
**Archivo:** `04-backend-services.puml`

Diagrama detallado del backend que incluye:
- Punto de entrada (server.js)
- Capas de routing y middleware
- Controladores de negocio
- Modelos de datos
- Configuración de base de datos
- Utilidades y validación

**Propósito:** Documentar la arquitectura MVC del backend Express.

---

### 5. Capa de Base de Datos
**Archivo:** `05-database-layer.puml`

Diagrama de entidad-relación que muestra:
- Esquema de tablas (users, categories, expenses)
- Relaciones entre entidades
- Índices de performance
- Configuración de Knex.js
- Diferencias entre desarrollo (SQLite) y producción (PostgreSQL)

**Propósito:** Documentar el modelo de datos y relaciones.

---

### 6. Integraciones Externas y Middleware
**Archivo:** `06-external-integrations.puml`

Diagrama de integraciones que incluye:
- Herramientas de desarrollo (Vite, Nodemon, ESLint)
- Servicios de build y deployment
- Integración con sistema de archivos
- Middleware de seguridad y autenticación
- Servicios de logging y monitoreo
- Librerías de procesamiento de datos

**Propósito:** Documentar dependencias externas y herramientas de desarrollo.

---

### 7. Flujo de Datos
**Archivo:** `07-data-flow.puml`

Diagrama de flujo de datos que muestra:
- Capas de entrada, procesamiento, almacenamiento y salida
- Flujos específicos: autenticación, gestión de gastos, reportes
- Manejo de estado en el frontend
- Procesamiento de errores
- Transformación de datos en cada etapa

**Propósito:** Visualizar cómo fluyen los datos a través del sistema.

---

## Tecnologías Documentadas

### Frontend
- **React 18** con Hooks y Context API
- **React Router v6.20.1** para navegación
- **Tailwind CSS v3.3.6** para estilos
- **Vite v5.0.0** como build tool
- **Axios v1.6.2** para comunicación HTTP
- **Chart.js + react-chartjs-2** para visualizaciones

### Backend
- **Node.js + Express v4.18.2** como servidor
- **JWT** para autenticación
- **Joi v17.11.0** para validación
- **Multer v1.4.5** para carga de archivos
- **bcryptjs v2.4.3** para hashing de contraseñas
- **Morgan v1.10.0** para logging

### Base de Datos
- **SQLite3 v5.1.6** para desarrollo
- **PostgreSQL** para producción
- **Knex.js v3.0.1** como query builder

### Herramientas de Desarrollo
- **ESLint** para linting
- **Prettier** para formateo
- **Concurrently** para ejecución paralela
- **Nodemon** para auto-reload
- **Jest** para testing (configurado)

## Cómo Visualizar los Diagramas

### Online
1. Copiar el contenido de cualquier archivo `.puml`
2. Pegar en [PlantUML Online Server](http://www.plantuml.com/plantuml/uml/)
3. Ver el diagrama renderizado

### Localmente
1. Instalar PlantUML: `npm install -g node-plantuml`
2. Generar imagen: `puml generate archivo.puml`
3. O usar extensión de VS Code: "PlantUML"

### Herramientas Recomendadas
- **VS Code Extension:** PlantUML (jebbs.plantuml)
- **IntelliJ Plugin:** PlantUML integration
- **Command Line:** plantuml.jar

## Mantenimiento de Diagramas

### Cuándo Actualizar
- Al agregar nuevos componentes o servicios
- Al modificar la arquitectura existente
- Al cambiar tecnologías o dependencias
- Al implementar nuevas funcionalidades importantes

### Mejores Prácticas
1. Mantener consistencia en nombres y colores
2. Actualizar diagramas antes de merge de features grandes
3. Revisar diagramas en code reviews arquitecturales
4. Usar comentarios para explicar decisiones de diseño
5. Versionar diagramas junto con el código

## Próximas Mejoras

### Diagramas Adicionales Sugeridos
- Diagrama de secuencia para flujos críticos
- Diagrama de deployment para diferentes ambientes
- Diagrama de componentes de testing
- Diagramas de performance y escalabilidad

### Automatización
- CI/CD para validar sintaxis PlantUML
- Generación automática de documentación
- Integración con herramientas de documentación

---

**Generado el:** $(date)  
**Versión de la aplicación:** 1.0.0  
**Basado en:** context.md y análisis completo del código fuente
