import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  Router
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, mergeMap, take, tap } from 'rxjs/operators';
import { TokenStorageService } from './tokenStorage/token-storage-service.service';
import { WalletFacadeService } from '@core/facades/wallet-facade.service';
import { AccountFacadeService } from '../facades/account-facade/account-facade.service';
import { User } from '@app/models/User';
import { Campaign } from '@app/models/campaign.model';
import { CampaignHttpApiService } from '@core/services/campaign/campaign.service';
import { IResponseWallet } from '../iresponse-wallet';
import { ICampaignResponse } from '../campaigns-list-response.interface';
import { IApiResponse } from '../types/rest-api-responses';
@Injectable({
  providedIn: 'root'
})
export class CampaignEditGuardService implements CanActivate {
  dateExpiredToken: any = this.tokenStorageService.getExpire();
  dateNow: any = Math.floor(Date.now() / 1000);
  dateShouldExpireAt: any = this.dateExpiredToken - 3600;

  constructor(
    private router: Router,
    private walletFacade: WalletFacadeService,
    private tokenStorageService: TokenStorageService,
    private accountFacadeService: AccountFacadeService,
    @Inject(PLATFORM_ID) private platformId: string,
    private campaignService: CampaignHttpApiService,
    private activatedRoute: ActivatedRoute,
    private localStorageService: TokenStorageService
  ) {}

  canActivate(route: ActivatedRouteSnapshot) {
    if (this.tokenStorageService.getIsAuth() !== 'true') {
      this.tokenStorageService.signOut();
      this.accountFacadeService.dispatchLogoutAccount();
      this.router.navigate(['/auth/login']);
      return of(false);
    } else {
      this.accountFacadeService.dispatchUserAccount();
      return this.handleAccountValue(route);
    }
  }

  handleAccountValue(route: ActivatedRouteSnapshot) {
    return this.accountFacadeService.account$.pipe(
      filter((res: User | null) => res !== null),
      map((res: User | null) => res as User),
      take(1),
      tap((account: User) => {
        const phonenumber = this.tokenStorageService.getPhoneNumber();
        if (!phonenumber) {
          this.tokenStorageService.setPhoneNumber(account.phone);
        }
      }),
      mergeMap((account: User) => {
        if (account.email === '') {
          this.accountFacadeService.dispatchLogoutAccount();
          this.tokenStorageService.signOut();
          this.router.navigate(['/auth/login']);
          return of(false);
        }
        //   else if (account.error === 'Invalid Access Token') {
        //   this.router.navigate(['auth/login']);
        //   return of(false);
        // }
        else if (
          (account.completed !== true && account.idSn !== 0) ||
          (account.completed === true &&
            account.idSn !== 0 &&
            (account.enabled === false || account.enabled === 0))
        ) {
          this.router.navigate(['social-registration/completeProfile']);
          return of(false);
        } else {
          if (
            !!this.walletFacade.walletValue &&
            !this.walletFacade.walletValue?.error
          ) {
            return this.handleWalletValue(this.walletFacade.wallet$, route);
          } else {
            return this.handleWalletValue(
              this.walletFacade.getUserWallet(),
              route
            );
          }
        }
      }),
      catchError(() => {
        this.tokenStorageService.signOut();
        this.accountFacadeService.dispatchLogoutAccount();
        this.router.navigate(['/auth/login']);
        return of(false);
      })
    );
  }

  handleWalletValue(wallet$: Observable<any>, route: ActivatedRouteSnapshot) {
    return wallet$.pipe(
      mergeMap((data: IResponseWallet) => {
        if (this.tokenStorageService.getvalid2FA() === 'false') {
          this.tokenStorageService.signOut();
          this.accountFacadeService.dispatchLogoutAccount();
          this.router.navigate(['/auth/login']);
          return of(false);
        }
        if (!!data?.error) {
          this.tokenStorageService.signOut();
          this.accountFacadeService.dispatchLogoutAccount();
          this.router.navigate(['/auth/login']);
          return of(false);
        } else if (data.data.address) {
          // this.tokenStorageService.saveIdWallet(data.data.address);
          // this.tokenStorageService.saveTronWallet(data.data?.tronAddress);
          return this.handleIfCampaignOwner(route);
        } else if (this.dateNow > this.dateShouldExpireAt) {
          return this.handleIfCampaignOwner(route);
        } else if (data.error === 'no_account') {
          this.tokenStorageService.setSecureWallet(
            'visited-completeProfile',
            'true'
          );
          this.router.navigate(['social-registration/monetize-facebook']);
          return of(false);
        } else {
          this.tokenStorageService.signOut();
          this.accountFacadeService.dispatchLogoutAccount();
          this.router.navigate(['/auth/login']);
          return of(false);
        }
      })
    );
  }

  handleIfCampaignOwner(route: ActivatedRouteSnapshot) {
    return this.campaignService.getOneById(route.params['id']).pipe(
      mergeMap((c: IApiResponse<ICampaignResponse>) => {
        let campaign = new Campaign(c.data);
        let isOwner =
          Number(campaign.ownerId) ===
          Number(this.localStorageService.getUserId());

        if (this.router.url === '/') {
          if (isOwner) {
            return of(true);
          } else {
            this.router.navigateByUrl('/');
            return of(false);
          }
        }
        return of(isOwner);
      })
    );
  }
}
/*    canActivate(
        route: ActivatedRouteSnapshot,
        router: RouterStateSnapshot
    ):
        | boolean
        | UrlTree
        | Promise<boolean | UrlTree>
        | Observable<boolean | UrlTree> {
        return this.auth.user.pipe(
            take(1),
            map(user => {
                const isAuth = !!user;
                if (isAuth) {
                    return true;
                }
                return this.router.createUrlTree(['/auth']);
            })
            // tap(isAuth => {
            //   if (!isAuth) {
            //     this.router.navigate(['/auth']);
            //   }
            // })
        );
    }*/
