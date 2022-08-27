module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:eslint-comments/recommended',
    'plugin:import/recommended',
    'plugin:promise/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'svelte3', 'prettier', 'import', 'html'],
  ignorePatterns: ['*.cjs', 'node_modules'],
  overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
  settings: {
    'svelte3/typescript': () => require('typescript'),
  },
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json'],
    ecmaVersion: 12,
    sourceType: 'module',
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
  rules: {
    'prettier/prettier': 'warn',
    'no-plusplus': 0,
    'import/extensions': ['error', { ts: 'never' }],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/lines-between-class-members': 'off',
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  },
};
