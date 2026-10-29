// CA-3 (E2E): without a valid session the expense is rejected (401), the
// user ends up on the login page and nothing is stored.
describe('CA-3 · registrar un gasto sin sesión válida', () => {
  beforeEach(() => {
    cy.task('db:reset');
    cy.intercept('POST', '**/api/expenses').as('createExpense');
  });

  it('3.a sin sesión, /expenses redirige a /login y nunca se envía el gasto', () => {
    cy.visit('/expenses');

    cy.location('pathname').should('eq', '/login');
    cy.getByTestId('login-email').should('be.visible');
    cy.getByTestId('add-expense-button').should('not.exist');
    cy.get('@createExpense.all').should('have.length', 0);
    cy.task('db:countExpenses').should('eq', 0);
  });

  it('3.b la API rechaza con 401 un gasto enviado sin token y no lo guarda', () => {
    cy.fixture('expense').then((expense) => {
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/expenses`,
        body: { amount: 42.5, description: expense.description, date: expense.date, categoryId: 1 },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body.error).to.eq('Access token required');
      });
    });
    cy.task('db:countExpenses').should('eq', 0);
  });

  it('3.c si la sesión deja de ser válida al guardar: 401, vuelve a /login y no se guarda', () => {
    cy.intercept({ method: 'GET', pathname: '/api/expenses', query: { limit: '20' } }).as('listExpenses');
    cy.intercept('GET', '**/api/categories*').as('listCategories');

    cy.fixture('user').then((user) => cy.registerUserByApi(user)).then((token) => {
      cy.visitAsUser('/expenses', token);
    });
    cy.wait(['@listExpenses', '@listCategories']);

    cy.fixture('expense').then((expense) => {
      cy.getByTestId('add-expense-button').click();
      cy.fillExpenseForm(expense);
    });

    // The session goes bad between opening the form and submitting it.
    cy.window().then((win) => win.localStorage.setItem('token', 'token-invalido'));
    cy.getByTestId('expense-submit').click();

    cy.wait('@createExpense').its('response.statusCode').should('eq', 401);
    cy.location('pathname').should('eq', '/login');
    cy.window().its('localStorage').invoke('getItem', 'token').should('be.null');
    cy.task('db:countExpenses').should('eq', 0);
  });
});
