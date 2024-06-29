module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
    detectOpenHandles: true,
    moduleNameMapper: {
      '^ioredis$': '<rootDir>/__mocks__/ioredis.ts'
    }
  };
  