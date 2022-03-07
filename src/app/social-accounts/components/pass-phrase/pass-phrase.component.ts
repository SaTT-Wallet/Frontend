import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';
import { TranslateService } from '@ngx-translate/core';
//TODO: Use lodash's shuffle function instead.
// No need to install extras js library
import arrayShuffle from 'array-shuffle';
// import {
//   CdkDragDrop,
//   moveItemInArray,
//   transferArrayItem
// } from '@angular/cdk/drag-drop';

import { CreatePasswordWalletService } from '@app/core/services/wallet/create-password-wallet.service';
import { WalletFacadeService } from '@core/facades/wallet-facade.service';

import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ProfileSettingsFacadeService } from '@app/core/facades/profile-settings-facade.service';
import { AccountFacadeService } from '@app/core/facades/account-facade/account-facade.service';
import { filter, mergeMap, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';

@Component({
  selector: 'app-pass-phrase',
  templateUrl: './pass-phrase.component.html',
  styleUrls: ['./pass-phrase.component.scss']
})
export class PassPhraseComponent implements OnInit, OnDestroy {
  passPhrase = [];
  passPhraseShuffled: any;
  passPhraseOrdered: any;
  passPhraseOrderedLength = 0;
  passPhraseOrdered2: any;
  confirmForm: FormGroup;
  showConfirmForm!: boolean;
  showSpinner!: boolean;
  disabled = true;
  stringPassPhrase = '';
  i = 0;
  check = '';
  private isDestroyed = new Subject();

  constructor(
    private accountFacadeService: AccountFacadeService,
    public translate: TranslateService,
    private walletFacade: WalletFacadeService,
    public CreatePasswordWalletService: CreatePasswordWalletService,
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private profileSettingsFacade: ProfileSettingsFacadeService
  ) {
    this.confirmForm = new FormGroup({
      agreeBox1: new FormControl('', [Validators.required])
    });
  }
  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
    if (!this.tokenStorageService.getSecureWallet('visited-passPhrase')) {
      this.router.navigate(['social-registration/pass-phrase']);
    }
  }

  ngOnInit(): void {
    //    this.tokenStorageService.setSecureWallet('visited-passPhrase', 'false');
    this.visitPassPhrase();
    this.getPassPhrase();
    this.passPhraseOrdered = [];
  }

  onCheckboxChange(event: any, form: any) {
    if (event.target.checked === false) {
      this.confirmForm.get(form)?.setValue('');
    }
  }
  onShowConfirmForm() {
    this.showConfirmForm = true;
  }

  getPassPhrase() {
    this.walletFacade
      .getUserWallet()
      .pipe(
        mergeMap((data: any) => {
          if (!!data) {
            return this.CreatePasswordWalletService.getPassPhrase();
          }
          return of(null);
        })
      )
      .pipe(
        filter((res) => res !== null),

        takeUntil(this.isDestroyed)
      )
      .subscribe((response: any) => {
        if (response !== null && response !== undefined) {
          this.passPhrase = response['mnemo'].split(' ');
        }
      });
  }

  shufflePassPhrase() {
    this.passPhraseShuffled = arrayShuffle(this.passPhrase);
  }

  deleteItem(item: any) {
    const index: number = this.passPhraseOrdered.indexOf(item);
    this.passPhraseOrdered.splice(index, 1);
    this.passPhraseShuffled.push(item);
    this.checkPassPhraseOrdered();
  }

  addItem(item: any) {
    const index: number = this.passPhraseShuffled.indexOf(item);
    this.passPhraseShuffled.splice(index, 1);
    this.passPhraseOrdered.push(item);
    this.checkPassPhraseOrdered();
  }

  switchPassPhrase(event: CdkDragDrop<any>) {
    this.passPhraseOrdered[event.previousContainer.data.index] =
      event.container.data.item;
    this.passPhraseOrdered[event.container.data.index] =
      event.previousContainer.data.item;
    this.checkPassPhraseOrdered();
  }

  checkPassPhraseOrdered() {
    if (this.passPhraseOrdered.length === 24) {
      this.stringPassPhrase = this.passPhraseOrdered
        .map((element: any) => element)
        .join(' ');
      this.walletFacade
        .getUserWallet()
        .pipe(
          mergeMap((data: any) => {
            if (!!data) {
              return this.CreatePasswordWalletService.checkPassPhraseOrdered(
                this.stringPassPhrase
              );
            }
            return of(null);
          })
        )
        .pipe(
          filter((res) => res !== null),
          takeUntil(this.isDestroyed)
        )
        .subscribe((response: any) => {
          if (response !== null && response !== undefined) {
            if (response['verify']) {
              this.disabled = false;
              this.check = 'correct';

              // let data_profile = {
              //   passphrase: true
              // };

              // this.profileSettingsFacade.updateProfile(data_profile).subscribe((data: any) => {
              //   console.log(data);
              //   // route to next page
              // })
            } else {
              this.check = 'incorrect';
              this.disabled = true;
            }
          }
        });
    } else {
      this.check = '';
      this.disabled = true;
    }
  }

  confirm() {
    this.tokenStorageService.setSecureWallet('visited-passPhrase', 'true');
    let data_profile = {
      visitPassphrase: true,
      new: true
    };

    this.profileSettingsFacade
      .updateProfile(data_profile)
      .pipe(takeUntil(this.isDestroyed))
      .subscribe(() => {
        this.accountFacadeService.dispatchUpdatedAccount();
        // route to next page
      });

    this.router.navigate(['social-registration/downaldJSON']);
  }
  reset() {
    this.passPhraseOrdered = [];
    this.shufflePassPhrase();
    this.check = '';
  }
  visitPassPhrase() {
    let data_profile = {
      visitPassphrase: true
    };
    this.profileSettingsFacade
      .updateProfile(data_profile)
      .pipe(takeUntil(this.isDestroyed))
      .subscribe(() => {
        this.accountFacadeService.dispatchUpdatedAccount();

        // route to next page
      });
  }

  trackByPassPhraseId(index: number): number {
    return index;
  }
  trackByPassPhraseShuffledId(index: number): number {
    return index;
  }
}
