import { Injectable } from '@angular/core';
import { ESocialMediaNames } from '@app/core/enums';
import { Store } from '@ngrx/store';
import * as SocialAccountsActions from '../state/social-accounts.actions';
import * as SocialAccountsSelectors from '../state/social-accounts.selectors';
@Injectable({
  providedIn: 'root'
})
export class SocialAccountsFacade {
  visitedPages$ = this.store.select(SocialAccountsSelectors.selectVisitedPages);
  constructor(private store: Store) {}
  pageVisited(pageVisited: ESocialMediaNames) {
    this.store.dispatch(SocialAccountsActions.pageVisited({ pageVisited }));
  }
}
