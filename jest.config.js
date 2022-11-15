module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/spec/**/*.spec.ts'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/types/**/*.ts',
  ],
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1',
    'spec/(.*)$': '<rootDir>/spec/$1',
  },
  globals: {
    'ts-jest': {
      diagnostics: false,
      isolatedModules: true,
    },
  },
};
