/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
      '^@backoffice/(.*)$': '<rootDir>/packages/backoffice/$1',
      '^@kernel/(.*)$': '<rootDir>/packages/kernel/$1',
    },
    testPathIgnorePatterns: ['/node_modules/', '/build/', '/dist/'],
    collectCoverage: true,
    coverageDirectory: '<rootDir>/coverage',
    coveragePathIgnorePatterns: ['/node_modules/', '/build/', '/dist/'],
    testMatch: [
        '**/?(*.)+(spec|test).[jt]s?(x)'
    ],
  };