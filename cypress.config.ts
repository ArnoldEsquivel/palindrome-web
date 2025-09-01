import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    // Base URL for the application under test
    baseUrl: 'http://localhost:3001',
    
    // Viewport settings
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Timeout settings
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 10000,
    
    // Test files pattern
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    
    // Support file
    supportFile: 'cypress/support/e2e.ts',
    
    // Fixtures folder
    fixturesFolder: 'cypress/fixtures',
    
    // Screenshots and videos
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    
    // Video recording
    video: true,
    videoCompression: 32,
    
    // Screenshots on failure
    screenshotOnRunFailure: true,
    
    // Browser settings
    chromeWebSecurity: false,
    
    // Experimental features
    experimentalStudio: true,
    
    // Environment variables
    env: {
      // API base URL for backend
      apiBaseUrl: 'http://localhost:3000',
      
      // Common test data
      palindromes: ['abba', 'level', 'radar', 'civic', 'kayak'],
      normalQueries: ['tennis', 'sports', 'tech', 'gaming'],
      
      // Accessibility testing
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa']
        }
      }
    },
    
    // Setup tasks
    setupNodeEvents(on, config) {
      // Task for seeding test data (if needed)
      on('task', {
        log(message) {
          console.log(message)
          return null
        },
        
        // Task to wait for API to be ready
        async waitForApi() {
          const apiUrl = config.env.apiBaseUrl
          let attempts = 0
          const maxAttempts = 30
          
          while (attempts < maxAttempts) {
            try {
              const response = await fetch(`${apiUrl}/api/products/search?q=test`)
              if (response.ok || response.status === 400) {
                return true
              }
            } catch (error) {
              // API not ready yet
            }
            
            attempts++
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
          
          throw new Error(`API at ${apiUrl} not ready after ${maxAttempts} attempts`)
        }
      })
      
      // Return the config
      return config
    },
    
    // Retry configuration
    retries: {
      runMode: 2,
      openMode: 0,
    },
    
    // Test isolation
    testIsolation: true,
    
    // Block hosts (for faster tests)
    blockHosts: [
      '*.google-analytics.com',
      '*.googletagmanager.com',
      '*.facebook.com',
      '*.twitter.com',
    ],
  },
  
  // Component testing configuration (for future use)
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.ts',
  },
})
