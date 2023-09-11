import type {Linter} from 'eslint'

/**
 * Represents an eslint config used only for React-related checks.
 */
export const eslintConfigReact: Linter.Config = {
  env: {browser: true, jest: true, node: true},
  globals: {document: 'readonly', navigator: 'readonly', window: 'readonly'},
  parserOptions: {ecmaFeatures: {jsx: true}, ecmaVersion: 2020, sourceType: 'module'},
  plugins: ['react', 'react-hooks'],
  settings: {react: {pragma: 'React', version: '17'}},

  rules: {
    'jsx-quotes': ['error', 'prefer-double'],
    'react-hooks/exhaustive-deps': ['error'],
    'react-hooks/rules-of-hooks': ['error'],
    'react/jsx-boolean-value': ['error', 'never'],
    'react/jsx-curly-brace-presence': ['error', {props: 'never', children: 'never'}],
    'react/jsx-key': ['error', {checkFragmentShorthand: true}],
    'react/jsx-uses-vars': ['error'],
    'react/prefer-stateless-function': ['error'],
    '@ottofeller/ottofeller/require-comment-before-useeffect': ['error'],
  },
}
