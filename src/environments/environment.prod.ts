export const environment = {
  production: true,

  API_URL: 'https://api2.satt-token.com',
  url: 'https://dapp.satt.com/',
  ipfsURL: 'https://ad-pools.infura-ipfs.io/ipfs/',
  url_subgraph_bsc:
    'https://api.thegraph.com/subgraphs/name/atayen/satt--bsc-mainnet',
  url_subgraph_ether:
    'https://api.thegraph.com/subgraphs/name/atayen/satt-ether-mainnet',

  addresses: {
    smartContracts: {
      campaignERC20: '0xf961c85517fe86244cb60889afc4a928068d49ef',
      campaignBEP20: '0x60c761e810b86fa3876ae065bdee62b8f2e29f86',
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
  metaMaskDomaine: 'https://app.satt.com',
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
  gmtId: 'GTM-5XW23QX',
  dateRefund: 1296000,
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
  /*
  DEV-ENV
*/
  /*
  API_URL: 'https://api-preprod2.satt-token.com',
  // 'https://api-preprod2.satt-token.com:3015',
  //'https://localhost:3015',
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
  simplexUrl: 'https://sandbox.test-simplexcc.com/payments/new'*/
  urlSocialMedia: {
    urlTwitter: 'https://www.twitter.com/',
    urlGoogleChannel: 'https://www.youtube.com/channel/',
    urlFacebook: 'https://www.facebook.com/',
    urlInstagram: 'https://www.instagram.com/',
    urlLinkedinCompany: 'https://www.linkedin.com/company/',
    urlTiktok: 'https://www.tiktok.com/',
    urlthreadsAccount: 'https://threads.net/@'
  },
  FACEBOOK_URL: 'https://www.facebook.com/',
  M_FACEBOOK_URL: 'https://m.facebook.com/',
  FACEBOOK_POST_URL:
    'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2F',

  YOUTUBE_WATCH_LINK: 'youtube.com/watch',

  YOUTUBE_SHORTEN_LINK: 'https://youtu.be/',

  YOUTUBE_EMBED_LINK: 'https://www.youtube.com/embed/',

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

  TIKTOK_URL: 'https://www.tiktok.com/',
  TIKTOK_SHORTEN_LINK: 'https://vm.tiktok.com',

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

  YOUTUBE_OEMBED_LINK:
    'https://www.youtube.com/oembed?url=https%3A//youtube.com/watch%3Fv%3D'
};
