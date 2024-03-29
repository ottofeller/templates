import {Linter} from 'eslint'

export const eslintConfig: Linter.Config = {
  root: true,
  env: {
    jest: true,
    node: true,
  },
  ignorePatterns: ['generated/index.ts', '**/*.generated.ts'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'any',
        prev: '*',
        next: '*',
      },
      {
        blankLine: 'always',
        prev: '*',
        next: 'multiline-block-like',
      },
      {
        blankLine: 'always',
        prev: 'multiline-block-like',
        next: '*',
      },
      {
        blankLine: 'always',
        prev: '*',
        next: 'multiline-const',
      },
      {
        blankLine: 'always',
        prev: 'multiline-const',
        next: '*',
      },
      {
        blankLine: 'always',
        prev: '*',
        next: 'multiline-expression',
      },
      {
        blankLine: 'always',
        prev: 'multiline-expression',
        next: '*',
      },
      {
        blankLine: 'always',
        prev: '*',
        next: 'multiline-let',
      },
      {
        blankLine: 'always',
        prev: 'multiline-let',
        next: '*',
      },
      {
        blankLine: 'never',
        prev: ['singleline-const', 'singleline-let'],
        next: ['singleline-const', 'singleline-let'],
      },
    ],
    '@typescript-eslint/ban-ts-comment': ['off'],
    '@typescript-eslint/consistent-type-assertions': ['off'],
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/no-unused-expressions': ['error'],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
      },
    ],
    curly: ['error'],
    'import/no-relative-parent-imports': ['error'],
    'no-negated-condition': ['error'],
    'no-nested-ternary': ['error'],
    'eslint-comments/disable-enable-pair': [
      'error',
      {
        allowWholeFile: true,
      },
    ],
    'eslint-comments/no-aggregating-enable': ['error'],
    'eslint-comments/no-duplicate-disable': ['error'],
    'eslint-comments/no-unlimited-disable': ['error'],
    'eslint-comments/no-unused-disable': ['error'],
    'eslint-comments/no-unused-enable': ['error'],
    'eslint-comments/no-use': [
      'error',
      {
        allow: ['eslint-disable', 'eslint-disable-next-line', 'eslint-enable'],
      },
    ],
    'eslint-comments/require-description': [
      'error',
      {
        ignore: ['eslint-enable'],
      },
    ],
  },
  extends: ['plugin:import/typescript', 'plugin:prettier/recommended'],
  plugins: ['@typescript-eslint', 'eslint-comments', 'import', '@ottofeller/ottofeller'],
}
