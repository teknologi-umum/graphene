/// <reference types="cypress" />

beforeEach(() => {
  cy.visit('/');
});

describe('Header', () => {
  it('shows the app title and subtitle', () => {
    cy.get('.title').contains('GRAPHENE');
    cy.get('.subtitle').contains('Create and share beautiful code snippets!');
  });

  it('shows a github button to graphene repository', () => {
    cy.get('.button')
      .contains('See on Github')
      .should('have.attr', 'href', 'https://github.com/teknologi-umum/graphene');
  });
});
