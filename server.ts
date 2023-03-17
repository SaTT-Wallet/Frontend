import 'zone.js/dist/zone-node';
import { ngExpressEngine } from '@nguniversal/express-engine';
import express from 'express';
import { join } from 'path';
import { existsSync } from 'fs';
import { InjectionToken } from '@angular/core';
import { readFileSync } from 'fs';
const cheerio = require('cheerio');
const fs = require('fs');
const helmet = require('helmet');
const domino = require('domino');
const Blob = require('blob-polyfill').Blob;

import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';


export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/satt-token-atayen/browser');
  const template = readFileSync(join(distFolder, 'index.html')).toString();
  const loadedData = cheerio.load(template);
  const $ = loadedData('body');

  const fakeWindow = {
    navigator: {},
    document: $.html(),
    Event: {},
    MouseEvent: {},
    KeyboardEvent: {},
    FocusEvent: {},
    PointerEvent: {}
  };



  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule,
      providers: [
        { provide: 'document', useValue: fakeWindow.document },
      ],
    })
  );
  server.use(helmet.noSniff());
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

  const getStaticFiles = (req: any, res: any) => {
    res.sendFile(join(distFolder, 'index.html'));
  };

  server.get('/campaign/**/edit', getStaticFiles);

  // All regular routes use the Universal engine
  server.get('/campaign/**', (req: { baseUrl: any; }, res: { render: (arg0: string, arg1: { req: any; providers: { provide: InjectionToken<string>; useValue: any; }[]; }) => void; }) => {
    res.render('index', {
      req,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }]
    });
  });


  server.get('*', getStaticFiles);

  return server;
}



function run(): void {
  const port = process.env.PORT || 4000;

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
