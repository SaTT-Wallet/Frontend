// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_URL: 'https://api-preprod2.satt-token.com',
  // 'https://api-preprod2.satt-token.com:3015',
  // API_URL: 'https://localhost:3015',
  //https://api-preprod.satt-token.com:3014
  addresses: {
    smartContracts: {
      campaignERC20: '0xa5F46d6F4F3b318EeFF1B37e39491e52233c5975',
      campaignBEP20: '0xcef9b240c13f269354e5ae3d6808fecf9834bf10',
      campaignPOLYGON: '0x8CC1e2E2C4a04c3029579fD9612FEBb0323C319F',
      SATT_TOKENERC20: '0x2beF0d7531f0aaE08ADc26A0442Ba8D0516590d0',
      SATT_TOKENBEP20: '0x6fAc729f346A46fC0093126f237b4A520c40eb89',
      SATT_TOKENPOLYGON: '0x195DC8342D923D3dFe0167Dc902A33Eabd801653',
      TETHER_TOKENERC20: '0x3B2243E3Aeb6d4A102061BCE6C5c233c2C08fF65',
      DAI: '0x7d6550Bb3946c0BB0701c75baBE2f679E01F3f3E',
      BUSD: '0x4CB4473Af06B844d06b5eDeF08983B2C5C61e5af'
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
  etherscanaddr: 'https://ropsten.etherscan.io/address/',
  simplexUrl: 'https://sandbox.test-simplexcc.com/payments/new',
  gmtId: 'GTM-K2RMTJ3'

  /*  API_URL: 'https://api2.satt-token.com:3016',
  addresses: {
    smartContracts: {
      campaignERC20: '0xf961c85517fe86244cb60889afc4a928068d49ef',
      campaignBEP20: '0x37c7cc26df98852ae061276ed013ded8da533718',
      SATT_TOKENERC20: '0xdf49c9f599a0a9049d97cff34d0c30e468987389',
      SATT_TOKENBEP20: '0x448bee2d93be708b54ee6353a7cc35c4933f1156',
      TETHER_TOKENERC20: '0xdac17f958d2ee523a2206206994597c13d831ec7',
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
  simplexUrl: 'https://checkout.simplexcc.com/payments/new'*/
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
