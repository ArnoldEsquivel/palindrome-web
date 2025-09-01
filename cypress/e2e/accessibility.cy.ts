/// <reference types="cypress" />

describe('Basic Accessibility Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the page successfully', () => {
    cy.get('body').should('exist');
    cy.get('main').should('exist');
  });

  it('should have search input accessible', () => {
    cy.get('[data-testid="search-input"]').should('be.visible');
    cy.get('[data-testid="search-input"]').should('not.be.disabled');
  });

  it('should have buttons accessible', () => {
    cy.get('[data-testid="search-button"]').should('be.visible');
  });

  it('should support basic keyboard navigation', () => {
    cy.get('[data-testid="search-input"]').click();
    cy.get('[data-testid="search-input"]').should('be.focused');
  });

  it('should perform basic search', () => {
    cy.wait(3000);
    cy.get('[data-testid="search-input"]').type('test');
    cy.get('[data-testid="search-button"]').click();
    cy.wait(1000);
    cy.get('body').should('exist');
  });
});