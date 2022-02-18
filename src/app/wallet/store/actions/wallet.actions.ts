import { Action } from '@ngrx/store';

export enum WalletActionTypes {
  LoadTotalBalance = '[TotalBalnce] Load TotalBalance',
  LoadTotalBalanceSuccess = '[TotalBalance] Load TotalBalance Success',
  LoadTotalBalanceFailure = '[TotalBalance] Load TotalBalance Failure',
  LoadWallets = '[Wallet] Load Wallets',
  LoadWalletsSuccess = '[Wallet] Load Wallets Success',
  LoadWalletsFailure = '[Wallet] Load Wallets Failure',
  LoadTotalBalanceLogout = '[TotalBalance] Load TotalBalance Logout'
}

// wallet actions

export class LoadWallets implements Action {
  readonly type = WalletActionTypes.LoadWallets;
}
export class LoadTotalBalanceLogout implements Action {
  readonly type = WalletActionTypes.LoadTotalBalanceLogout;
}
export class LoadWalletsSuccess implements Action {
  readonly type = WalletActionTypes.LoadWalletsSuccess;
  constructor(public payload: { data: any }) {}
}

export class LoadWalletsFailure implements Action {
  readonly type = WalletActionTypes.LoadWalletsFailure;
  constructor(public payload: { error: any }) {}
}

// totale balances actions

export class LoadTotalBalance implements Action {
  readonly type = WalletActionTypes.LoadTotalBalance;
  constructor(public payload: { address: string }) {}
}

export class LoadTotalBalanceSuccess implements Action {
  readonly type = WalletActionTypes.LoadTotalBalanceSuccess;
  constructor(public payload: { data: any }) {}
}

export class LoadTotalBalanceFailure implements Action {
  readonly type = WalletActionTypes.LoadTotalBalanceFailure;
  constructor(public payload: { error: any }) {}
}

export type WalletActions =
  | LoadWallets
  | LoadWalletsSuccess
  | LoadWalletsFailure
  | LoadTotalBalance
  | LoadTotalBalanceSuccess
  | LoadTotalBalanceFailure
  | LoadTotalBalanceLogout;
