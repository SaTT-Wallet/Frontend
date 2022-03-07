export const environment = {
  production: true,
  /*API_URL: 'https://api.satt-token.com:3014',*/
  API_URL: 'https://api-preprod.satt-token.com:3014',
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
  simplexUrl: 'https://checkout.simplexcc.com/payments/new'
};
