import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import promise from 'eslint-plugin-promise';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import sonarJs from 'eslint-plugin-sonarjs';
import tsdoc from 'eslint-plugin-tsdoc';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const eslintConfig = defineConfig([
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  sonarJs.configs.recommended,
  promise.configs['flat/recommended'],
  unicorn.configs['recommended'],
  prettier,
  globalIgnores([
    '**/.stryker-tmp/**',
    '**/dist/**',
    '**/docs/**',
    '**/coverage/**',
    '**/logs/**',
    '**/migrations/**',
    '**/node_modules/**',
    '**/reports/**',
    'pnpm-lock.yaml',
  ]),
  {
    files: ['**/*.{ts,js,mjs,mts,cjs,cts}'],
    languageOptions: {
      globals: globals.node,
      parserOptions: { warnOnUnsupportedTypeScriptVersion: false },
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
      tsdoc,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'unicorn/filename-case': [
        'error',
        {
          case: 'kebabCase',
        },
      ],
      'unicorn/prevent-abbreviations': [
        'error',
        {
          checkFilenames: false,
          replacements: {
            e2e: false,
          },
          allowList: {
            db: true,
            e2e: true,
            env: true,
            err: true,
            res: true,
            req: true,
          },
        },
      ],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/no-extraneous-class': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/prefer-string-raw': 'off',
    },
  },
  // TESTS
  {
    files: ['**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/unbound-method': 'off',
      'promise/param-names': 'off',
      'promise/valid-params': 'off',
      'sonarjs/no-clear-text-protocols': 'off',
      'sonarjs/no-duplicate-string': 'off',
      'sonarjs/no-hardcoded-ip': 'off',
      'unicorn/no-null': 'off',
      'unicorn/no-useless-undefined': 'off',
    },
  },
  {
    files: ['src/**/*.ts'],
    plugins: { tsdoc },
    rules: {
      'tsdoc/syntax': 'warn',
    },
  },
]);

export default eslintConfig;
