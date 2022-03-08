import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';
const fs = require('fs');
const domino = require('domino');
const Blob = require('blob-polyfill').Blob;

import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express.default();
  const distFolder = join(process.cwd(), 'dist/satt-token-atayen/browser');
  const template = fs.readFileSync(join(distFolder, 'index.html')).toString();
  const win = domino.createWindow(template);
  win.Object = Object;
  win.Math = Math;
  global['window'] = win;
  global['HTMLElement'] = win.HTMLElement;
  global['document'] = win.document;
  global['Event'] = win.Event;
  global['Event']['prototype'] = win.Event.prototype;
  global['MouseEvent'] = win.MouseEvent;
  global['KeyboardEvent'] = win.KeyboardEvent;
  global['FocusEvent'] = win.FocusEvent;
  global['PointerEvent'] = win.PointerEvent;
  global['Object'] = Object;
  global['DOMTokenList'] = win.DOMTokenList;
  global['Node'] = win.Node;
  global['Text'] = win.Text;
  global['navigator'] = win.navigator;
  global['IDBIndex'] = win.IDBIndex;
  global['Blob'] = Blob;
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? 'index.original.html'
    : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule
    })
  );

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y'
    })
  );

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, {
      req,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }]
    });
  });

  return server;
}

function run(): void {
  const port = 5000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);// eslint-disable-line
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
/*
import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';
const fs = require('fs');
import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
const domino = require('domino');
import { existsSync } from 'fs';
// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express.default();
  const distFolder = join(process.cwd(), 'dist/satt-token-atayen/browser');
  const template = fs.readFileSync(join(distFolder, 'index.html')).toString();
  const win = domino.createWindow(template);
  win.Object = Object;
  win.Math = Math;
  global['window'] = win;
  global['HTMLElement'] = win.HTMLElement;
  global['document'] = win.document;
  global['Event'] = win.Event;
  global['Event']['prototype'] = win.Event.prototype;
  global['MouseEvent'] = win.MouseEvent;
  global['KeyboardEvent'] = win.KeyboardEvent;
  global['FocusEvent'] = win.FocusEvent;
  global['PointerEvent'] = win.PointerEvent;
  global['Object'] = Object;
  global['DOMTokenList'] = win.DOMTokenList;
  global['Node'] = win.Node;
  global['Text'] = win.Text;
  global['navigator'] = win.navigator;
  global['IDBIndex'] = win.IDBIndex;
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? 'index.original.html'
    : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule
    })
  );

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/!**', (req, res) => { });
  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y'
    })
  );

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, {
      req,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }]
    });
  });

  return server;
}

function run(): void {
  const port = process.env.PORT || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    // console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}
export * from './src/main.server';
*/
