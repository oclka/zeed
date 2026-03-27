import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    environment: 'node',
    timeout: 30_000,
    exclude: [
      '**/.stryker-tmp/**',
      '**/dist/**',
      '**/docs/**',
      '**/coverage/**',
      '**/logs/**',
      '**/migrations/**',
      '**/node_modules/**',
      '**/reports/**',
      'pnpm-lock.yaml',
    ],
    include: ['**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: [
        '**/__tests__/**',
        'tests/**',
        '**/types/**',
        '**/*.d.ts',
        'src/index.ts',
        'src/errors/index.ts',
      ],
    },
  },
});
