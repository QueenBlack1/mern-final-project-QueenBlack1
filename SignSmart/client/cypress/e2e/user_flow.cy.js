describe('User Management', () => {
  it('should create a new user', () => {
    cy.visit('/');
    cy.get('[data-testid=name-input]').type('John Doe');
    cy.get('[data-testid=email-input]').type('john@example.com');
    cy.get('[data-testid=submit-btn]').click();
    cy.contains('User created successfully').should('be.visible');
  });

  it('should display users list', () => {
    cy.visit('/users');
    cy.get('[data-testid=user-list]').should('exist');
  });
});