module.exports = {
  'src/**/*.{js,ts,html}': [
    'eslint --fix',
    'prettier --write',
  ],
  'src/**/*.{json,scss,md}': [
    'prettier --write',
  ],
};