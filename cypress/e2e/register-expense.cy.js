// CA-1 (E2E smoke, case 1.d): login → register an expense → see it in the list.
describe('CA-1 · registrar un gasto desde la UI', () => {
  beforeEach(() => {
    cy.task('db:reset');
    cy.fixture('user').then((user) => cy.registerUserByApi(user));

    cy.intercept('POST', '**/api/auth/login').as('login');
    // Only the Expenses page list (limit 20); the Dashboard asks for limit 5.
    cy.intercept({ method: 'GET', pathname: '/api/expenses', query: { limit: '20' } }).as('listExpenses');
    cy.intercept('GET', '**/api/categories*').as('listCategories');
    cy.intercept('POST', '**/api/expenses').as('createExpense');
  });

  it('1.d login → registrar gasto → aparece en la lista', () => {
    cy.fixture('user').then((user) => {
      cy.visit('/login');
      cy.getByTestId('login-email').type(user.email);
      cy.getByTestId('login-password').type(user.password, { log: false });
      cy.getByTestId('login-submit').click();
    });
    cy.wait('@login').its('response.statusCode').should('eq', 200);
    cy.location('pathname').should('eq', '/');

    cy.getByTestId('nav-expenses').click();
    cy.wait(['@listExpenses', '@listCategories']);
    cy.getByTestId('expense-row').should('not.exist');

    cy.fixture('expense').then((expense) => {
      cy.getByTestId('add-expense-button').click();
      cy.fillExpenseForm(expense);
      cy.getByTestId('expense-submit').click();

      cy.wait('@createExpense').then(({ request, response }) => {
        expect(response.statusCode).to.eq(201);
        expect(request.body).to.include({ amount: 42.5, date: expense.date, description: expense.description });
      });
      cy.wait('@listExpenses');

      cy.getByTestId('expense-row')
        .should('have.length', 1)
        .first()
        .should('contain', expense.description)
        .and('contain', expense.category)
        .and('contain', expense.amountDisplayed);
    });
  });
});
