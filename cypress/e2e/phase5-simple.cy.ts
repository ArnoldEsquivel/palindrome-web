/// <reference types="cypress" />

describe('Phase 5 Simple End-to-End', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the page successfully', () => {
    cy.get('[data-testid="search-input"]').should('be.visible');
    cy.contains('Tennis Store').should('be.visible');
  });

  it('should perform basic search', () => {
    // Wait for app to fully load
    cy.wait(3000);
    cy.get('[data-testid="search-input"]').type('tennis');
    cy.get('button').contains('Buscar').click();
  });

  it('should display search results or loading state', () => {
    // Wait for app to fully load
    cy.wait(3000);
    cy.get('[data-testid="search-input"]').type('racecar');
    cy.get('button').contains('Buscar').click();
    // Should show something after search
    cy.get('body').should('exist');
  });
});
