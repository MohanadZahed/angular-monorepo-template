module.exports = {
  '**/*.{js,ts,html}': ['eslint --fix', 'prettier --write'],
  '**/*.{json,scss,md}': ['prettier --write'],
};
