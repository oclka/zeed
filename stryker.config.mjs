/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  testRunner: 'vitest',
  reporters: ['html', 'clear-text', 'progress', 'dashboard'],
  plugins: [
    '@stryker-mutator/vitest-runner',
    '@stryker-mutator/typescript-checker',
  ],
  timeoutMS: 240_000,
  timeoutFactor: 3,
  coverageAnalysis: 'perTest',
  mutate: ['src/**/*.ts'],
  ignorePatterns: ['.agent', '.ops', '.windsurf', 'dist', 'coverage', 'node_modules', '.stryker-tmp'],
  thresholds: {
    high: 95,
    low: 80,
    break: 60,
  },
  vitest: {
    configFile: 'vitest.config.mjs',
  },
  dashboard: {
    module: 'db',
  },
};
