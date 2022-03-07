import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { NgSelectConfig } from '@ng-select/ng-select';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { interestsList } from '../../../config/atn.config';
import { ProfileSettingsFacadeService } from '@core/facades/profile-settings-facade.service';

import { filter, map, mergeMap, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
@Component({
  selector: 'app-interests',
  templateUrl: './interests.component.html',
  styleUrls: ['./interests.component.css']
})
export class InterestsComponent implements OnInit {
  interestsTagList: any;
  interestsList: any;
  interestsTagListSet: any;
  formInterests: FormGroup;
  showSpinner: boolean = false;
  isMaxItems: boolean = false;
  disabled: boolean = false;
  errorMsg: string = '';
  selectedItemsNumber: any;
  interestsPercent: any;
  private isDestroyed = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private configSelect: NgSelectConfig,
    private translate: TranslateService,
    private profileSettingsFacade: ProfileSettingsFacadeService,
    private toastr: ToastrService
  ) {
    this.configSelect.notFoundText = 'No results found';
    this.configSelect.appendTo = 'body';
    this.formInterests = this.formBuilder.group({
      interests: new FormControl(null, Validators.required),
      interestsLength: new FormControl()
    });

    this.interestsList = interestsList;
  }
  ngOnInit(): void {
    this.getUserInterests();
    if (this.interestsList.some((interest: any) => interest.checked === true)) {
      this.disabled = false;
      this.showSpinner = false;
    }
  }

  getUserInterests() {
    this.interestsTagList = [];
    this.interestsTagListSet = [];
    // this.showSpinner = true;
    this.profileSettingsFacade
      .getInterests()
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((response: any) => {
        if (response !== null) {
          this.interestsPercent = (
            (response?.interests.length * 100) /
            6
          ).toFixed(0);
          this.showSpinner = false;
          this.interestsTagList = response.interests;
          this.formInterests
            .get('interestsLength')
            ?.setValue(this.interestsTagList.length);
          if (this.interestsTagList.length === 6) {
            this.disabled = true;
          }
          this.interestsTagList.forEach((itemTagList: any) => {
            this.interestsList.forEach((itemList: any) => {
              if (itemTagList === itemList['name']) {
                itemList['checked'] = true;
              }

              this.interestsTagList.map((interest: any) => {
                const indexTag: number =
                  this.interestsTagList?.indexOf(interest);

                if (interest === 'kitchen') {
                  let item: any = interestsList.find(
                    (itemList) => itemList.name === 'food'
                  );
                  item.checked = true;
                  this.interestsTagList.splice(indexTag, 1, 'food');
                }

                if (interest === 'dance') {
                  let item: any = interestsList.find(
                    (itemList) => itemList.name === 'parties'
                  );
                  item.checked = true;
                  this.interestsTagList.splice(indexTag, 1, 'parties');
                }

                if (interest === 'culture') {
                  let item: any = interestsList.find(
                    (itemList) => itemList.name === 'reading'
                  );
                  item.checked = true;
                  this.interestsTagList.splice(indexTag, 1, 'reading');
                }

                if (interest === 'painting' || interest === 'sewing') {
                  let item: any = interestsList.find(
                    (itemList) => itemList.name === 'creative-hobbies'
                  );
                  item.checked = true;
                  this.interestsTagList.splice(indexTag, 1, 'creative-hobbies');
                }
              });
            });
          });
          this.interestsTagListSet = Array.from(new Set(this.interestsTagList));
          this.selectedItemsNumber = this.interestsTagListSet.length;
        }
      });
  }

  selectInterest(event: any, name: any) {
    const indexTag: number = this.interestsTagListSet.indexOf(name);
    if (
      event.target.checked === true ||
      !this.interestsTagListSet.includes(name)
    ) {
      if (this.interestsTagListSet.length < 6) {
        this.interestsTagListSet.push(name);

        this.interestsList.forEach((itemList: any) => {
          if (name === itemList['name']) {
            itemList['checked'] = true;
          }
        });
      }
    } else {
      this.interestsTagListSet.splice(indexTag, 1);
      this.interestsList.forEach((itemList: any) => {
        if (name === itemList['name']) {
          itemList['checked'] = false;
        }
        if (name === 'kitchen') {
          let item: any = interestsList.find(
            (itemList) => itemList.name === 'food'
          );
          item.checked = false;
        }
      });
    }
    this.selectedItemsNumber = this.interestsTagListSet.length;
    if (
      this.interestsList.every((interest: any) => interest.checked === false)
    ) {
      this.disabled = true;
    }
    if (
      this.interestsList.some((interest: any) => interest.checked === true) &&
      this.selectedItemsNumber < 6
    ) {
      this.disabled = false;
    }
  }

  addInterests() {
    this.profileSettingsFacade
      .getInterests()
      .pipe(
        mergeMap((response: any) => {
          if (response == null) {
            return this.profileSettingsFacade
              .addInterests(this.interestsTagListSet)
              .pipe(
                map((res: any) => {
                  return { res, type: '1' };
                })
              );
          } else {
            return this.profileSettingsFacade
              .updateInterests(this.interestsTagListSet)
              .pipe(
                map((res: any) => {
                  return { res, type: '2' };
                })
              );
          }
          return of(null);
        })
      )
      .pipe(filter((res) => res !== null))
      .pipe(
        mergeMap(({ res, type }: any) => {
          if (type === '1') {
            if (res) {
              this.showSpinner = false;
              this.formInterests.reset();
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              let msg: string = '';
              return this.translate.get('update_profile');

              //  this.disabled = true;
            }
          } else if (type === '2') {
            if (res.message === 'interests updated') {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              let msg: string = '';
              return this.translate.get('update_profile');
            }
          }
          return of(null);
        })
      )
      .pipe(
        filter((res) => res !== null),
        takeUntil(this.isDestroyed)
      )
      .subscribe((res: any) => {
        this.toastr.success(res);
        this.ngOnInit();
      });
  }
  trackByInterests(index: number, interest: any): string {
    return interest.code;
  }
  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
}
