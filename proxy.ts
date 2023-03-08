const { createProxyMiddleware } = require('http-proxy-middleware');




export const apiProxy = createProxyMiddleware('/api', {
  target: "https://api-preprod2.satt-token.com",
  changeOrigin: true,
  secure: false
});