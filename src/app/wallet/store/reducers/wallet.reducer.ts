import {
  WalletActions,
  WalletActionTypes
} from '@app/wallet/store/actions/wallet.actions';

export const walletFeatureKey = 'wallet';

export interface TotaleBalanceState {
  totalBalance: any;
  isLoaded: boolean;
  error: string;
}

export const initialTotalBalanceState: TotaleBalanceState = {
  totalBalance: {},
  isLoaded: false,
  error: ''
};

export function reducer(
  state = initialTotalBalanceState,
  action: WalletActions
): TotaleBalanceState {
  switch (action.type) {
    case WalletActionTypes.LoadTotalBalanceSuccess: {
      return {
        totalBalance: action.payload.data === undefined ? '' : action.payload.data.Total_balance,
        isLoaded: true,
        error: ''
      };
    }
    case WalletActionTypes.LoadWalletsFailure: {
      return {
        totalBalance: null,
        isLoaded: false,
        error: action.payload.error
      };
    }
    case WalletActionTypes.LoadTotalBalanceLogout: {
      return initialTotalBalanceState;
    }

    default:
      return state;
  }
}
