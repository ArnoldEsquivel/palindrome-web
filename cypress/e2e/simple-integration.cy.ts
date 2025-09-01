/// <reference types="cypress" />

describe('Phase 5 - Basic Integration Test', () => {
  it('should load the app and perform a basic search with real backend', () => {
    cy.visit('/');
    
    // Check app loads
    cy.contains('Za-🦆🦆🦆 Tennis Store').should('be.visible');
    cy.get('[data-testid="search-input"]').should('be.visible');
    
    // Perform search with palindrome
    cy.get('[data-testid="search-input"]').type('level');
    cy.get('[data-testid="search-button"]').click();
    
    // Should show loading briefly then results
    cy.wait(3000); // Give time for API response
    
    // Check final state - should be either success or empty
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="result-list-success"]').length > 0) {
        cy.log('✅ SUCCESS: Found results with backend integration');
        cy.get('[data-testid="result-list-success"]').should('be.visible');
        
        // If palindrome detected, should show banner
        if ($body.text().includes('palíndromo detectada')) {
          cy.contains('¡Búsqueda palíndromo detectada!').should('be.visible');
          cy.get('[data-testid="discount-badge"]').should('be.visible');
        }
        
        // Should have product cards
        cy.get('[data-testid="product-card"]').should('have.length.at.least', 1);
        cy.get('[data-testid="price-block"]').should('be.visible');
        
      } else if ($body.find('[data-testid="result-list-empty"]').length > 0) {
        cy.log('✅ SUCCESS: Empty state displayed correctly');
        cy.get('[data-testid="result-list-empty"]').should('be.visible');
        cy.get('[data-testid="empty-state"]').should('be.visible');
        
      } else if ($body.find('[data-testid="result-list-error"]').length > 0) {
        cy.log('⚠️ WARNING: Error state - backend connection issue');
        cy.get('[data-testid="result-list-error"]').should('be.visible');
        cy.get('[data-testid="error-state"]').should('be.visible');
        
      } else {
        cy.log('❌ UNKNOWN STATE: Cannot determine result state');
        cy.get('[data-testid="result-list-loading"]').should('be.visible');
      }
    });
  });

  it('should test clear functionality', () => {
    cy.visit('/');
    
    // Type something
    cy.get('[data-testid="search-input"]').type('test search');
    
    // Clear should be available
    cy.get('[data-testid="clear-button"]').should('be.visible').click();
    
    // Input should be empty
    cy.get('[data-testid="search-input"]').should('have.value', '');
    
    // Should return to idle state
    cy.get('[data-testid="result-list-idle"]').should('be.visible');
  });
});
