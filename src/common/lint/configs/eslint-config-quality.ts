import type {Linter} from 'eslint'

/**
 * Represents an eslint config used only for code quality checks.
 * It should never include formatting rules.
 */
export const eslintConfigQuality: Linter.Config = {
  env: {browser: true, jest: true, node: true},
  extends: ['plugin:import/typescript', 'plugin:@cspell/recommended'],
  ignorePatterns: '!.projenrc.ts',
  globals: {document: 'readonly', navigator: 'readonly', window: 'readonly'},

  overrides: [
    {
      // Disable some rules for tests
      files: ['**/__tests__/*'],

      rules: {
        'import/no-relative-parent-imports': 'off',
      },
    },
  ],

  parser: '@typescript-eslint/parser',
  parserOptions: {ecmaVersion: 2020, sourceType: 'module'},
  plugins: ['@typescript-eslint', 'eslint-comments', 'import', '@ottofeller/ottofeller', '@cspell'],
  settings: {react: {pragma: 'React', version: '17'}},

  // Static analysis and code quality
  rules: {
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {'ts-expect-error': 'allow-with-description', 'ts-ignore': 'allow-with-description'},
    ],
    '@typescript-eslint/consistent-type-assertions': ['error', {assertionStyle: 'never'}],
    '@typescript-eslint/no-duplicate-imports': ['error'],
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/no-unused-expressions': ['error'],
    '@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
    curly: ['error'],
    'import/no-relative-parent-imports': ['error'],
    'no-negated-condition': ['error'],
    'no-nested-ternary': ['error'],
    'eslint-comments/disable-enable-pair': ['error', {allowWholeFile: true}],
    'eslint-comments/no-aggregating-enable': ['error'],
    'eslint-comments/no-duplicate-disable': ['error'],
    'eslint-comments/no-unlimited-disable': ['error'],
    'eslint-comments/no-unused-disable': ['error'],
    'eslint-comments/no-unused-enable': ['error'],
    'eslint-comments/no-use': ['error', {allow: ['eslint-disable', 'eslint-disable-next-line', 'eslint-enable']}],
    'eslint-comments/require-description': ['error', {ignore: ['eslint-enable']}],
  },
}
