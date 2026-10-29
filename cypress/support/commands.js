// Creates the user straight through the API (test setup, not under test)
// and yields its JWT.
Cypress.Commands.add('registerUserByApi', (user) => {
  return cy
    .request('POST', `${Cypress.env('apiUrl')}/auth/register`, user)
    .its('body.token');
});

// Opens a page already signed in, skipping the login form.
Cypress.Commands.add('visitAsUser', (url, token) => {
  cy.visit(url, {
    onBeforeLoad(win) {
      win.localStorage.setItem('token', token);
    },
  });
});

Cypress.Commands.add('getByTestId', (testId) => cy.get(`[data-testid="${testId}"]`));

// Fills the expense form; the category is picked by its visible name.
Cypress.Commands.add('fillExpenseForm', (expense) => {
  cy.getByTestId('expense-amount').type(expense.amount);
  cy.getByTestId('expense-date').clear().type(expense.date);
  cy.getByTestId('expense-description').type(expense.description);
  cy.contains('[data-testid="expense-category"] option', expense.category).then(($option) => {
    cy.getByTestId('expense-category').select($option.val());
  });
});
