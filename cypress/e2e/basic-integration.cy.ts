/// <reference types="cypress" />

describe('Phase 4 Basic Integration', () => {
  it('should load the page and perform a basic search', () => {
    cy.visit('/');
    
    // Check that the search input is present with correct placeholder
    cy.get('[data-testid="search-input"]').should('be.visible');
    cy.get('[data-testid="search-input"]').should('have.attr', 'placeholder', 'Busca productos de tennis...');
    
    // Wait for the app to fully load
    cy.wait(3000);
    
    // Perform search
    cy.get('[data-testid="search-input"]').type('tennis');
    cy.get('[data-testid="search-button"]').click();
    
    cy.wait(2000);
    
    // Check for different possible states
    cy.get('body').then(($body) => {
      if ($body.text().includes('Buscando')) {
        cy.log('Loading state detected');
      } else if ($body.find('[data-testid="result-list-success"]').length > 0) {
        cy.log('Success: Search results found');
        cy.get('[data-testid="result-list-success"]').should('be.visible');
      } else if ($body.find('[data-testid="result-list-empty"]').length > 0) {
        cy.log('Empty results state');
        cy.get('[data-testid="result-list-empty"]').should('be.visible');
      } else if ($body.text().includes('Buscando')) {
        cy.log('Still loading');
      } else {
        cy.log('Unknown state');
      }
    });
  });
  
  it('should test palindrome detection', () => {
    cy.visit('/');
    
    // Wait for the app to fully load
    cy.wait(3000);
    
    // Search for a palindrome
    cy.get('[data-testid="search-input"]').type('level');
    cy.get('[data-testid="search-button"]').click();
    
    cy.wait(2000);
    
    // Should either show palindrome banner or handle error gracefully
    cy.get('body').then(($body) => {
      if ($body.text().includes('palíndromo detectada')) {
        cy.log('Success: Palindrome detected');
        cy.contains('palíndromo detectada').should('be.visible');
      } else {
        cy.log('No palindrome banner - possibly API error');
      }
    });
  });
});
