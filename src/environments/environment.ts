// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //API_URL: 'https://localhost:3015',
  //url:"http://localhost:4200/",
  url: 'https://testnet.satt.atayen.us/',
  ipfsURL: 'https://ipfs.io/ipfs/',
  //https://api-preprod2.satt-token.com

  API_URL: 'https://api-preprod2.satt-token.com',

  url_subgraph_bsc:
    'https://api.thegraph.com/subgraphs/name/atayen/satt-testnet',
  url_subgraph_ether:
    'https://api.thegraph.com/subgraphs/name/atayen/satt-testnet-ether',

  //API_URL: 'https://localhost:3015',
  // 'https://api-preprod.satt-token.com:3014',
  addresses: {
    smartContracts: {
      campaignERC20: '0x0A40CEbd090Aedeb912903D8fDbEeb8d066807A4',
      campaignBEP20: '0x5F8E7481303aC3Ab4ca5AB7d9a6422eA8a8b21dE',
      campaignPOLYGON: '0xD6Cb96a00b312D5930FC2E8084A98ff2Daa5aD2e',
      campaignBTT: '0x261491739e36090FC80fF1569B7E5FFe26070d77',
      campaignTRON: 'THUD3VAxyTEmMCBEjd2AcSujzbgPSu39p9',

      SATT_TOKENERC20: '0x3e233F049DAfB2ed8aaf324F67Dd98bc8FDdF6dA',
      //SATT_TOKENERC20: '0x2bef0d7531f0aae08adc26a0442ba8d0516590d0',

      SATT_TOKENBEP20: '0x6fAc729f346A46fC0093126f237b4A520c40eb89',
      SATT_TOKEN_TRON: 'TZ9mUjmxCtowj9h68NJq626qaGWiv61KWo',
      SATT_TOKENPOLYGON: '0x195DC8342D923D3dFe0167Dc902A33Eabd801653',

      SATT_TOKENBTT: '0xaabda8813dF0fDc254B3aeD3d901E3838f0CCfCF',
      SATT_TOKENTRON: 'TZ9mUjmxCtowj9h68NJq626qaGWiv61KWo',
      TETHER_TOKENERC20: '0x3B2243E3Aeb6d4A102061BCE6C5c233c2C08fF65',
      DAI: '0x7d6550Bb3946c0BB0701c75baBE2f679E01F3f3E',
      BUSD: '0xE6baB06eb943e9b6D475fB229E3E15F6E49a5461',
      WTRX: 'TRpHXiD9PRoorNh9Lx4NeJUAP7NcG5zFwi',
      WBTT: '0x0000000000000000000000000000000000001010'
    }
  },
  domainName: 'https://testnet.satt.atayen.us',
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
  etherscan: 'https://goerli.etherscan.io/tx/',
  polygonscan: 'https://mumbai.polygonscan.com/tx/',
  bttscan: 'https://testnet.bttcscan.com/tx/',
  tronScan: 'https://shasta.tronscan.org/#/transaction/',

  bscanaddr: 'https://testnet.bscscan.com/address/',
  polygonscanAddr: 'https://mumbai.polygonscan.com/address/',
  bttscanAddr: 'https://testnet.bttcscan.com/address/',
  tronScanAddr: 'https://shasta.tronscan.org/#/address/',
  etherscanaddr: 'https://goerli.etherscan.io/address/',
  dateRefund: 1296000,
  simplexUrl: 'https://sandbox.test-simplexcc.com/payments/new',
  gmtId: 'GTM-5XW23QX',

  SWAPLINK:
    'https://sunswap.com/#/v2?lang=en-US&t0=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t&t1=TAFjULxiVgT4qWk6UZwjqwZXTSaGaqnVp4&type=swap',
  YOUTUBE_OEMBED_LINK:
    'https://www.youtube.com/oembed?url=https%3A//youtube.com/watch%3Fv%3D',
  YOUTUBE_WATCH_LINK: 'youtube.com/watch',
  YOUTUBE_SHORTEN_LINK: 'https://youtu.be/',
  YOUTUBE_EMBED_LINK: 'https://www.youtube.com/embed/',
  FACEBOOK_URL: 'https://www.facebook.com/',
  M_FACEBOOK_URL: 'https://m.facebook.com/',
  TIKTOK_URL: 'https://www.tiktok.com/',
  TIKTOK_SHORTEN_LINK: 'https://vm.tiktok.com',
  FACEBOOK_POST_URL:
    'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2F',
  Network: {
    BNB: 'BNB',
    WSAT: 'WSATT',
    ETH: 'ETH',
    BTC: 'BITCOIN',
    SATT: 'SATT',
    SATTBEP20: 'SATTBEP20',
    TRX: 'tron',
    MATIC: 'MATIC',
    BTT: 'BTT'
  },
  typeSN: {
    facebook: 1,
    youtube: 2,
    instagram: 3,
    twitter: 4,
    linkedin: 5,
    tiktok: 6
  },
  oracleType: {
    facebook: 'facebook',
    youtube: 'youtube',
    instagram: 'instagram',
    twitter: 'twitter',
    linkedin: 'linkedin',
    tiktok: 'tiktok'
  },
  urlSocialMedia: {
    urlTwitter: 'https://www.twitter.com/',
    urlGoogleChannel: 'https://www.youtube.com/channel/',
    urlFacebook: 'https://www.facebook.com/',
    urlInstagram: 'https://www.instagram.com/',
    urlLinkedinCompany: 'https://www.linkedin.com/company/',
    urlTiktok: 'https://www.tiktok.com/',
    urlthreadsAccount: 'https://threads.net/@'

  }
  // gmtId: 'GTM-5XW23QX'

  /*  API_URL: 'https://api2.satt-token.com',
  addresses: {
    smartContracts: {
      campaignERC20: '0xf961c85517fe86244cb60889afc4a928068d49ef',
      campaignBEP20: '0xcef9b240c13f269354e5ae3d6808fecf9834bf10',
      campaignPOLYGON: '0xa01f80042512Cdf9355a66CBB1266240c0456513',
      campaignBTT: '0xa01f80042512Cdf9355a66CBB1266240c0456513',
      campaignTRON: 'TPeLf9WLzUD8tUoc7dtfGVqPUrnKGip2PN',

      SATT_TOKENERC20: '0xdf49c9f599a0a9049d97cff34d0c30e468987389',
      SATT_TOKENBEP20: '0x448bee2d93be708b54ee6353a7cc35c4933f1156',
      SATT_TOKEN_TRON: 'TZ9mUjmxCtowj9h68NJq626qaGWiv61KWo', // testnet
      SATT_TOKENPOLYGON: '0x4b6d775b7ea8e66499cb80777e65b895474f5c86',
      SATT_TOKENBTT: '0xaabda8813dF0fDc254B3aeD3d901E3838f0CCfCF', //testnet
      SATT_TOKENTRON: 'TZ9mUjmxCtowj9h68NJq626qaGWiv61KWo',
      TETHER_TOKENERC20: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      DAI: '0x6b175474e89094c44da98b954eedeac495271d0f',
      BUSD: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      WTRX: 'TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR',
      WBTT: '0x0000000000000000000000000000000000001010'
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
  polygonscan: 'https://polygonscan.com/tx/',
  polygonscanAddr: 'https://polygonscan.com/address/',
  simplexUrl: 'https://checkout.simplexcc.com/payments/new',
  bttscan: 'https://bttcscan.com/tx/',
  bttscanAddr: 'https://bttcscan.com/address/',
  tronScanAddr: 'https://tronscan.org/#/address/',
  tronScan: 'https://tronscan.org/#/transaction/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
  // import 'zone.js/dist/zone-error';  // Included with Angular CLI.
};
