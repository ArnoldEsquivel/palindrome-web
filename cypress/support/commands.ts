/// <reference types="cypress" />
/// <reference types="cypress-axe" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to search for products
       * @example cy.searchProducts('abba')
       */
      searchProducts(query: string): Chainable<Element>
      
      /**
       * Custom command to wait for search results
       * @example cy.waitForSearchResults()
       */
      waitForSearchResults(): Chainable<Element>
      
      /**
       * Custom command to check if element has discount badge
       * @example cy.get('[data-testid="product-card"]').shouldHaveDiscount()
       */
      shouldHaveDiscount(): Chainable<Element>
    }
  }
}

// Custom command to search for products
Cypress.Commands.add('searchProducts', (query: string) => {
  cy.get('[data-testid="search-input"]').clear().type(query)
  // Wait for debounce
  cy.wait(500)
})

// Custom command to wait for search results
Cypress.Commands.add('waitForSearchResults', () => {
  cy.get('[data-testid="result-list"]').should('be.visible')
  cy.get('[data-testid="loading-skeleton"]').should('not.exist')
})

// Custom command to check discount badge
Cypress.Commands.add('shouldHaveDiscount', { prevSubject: true }, (subject) => {
  cy.wrap(subject).within(() => {
    cy.get('[data-testid="discount-badge"]').should('be.visible').should('contain', '50% OFF')
    cy.get('[data-testid="original-price"]').should('be.visible')
    cy.get('[data-testid="final-price"]').should('be.visible')
  })
})

export {}
