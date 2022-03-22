console.log('custom webpack config');
module.exports = {
  plugins: [
    { test: /.(ts|js)$/, loader: 'regexp-replace-loader', query: { match: { pattern: '\[(Mouse|Keyboard)Event\]', flags: 'g' }, replaceWith: '[]', } }
  ]
};