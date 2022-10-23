/// <reference types="cypress" />

beforeEach(() => {
  cy.visit('/');
});

describe('Documentation', () => {
  it('shows documentation title', () => {
    cy.get('#documentation').contains('Documentation for Graphene API');
  });

  it('shows several API options documentation', () => {
    cy.get('.OptionItem').should('have.length.gt', 0);
  });
});
