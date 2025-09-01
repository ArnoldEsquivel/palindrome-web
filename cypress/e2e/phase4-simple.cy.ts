/// <reference types="cypress" />

describe('Phase 4 Simple Integration', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the page successfully', () => {
    cy.get('[data-testid="search-input"]').should('be.visible');
    cy.contains('Tennis Store').should('be.visible');
  });

  it('should allow typing in search input', () => {
    cy.get('[data-testid="search-input"]').should('be.visible');
    cy.get('[data-testid="search-input"]').type('test');
    cy.get('[data-testid="search-input"]').should('have.value', 'test');
  });

  it('should have search button', () => {
    cy.get('button').contains('Buscar').should('be.visible');
  });
});
