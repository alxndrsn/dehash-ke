import globals from 'globals';

export default [
  {
    files: ['**/*.js'],
    languageOptions: { sourceType:'commonjs' },
    rules: {
      'eol-last': 'error',
      'no-tabs': 'error',
      'no-trailing-spaces': 'error',
      'no-undef-init': 'error',
      'no-unused-expressions': 'error',
      'semi': [ 'error', 'always' ],
    },
  },
  {
    languageOptions: { globals:globals.node },
  },
]
