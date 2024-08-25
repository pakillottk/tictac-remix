/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@backoffice/(.*)$': '<rootDir>/apps/backoffice/$1',
    '^@kernel/(.*)$': '<rootDir>/src/contexts/kernel/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/build/', '/dist/'],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '/build/', '/dist/'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
};
