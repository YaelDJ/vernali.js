// @ts-check

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.stylistic,
  {
    rules: {
      semi: ['error', 'never'],
      quotes: ['error', 'single'],
      'comma-dangle': ['error', 'never'],
      'space-before-function-paren': ['error', 'always'],
      'indent': ['error', 2],
      'no-multi-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-unused-vars': 'off',
      'no-undef': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-ignore': false,
          'ts-nocheck': true,
          'ts-check': false,
          'minimumDescriptionLength': 3
        }
      ],
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      'spaced-comment': ['error', 'always', {
        'block': {
          'exceptions': ['*', '-'],
          'balanced': true
        },
        'line': {
          'exceptions': ['-']
        }
      }],
      'no-trailing-spaces': 'error',
      'no-irregular-whitespace': 'error',
      'block-spacing': ['error', 'always'],
      'keyword-spacing': ['error', { 'before': true, 'after': true }],
      'space-before-blocks': ['error', 'always'],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      'no-var': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off'
    }
  }
)
