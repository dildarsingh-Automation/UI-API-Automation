/**
 * Global Teardown
 * 
 * Runs once after all tests complete.
 * Used for cleanup and reporting.
 */

import { FullConfig } from '@playwright/test';
import fs from 'fs';

async function globalTeardown(config: FullConfig) {
  // Clean up temporary files
  const tempFiles = ['test-results/temp'];
  
  for (const file of tempFiles) {
    if (fs.existsSync(file)) {
      try {
        fs.unlinkSync(file);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  }
  
  // Get retry count from environment
  const retries = process.env.CI ? 2 : 1;
  
  // Generate test summary
  console.log('\n========================================');
  console.log('Test Suite Complete');
  console.log('========================================');
  console.log(`Total Projects: ${config.projects.length}`);
  console.log(`Workers: ${config.workers}`);
  console.log(`Retries: ${retries}`);
  console.log('========================================\n');
}

export default globalTeardown;

