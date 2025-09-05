import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,ts}'],
    plugins: { js },
    languageOptions: {
      sourceType: 'module', // Set to ESM
      globals: globals.node // Use Node.js globals for backend
    },
    extends: ['plugin:js/recommended'],
    rules: {
      'no-console': 'off',
      'semi': ['error', 'always'],
      'camelcase': ['warn', { properties: 'always' }]
    }
  },
  ...tseslint.configs.recommended
]);