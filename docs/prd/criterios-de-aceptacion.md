# PRD · Criterios de aceptación (Sesión 5: Documentación y Pruebas con IA)

Este documento es la fuente de verdad para las pruebas de la Sesión 5. Cada criterio debe terminar convertido en al menos una prueba automatizada.

## Funcionalidad existente: registrar un gasto

```gherkin
CA-1  Dado un usuario autenticado
      Cuando registra un gasto con monto, categoría y fecha válidos
      Entonces el gasto se guarda y aparece en su lista de gastos

CA-2  Dado un usuario autenticado
      Cuando intenta registrar un gasto con monto negativo o vacío
      Entonces recibe un error de validación (400) y el gasto no se guarda

CA-3  Dado un usuario NO autenticado
      Cuando intenta registrar un gasto
      Entonces la API responde 401 y el gasto no se guarda
```

Endpoints involucrados: `POST /api/expenses`, `GET /api/expenses`.

## Funcionalidad nueva: presupuesto mensual por categoría

> Esta funcionalidad **no existe todavía**. Se construye en clase con TDD.

```gherkin
CA-4  Dado un presupuesto de 100 para "Food & Dining" en el mes actual
      Cuando los gastos de "Food & Dining" del mes suman 80
      Entonces el estado del presupuesto es "ok" y el restante es 20

CA-5  Dado un presupuesto de 100 para "Food & Dining"
      Cuando los gastos del mes suman 100 o más
      Entonces el estado es "excedido" y el restante es 0 (nunca negativo)

CA-6  Dado un presupuesto definido
      Cuando hay gastos de "Food & Dining" de un mes distinto
      Entonces esos gastos NO cuentan para el presupuesto del mes actual
```

## Datos de apoyo

`npm run seed:demo` crea el usuario `demo@expense-tracker.dev` (contraseña `demo1234`) con gastos en el mes actual y los dos anteriores, incluyendo varios de "Food & Dining" en meses distintos (útil para CA-6).

## Selectores para pruebas E2E

La interfaz expone atributos `data-testid` estables:

| Pantalla | data-testid |
|---|---|
| Login | `login-email`, `login-password`, `login-submit`, `login-error` |
| Gastos | `add-expense-button`, `expense-row` (escritorio), `expense-card` (móvil), `expense-edit`, `expense-delete` |
| Formulario de gasto | `expense-amount`, `expense-date`, `expense-description`, `expense-category`, `expense-notes`, `expense-submit`, `expense-form-error` |
