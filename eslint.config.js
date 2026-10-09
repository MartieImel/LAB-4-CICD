import js from '@eslint/js';

export default [
  {
    ignores: [
      'node_modules/**',
      '.vercel/**',
      'public/build-info.json'
    ]
  },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      'no-undef': 'error',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', {
        avoidEscape: true
      }]
    }
  }
];