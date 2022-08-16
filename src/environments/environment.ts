// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //API_URL: 'https://api-preprod2.satt-token.com',
  //https://api-preprod2.satt-token.com
  //API_URL:  'https://api2.satt-token.com',

  API_URL: 'https://localhost:3015',
  //https://api-preprod.satt-token.com:3014
  addresses: {
    smartContracts: {
      campaignERC20: '0x477C93E935DcBFd330c7aE1A8BA128232eA87AC7',
      campaignBEP20: '0x4074ec9dfd977a7af1ca93a708490966ef8120b9',
      campaignPOLYGON: '0xD6Cb96a00b312D5930FC2E8084A98ff2Daa5aD2e',
      campaignBTT: '0xd5A058eE756a0e3E1c4bCBADC2c70844a52B32f6',
      campaignTRON: 'THUD3VAxyTEmMCBEjd2AcSujzbgPSu39p9',

      SATT_TOKENERC20: '0x2bef0d7531f0aae08adc26a0442ba8d0516590d0',
      SATT_TOKENBEP20: '0x6fAc729f346A46fC0093126f237b4A520c40eb89',
      SATT_TOKEN_TRON: 'TZ9mUjmxCtowj9h68NJq626qaGWiv61KWo',
      SATT_TOKENPOLYGON: '0x195DC8342D923D3dFe0167Dc902A33Eabd801653',
      SATT_TOKENBTT: '0xaabda8813dF0fDc254B3aeD3d901E3838f0CCfCF',
      SATT_TOKENTRON: 'TZ9mUjmxCtowj9h68NJq626qaGWiv61KWo',
      TETHER_TOKENERC20: '0x3B2243E3Aeb6d4A102061BCE6C5c233c2C08fF65',
      DAI: '0x7d6550Bb3946c0BB0701c75baBE2f679E01F3f3E',
      BUSD: '0xE6baB06eb943e9b6D475fB229E3E15F6E49a5461',
      WTRX: 'TRpHXiD9PRoorNh9Lx4NeJUAP7NcG5zFwi',
      WBTT: '0xD6Cb96a00b312D5930FC2E8084A98ff2Daa5aD2e'
    }
  },
  domainName: 'https://dev.satt.atayen.us',
  telegramBot: 'TestnetAtayenBot',
  firebase: {
    apiKey: 'AIzaSyAHfBKuneC6G0Uu9RKwI9hZKOjNiPQRd1U',
    authDomain: 'satt-token.firebaseapp.com',
    //databaseURL: 'https://satt-token.firebaseio.com',
    projectId: 'satt-token',
    storageBucket: 'satt-token.appspot.com',
    messagingSenderId: '284190209745',
    appId: '1:284190209745:web:dc01085f6a6dabfcc837f0',
    measurementId: 'G-DSJK01CZ0X'
  },
  fcmredirectUrl: 'http://localhost:4200/#/home',
  bscan: 'https://testnet.bscscan.com/tx/',
  etherscan: 'https://ropsten.etherscan.io/tx/',
  bscanaddr: 'https://testnet.bscscan.com/address/',
  polygonscanAddr: 'https://mumbai.polygonscan.com/tx/',
  bttscanAddr: 'https://testnet.bttcscan.com/tx/',
  tronScanAddr: 'https://shasta.tronscan.org/#/address/',
  tronScan: 'https://shasta.tronscan.org/#/transaction/',

  etherscanaddr: 'https://ropsten.etherscan.io/address/',
  simplexUrl: 'https://sandbox.test-simplexcc.com/payments/new',
  gmtId: 'GTM-K2RMTJ3'

  /* API_URL: 'https://api2.satt-token.com:3016',
  addresses: {
    smartContracts: {
   campaignERC20: '0xf961c85517fe86244cb60889afc4a928068d49ef',
      campaignBEP20: '0xcef9b240c13f269354e5ae3d6808fecf9834bf10',
      campaignPOLYGON: '0xa01f80042512Cdf9355a66CBB1266240c0456513',

      SATT_TOKENERC20: '0xdf49c9f599a0a9049d97cff34d0c30e468987389',
      SATT_TOKENBEP20: '0x448bee2d93be708b54ee6353a7cc35c4933f1156',
      TETHER_TOKENERC20: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      SATT_TOKENPOLYGON: '0x4b6d775b7ea8e66499cb80777e65b895474f5c86',
      DAI: '0x6b175474e89094c44da98b954eedeac495271d0f',
      BUSD: '0xe9e7cea3dedca5984780bafc599bd69add087d56'
    }
  },
  domainName: 'https://satt.atayen.us',
  telegramBot: 'v2_satt_token_bot',
  firebase: {
    apiKey: 'AIzaSyAHfBKuneC6G0Uu9RKwI9hZKOjNiPQRd1U',
    authDomain: 'satt-token.firebaseapp.com',
    //databaseURL: 'https://satt-token.firebaseio.com',
    projectId: 'satt-token',
    storageBucket: 'satt-token.appspot.com',
    messagingSenderId: '284190209745',
    appId: '1:284190209745:web:dc01085f6a6dabfcc837f0',
    measurementId: 'G-DSJK01CZ0X'
  },
  fcmredirectUrl: 'https://satt.atayen.us/#/home',
  bscan: 'https://bscscan.com/tx/',
  etherscan: 'https://etherscan.io/tx/',
  bscanaddr: 'https://bscscan.com/address/',
  etherscanaddr: 'https://etherscan.io/address/',
  polygonscanAddr: 'https://polygonscan.com/address/',
  bttscanAddr: 'https://bttcscan.com/address/',
  simplexUrl: 'https://checkout.simplexcc.com/payments/new',*/
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
