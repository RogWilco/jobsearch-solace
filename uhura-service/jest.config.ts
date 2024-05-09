import type { Config } from '@jest/types'

import 'jest-extended'
import 'jest-json-schema'

export default {
  automock: false,
  clearMocks: true,
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: 'out/coverage',
  coveragePathIgnorePatterns: ['src/main.ts'],
  coverageReporters: ['html', 'json', 'lcov', 'text', 'clover'],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 18,
      statements: 25,
    },
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  modulePathIgnorePatterns: ['<rootDir>/out/'],
  restoreMocks: true,
  rootDir: './',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  testEnvironment: 'node',
  testRegex: '.*\\.(.*-)?(test|spec)\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  verbose: true,
} as Config.InitialOptions
