export interface EnvConfig {
  baseURL: string;
  username: string; // used by most tests
  password: string;
  // some legacy scripts expect a nested credentials object with an email property
  credentials?: {
    email: string;
    password: string;
  };
}

// Import dotenv to load environment variables from .env file
import 'dotenv/config';

// Simple environment reader; extend with dotenv or yargs if needed
const env = process.env.TEST_ENV || 'qa';

// SECURITY IMPROVED: Use environment variables for credentials
// Set TEST_USERNAME and TEST_PASSWORD environment variables
// DO NOT hardcode credentials - use .env file or environment variables
const getCredential = (key: 'username' | 'password'): string => {
  const envKey = key === 'username' ? 'TEST_USERNAME' : 'TEST_PASSWORD';
  const value = process.env[envKey];
  if (!value) {
    throw new Error(`Missing required environment variable: ${envKey}. Please set it in your .env file.`);
  }
  return value;
};

const configs: Record<string, EnvConfig> = {
  qa: {
    baseURL: process.env.BASE_URL || 'https://copilot-student.wowlabz.com',
    // SECURITY: Credentials must be provided via environment variables
    username: getCredential('username'),
    password: getCredential('password'),
    credentials: { 
      email: getCredential('username'), 
      password: getCredential('password') 
    },
  },
  uat: {
    baseURL: process.env.BASE_URL || 'https://copilot-student.wowlabz.com',
    username: getCredential('username'),
    password: getCredential('password'),
    credentials: { 
      email: getCredential('username'), 
      password: getCredential('password') 
    },
  },
  prod: {
    baseURL: process.env.BASE_URL || 'https://copilot-student.wowlabz.com',
    username: getCredential('username'),
    password: getCredential('password'),
    credentials: { 
      email: getCredential('username'), 
      password: getCredential('password') 
    },
  },
};

export const config = configs[env];
