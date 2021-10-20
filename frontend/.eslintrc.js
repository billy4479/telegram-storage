module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "airbnb-typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:eslint-comments/recommended",
    "plugin:promise/recommended",
    "prettier",
    "prettier/@typescript-eslint"
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'svelte3'],
  rules: {
    'prettier/prettier': 'error',
    'no-plusplus': 0,
    'import/extensions': ['error', { ts: 'never' }],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    // 'import/no-mutable-exports': 0,
    // 'no-labels': 0,
    // 'no-restricted-syntax': 0,
  },
  ignorePatterns: ['build/*', 'node_modules/*'],
  overrides: [
    {
      files: ["**/*.svelte"],
      processor: "svelte3/svelte3",
    },
  ],
};
