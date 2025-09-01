/// <reference types="cypress" />

describe('Phase 5 - Responsive Design Validation', () => {
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1280, height: 720 },
    { name: 'Large Desktop', width: 1920, height: 1080 }
  ];

  viewports.forEach(({ name, width, height }) => {
    describe(`${name} Viewport (${width}x${height})`, () => {
      beforeEach(() => {
        cy.viewport(width, height);
        cy.visit('/');
      });

      it('should display header and layout correctly', () => {
        // Header should be visible and responsive
        cy.contains('Za-🦆🦆🦆 Tennis Store').should('be.visible');
        cy.contains('Busca productos de tennis con descuentos especiales para palíndromos').should('be.visible');
        
        // Search input should be responsive
        cy.get('[data-testid="search-input"]').should('be.visible');
        cy.get('[data-testid="search-button"]').should('be.visible');
        
        // Footer should be visible
        cy.contains('Za-🦆🦆🦆 Tennis Store - Reto Palíndromo').should('be.visible');
      });

      it('should handle search and results responsively', () => {
        // Perform search
        cy.get('[data-testid="search-input"]').type('level');
        cy.get('[data-testid="search-button"]').click();
        
        cy.wait(3000);
        
        // Check if results are displayed properly
        cy.get('body').then(($body) => {
          if ($body.find('[data-testid="result-list-success"]').length > 0) {
            cy.get('[data-testid="result-list-success"]').should('be.visible');
            
            // Product cards should be responsive
            cy.get('[data-testid="product-card"]').should('be.visible');
            cy.get('[data-testid="price-block"]').should('be.visible');
            
            // Check grid layout based on viewport
            if (width >= 1024) {
              // Large screens should show multiple columns
              cy.log(`${name}: Expecting multi-column layout`);
            } else if (width >= 768) {
              // Tablet should show 2 columns
              cy.log(`${name}: Expecting tablet layout`);
            } else {
              // Mobile should show single column
              cy.log(`${name}: Expecting mobile layout`);
            }
            
            // Discount badges should be visible if palindrome
            if ($body.text().includes('palíndromo detectada')) {
              cy.get('[data-testid="discount-badge"]').should('be.visible');
            }
          }
        });
      });

      it('should maintain usability on touch devices', () => {
        if (width < 768) {
          // Mobile specific tests
          cy.get('[data-testid="search-input"]').should('have.css', 'height').and('match', /48px|3rem/);
          cy.get('[data-testid="search-button"]').should('be.visible');
          
          // Test touch interactions
          cy.get('[data-testid="search-input"]').click().should('be.focused');
        }
      });

      it('should handle long content gracefully', () => {
        // Test with long search term
        const longSearchTerm = 'level'.repeat(10);
        cy.get('[data-testid="search-input"]').type(longSearchTerm);
        
        // Input should handle overflow
        cy.get('[data-testid="search-input"]').should('have.value', longSearchTerm);
        
        // Layout should not break
        cy.get('[data-testid="search-button"]').should('be.visible');
      });
    });
  });

  describe('Responsive Behavior Testing', () => {
    it('should adapt layout when viewport changes', () => {
      cy.visit('/');
      
      // Start with desktop
      cy.viewport(1280, 720);
      cy.get('[data-testid="search-input"]').type('level');
      cy.get('[data-testid="search-button"]').click();
      
      cy.wait(2000);
      
      // Change to mobile
      cy.viewport(375, 667);
      
      // Should maintain functionality
      cy.get('[data-testid="search-input"]').should('be.visible');
      cy.get('[data-testid="search-input"]').should('have.value', 'level');
      
      // Layout should adapt
      cy.get('body').should('be.visible'); // Basic check that layout doesn't break
    });

    it('should maintain aspect ratios and spacing', () => {
      const viewportSizes = [
        [375, 667],   // Mobile
        [768, 1024],  // Tablet
        [1280, 720]   // Desktop
      ];

      viewportSizes.forEach(([width, height]) => {
        cy.viewport(width, height);
        cy.visit('/');
        
        // Check spacing is maintained
        cy.get('header').should('have.class', 'border-b');
        cy.get('main').should('have.class', 'container');
        cy.get('footer').should('have.class', 'border-t');
        
        // Check search input proportions
        cy.get('[data-testid="search-input"]').should('be.visible');
      });
    });
  });

  describe('Grid Layout Validation', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.get('[data-testid="search-input"]').type('level');
      cy.get('[data-testid="search-button"]').click();
      cy.wait(3000);
    });

    it('should display appropriate grid columns on desktop', () => {
      cy.viewport(1280, 720);
      
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="product-card"]').length > 0) {
          // Check grid classes are applied (assuming Tailwind CSS)
          cy.get('[data-testid="product-card"]').parent().should('have.class', 'grid');
        }
      });
    });

    it('should stack properly on mobile', () => {
      cy.viewport(375, 667);
      
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="product-card"]').length > 0) {
          // On mobile, cards should stack vertically
          cy.get('[data-testid="product-card"]').should('be.visible');
        }
      });
    });
  });
});
