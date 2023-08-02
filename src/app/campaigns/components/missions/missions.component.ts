import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DraftCampaignService } from '@app/campaigns/services/draft-campaign.service';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';
import { arrayLength } from '@app/helpers/form-validators';
import { Campaign } from '@app/models/campaign.model';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-missions',
  templateUrl: './missions.component.html',
  styleUrls: [
    './../../../styles/edit-campaign.styles.css',
    './missions.component.scss'
  ]
})
export class MissionsComponent implements OnInit {
  @Output() validFormMission = new EventEmitter();
  @Output() selectedOracle = new EventEmitter();
  @Input() notValidMissionData: any;
  @Input() closeOracle: string = '';
  isFacebookSelected = false;
  isYoutubeSelected = false;
  isInstagramSelected = false;
  isThreadsSelected = false;
  isTwitterSelected = false;
  isLinkedinSelected = false;
  isTikTokSelected = false;
  isReachLimitActivated = false;
  isGoogleAnalyticsSelected = false;
  @Input() id = '';
  disableBtn!: boolean;
  @Input() draftData!: Campaign;
  campaignMissionsOracl: string[] = [];
  form: UntypedFormGroup = new UntypedFormGroup({
    missions: new UntypedFormArray([
      new UntypedFormGroup({
        oracle: new UntypedFormControl('facebook'),
        sub_missions: new UntypedFormArray([], Validators.max(5))
      }),
      new UntypedFormGroup({
        oracle: new UntypedFormControl('twitter'),
        sub_missions: new UntypedFormArray([])
      }),
      new UntypedFormGroup({
        oracle: new UntypedFormControl('linkedin'),
        sub_missions: new UntypedFormArray([])
      }),
      new UntypedFormGroup({
        oracle: new UntypedFormControl('youtube'),
        sub_missions: new UntypedFormArray([])
      }),
      new UntypedFormGroup({
        oracle: new UntypedFormControl('instagram'),
        sub_missions: new UntypedFormArray([])
      }),
  
      new UntypedFormGroup({
        oracle: new UntypedFormControl('tiktok'),
        sub_missions: new UntypedFormArray([])
      }),
      new UntypedFormGroup({
        oracle: new UntypedFormControl('threads'),
        sub_missions: new UntypedFormArray([])
      })
      // new FormGroup({
      //   oracle: new FormControl('googleAnalytics'),
      //   sub_missions: new FormArray([])
      // })
    ])
  });

  missionsExamples = [
    {
      oracle: 'facebook',
      sub_missions: [
        this.translate.instant('missions.facebook.postIntroduction', { product: '@product' }),
        this.translate.instant('missions.facebook.makeStory', { product: '@product' }),
        this.translate.instant('missions.facebook.takePicture', { product: '@product' })
      ]
    },
    {
      oracle: 'twitter',
      sub_missions: [
        this.translate.instant('missions.twitter.makeTweet', { product: '@product' }),
        this.translate.instant('missions.twitter.useTags', { product: '@product', brand: '@brand', tag3: '#tag3' }),
        this.translate.instant('missions.twitter.mentionBrand', { brand: '@brand', product: '@product' })
      ]
    },
    {
      oracle: 'youtube',
      sub_missions: [
        this.translate.instant('missions.youtube.makeVideo'),
        this.translate.instant('missions.youtube.makeTutorial', { product: '@product' }),
        this.translate.instant('missions.youtube.quoteBrandAndProduct', { brand: '@brand', product: '@product' })
      ]
    },
    {
      oracle: 'linkedin',
      sub_missions: [
        this.translate.instant('missions.linkedin.mentionBrandAndProduct', { brand: '@brand', product: '@product' }),
        this.translate.instant('missions.linkedin.addTags', { tag01: '#tag01', tag02: '#tag02', tag03: '#tag03' }),
        this.translate.instant('missions.linkedin.unboxProduct', { product: '@product' })
      ]
    },
    {
      oracle: 'instagram',
      sub_missions: [
        this.translate.instant('missions.instagram.postPhoto', { product: 'xxx' }),
        this.translate.instant('missions.instagram.addTags', { tag01: '#tag01', tag02: '#tag02', tag03: '#tag03' }),
        this.translate.instant('missions.instagram.indicatePaidPartnership')
      ]
    },
  
    {
      oracle: 'tiktok',
      sub_missions: [
        this.translate.instant('missions.tiktok.postPhoto', { product: 'xxx' }),
        this.translate.instant('missions.tiktok.addTags', { tag01: '#tag01', tag02: '#tag02', tag03: '#tag03' }),
        this.translate.instant('missions.tiktok.indicatePaidPartnership')
      ]
    },
    {
      oracle: 'threads',
      sub_missions: [
        this.translate.instant('missions.threads.postPhoto', { product: 'xxx' }),
        this.translate.instant('missions.threads.addTags', { tag01: '#tag01', tag02: '#tag02', tag03: '#tag03' }),
        this.translate.instant('missions.threads.indicatePaidPartnership')
      ]
    },
    {
      oracle: 'googleAnalytics',
      sub_missions: [
        this.translate.instant('missions.googleAnalytics.postPhoto', { product: 'xxx' }),
        this.translate.instant('missions.googleAnalytics.addTags', { tag01: '#tag01', tag02: '#tag02', tag03: '#tag03' }),
        this.translate.instant('missions.googleAnalytics.indicatePaidPartnership')
      ]
    }
  ];
  

  selecledOracle!: string;
  isDestroyed$ = new Subject<any>();
  showFacebook: boolean = false;
  showInstagram: boolean = false;
  showThreads: boolean= false;
  showYoutube: boolean = false;
  showLinkedIn: boolean = false;
  showTwitter: boolean = false;
  showTikTok: boolean = false;
  showGoogleAnalytics: boolean = false;
  languageSelected: string;
  constructor(private service: DraftCampaignService,    
    public translate: TranslateService,
    private tokenStorageService: TokenStorageService

    ) {
      translate.addLangs(['en', 'fr']);
      if (this.tokenStorageService.getLocale()) {
        // @ts-ignore
        this.languageSelected = this.tokenStorageService.getLocale();
        translate.setDefaultLang(this.languageSelected);
        this.translate.use(this.languageSelected);
      } else {
        this.tokenStorageService.setLocalLang('en');
        this.languageSelected = 'en';
        translate.setDefaultLang('en');
        this.translate.use(this.languageSelected);
      }
    }
 
  ngOnDestroy(): void {
    this.isDestroyed$.next('');
    this.isDestroyed$.unsubscribe();
  }
  ngOnInit(): void {
    this.saveForm();
  }
  get f() {
    return this.form.controls;
  }
  get missions() {
    return this.form.get('missions') as UntypedFormArray;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.draftData && changes.draftData.currentValue) {
      this.form?.patchValue(this.draftData, { emitEvent: false });
      // this.form?.patchValue(
      //   {
      //     missions: this.draftData.missions
      //   },
      //   { emitEvent: false }
      // );
      if (this.draftData.missions?.length > 0) {
        //this.prePopulateInputs(this.draftData.missions);
        this.checkRequired();
      }
      if (
        this.form.valid &&
        this.draftData.id &&
        this.campaignMissionsOracl.length > 0
      ) {
        this.validFormMission.emit(true);
      } else {
        this.validFormMission.emit(false);
      }
    }
    if (changes.notValidMissionData) {
      if (!this.notValidMissionData && this.form.valid && this.draftData.id) {
        this.service.autoSaveFormOnValueChanges({
          formData: this.form.value,
          id: this.id
        });
      }
    }
    if (changes.closeOracle) {
      if (this.closeOracle === 'facebook') {
        (this.missions.at(0).get('sub_missions') as UntypedFormArray).clear();
      } else if (this.closeOracle === 'twitter') {
        (this.missions.at(1).get('sub_missions') as UntypedFormArray).clear();
      } else if (this.closeOracle === 'youtube') {
        (this.missions.at(3).get('sub_missions') as UntypedFormArray).clear();
      } else if (this.closeOracle === 'linkedin') {
        (this.missions.at(2).get('sub_missions') as UntypedFormArray).clear();
      } else if (this.closeOracle === 'instagram') {
        (this.missions.at(4).get('sub_missions') as UntypedFormArray).clear();
      }  else if (this.closeOracle === 'threads') {
        (this.missions.at(4).get('sub_missions') as UntypedFormArray).clear();
      }
      else if (this.closeOracle === 'tiktok') {
        (this.missions.at(5).get('sub_missions') as UntypedFormArray).clear();
      } else if (this.closeOracle === 'googleAnalytics') {
        (this.missions.at(6).get('sub_missions') as UntypedFormArray).clear();
      }
      this.campaignMissionsOracl = this.campaignMissionsOracl.filter(
        (oracle) => {
          return oracle !== this.closeOracle;
        }
      );
    }
  }
  checkRequired() {
    let newArray: any[] = [];
    if (this.draftData.missions) {
      this.draftData.missions.forEach((element: any) => {
        if (element.sub_missions.length > 0) {
          newArray.push(element);
          this.selectedOracle.emit(element.oracle);

          this.campaignMissionsOracl.push(element.oracle);
        } else {
          // let tt = this.missionsExamples.find(
          //   (elem: any) => elem.oracle === element.oracle
          // );
          newArray.push({ oracle: element.oracle, sub_missions: [] });
        }
      });

      const controls = newArray.map((mission) => {
        const group = new UntypedFormGroup({
          oracle: new UntypedFormControl(mission.oracle),
          sub_missions: new UntypedFormArray(
            mission.sub_missions.map((sub_mission: any) => {
              return new UntypedFormGroup(
                {
                  mission: new UntypedFormControl(
                    sub_mission.mission ? sub_mission.mission : sub_mission
                  )
                },
                Validators.required
              );
            }),
            [arrayLength()]
          )
        });
        return group;
      });

      this.form.setControl('missions', new UntypedFormArray(controls));
    }
  }
  isIncludeOracle(oracle: string) {
    return this.campaignMissionsOracl.includes(oracle);
  }
  prePopulateInputs(missions: any[]) {
    if (missions) {
      const controls = missions.map((mission) => {
        const group = new UntypedFormGroup({
          oracle: new UntypedFormControl(mission.oracle),
          sub_missions: new UntypedFormArray(
            mission.sub_missions.map((sub_mission: string) => {
              return new UntypedFormGroup(
                {
                  mission: new UntypedFormControl(sub_mission)
                },
                Validators.required
              );
            }),
            [arrayLength()]
          )
        });
        return group;
      });

      this.form.setControl('missions', new UntypedFormArray(controls));
    }
  }
  removeValue(missionIndex: number, index: number) {
    const subMissions = this.missions
      .at(missionIndex)
      .get('sub_missions') as UntypedFormArray;
    subMissions.removeAt(index);
  }

  getSubMissions(index: number) {
    return this.missions.at(index).get('sub_missions') as UntypedFormArray;
  }

  addSubMissions(missionIndex: number): void {
    const subMissions = this.missions
      .at(missionIndex)
      .get('sub_missions') as UntypedFormArray;
    subMissions.push(this.newMission());
  }

  newMission(): UntypedFormGroup {
    return new UntypedFormGroup({
      mission: new UntypedFormControl(null)
    });
  }
  saveForm() {
    this.form.valueChanges
      .pipe(
        debounceTime(500),
        tap((values: any) => {
          if (this.draftData.id && !this.notValidMissionData) {
            this.service.autoSaveFormOnValueChanges({
              formData: values,
              id: this.id
            });
          }
        }),
        takeUntil(this.isDestroyed$)
      )
      .subscribe();
  }

  onToggle(event: boolean, index: number, oracle: string) {
    this.selectedOracle.emit({ oracle, event });
    this.campaignMissionsOracl.push(oracle);
    this.campaignMissionsOracl = [...new Set(this.campaignMissionsOracl)];
    // const subMissions = this.missions
    //   .at(index)
    //   .get('sub_missions') as FormArray;
    // if (!event) {
    //   var i = subMissions.length;
    //   while (i--) {
    //     if (subMissions.controls[i].value.mission === null) {
    //       this.removeValue(index, i);
    //     }
    //   }
    // }
    if (event) {
      this.prePopulateOneInputs(index, oracle);
    } else {
      (this.missions.at(index).get('sub_missions') as UntypedFormArray).clear();
    }
  }
  prePopulateOneInputs(index: number, oracle: string) {
    let miss = this.missionsExamples.find((elem) => elem.oracle === oracle);
    miss?.sub_missions.forEach((sub_mission: string) => {
      (this.missions.at(index).get('sub_missions') as UntypedFormArray).push(
        new UntypedFormGroup({
          mission: new UntypedFormControl(sub_mission)
        })
      );
    });
    this.missions.at(index).get('sub_missions')?.setValidators([arrayLength()]);
    this.missions.at(index).updateValueAndValidity();
  }
  // populateForm(data: Campaign) {
  //   this.form.patchValue(
  //     {
  //      missions: data.missions
  //     },
  //     { emitEvent: false, onlySelf: true }
  //   );
  // }

  // setPreSelectedMissions(data: any) {
  //   let array = data;
  //   let emitedArray: string[] = [];

  //   array.forEach((element: any) => {
  //     if (element.oracle === 'youtube') {
  //       if (element.sub_missions.length > 0) {
  //         emitedArray.push(element.oracle);
  //         this.isYoutubeSelected = true;
  //         this.selectedYoutube.emit(this.isYoutubeSelected);
  //       } else {
  //         emitedArray.filter((ele) => ele !== element.oracle);
  //         this.isYoutubeSelected = false;
  //         this.selectedYoutube.emit(this.isYoutubeSelected);
  //       }
  //     }
  //     if (element.oracle === 'twitter') {
  //       if (element.sub_missions.length > 0) {
  //         emitedArray.push(element.oracle);
  //         this.isTwitterSelected = true;
  //         this.selectedTwitter.emit(this.isTwitterSelected);
  //       } else {
  //         this.isTwitterSelected = false;
  //         emitedArray.filter((ele) => ele !== element.oracle);
  //         this.selectedTwitter.emit(this.isTwitterSelected);
  //       }
  //     }
  //     if (element.oracle === 'facebook') {
  //       if (element.sub_missions.length > 0) {
  //         emitedArray.push(element.oracle);
  //         this.isFacebookSelected = true;
  //         this.selectedOracle.emit(emitedArray);
  //       } else {
  //         emitedArray.filter((ele) => ele !== element.oracle);
  //         this.isFacebookSelected = false;
  //         this.selectedOracle.emit(emitedArray);
  //       }
  //     }
  //     if (element.oracle === 'instagram') {
  //       if (element.sub_missions.length > 0) {
  //         emitedArray.push(element.oracle);
  //         this.isInstagramSelected = true;
  //         this.selectedOracle.emit(emitedArray);

  //       } else {
  //         emitedArray.filter((ele) => ele !== element.oracle);
  //         this.isInstagramSelected = false;
  //         this.selectedOracle.emit(emitedArray);
  //       }
  //     }
  //     if (element.oracle === 'linkedin') {
  //       if (element.sub_missions.length > 0) {
  //         emitedArray.push(element.oracle);
  //         this.isLinkedinSelected = true;
  //         this.selectedLinkedin.emit(this.isLinkedinSelected);
  //       } else {
  //         emitedArray.filter((ele) => ele !== element.oracle);
  //         this.isLinkedinSelected = false;
  //         this.selectedLinkedin.emit(this.isLinkedinSelected);
  //       }
  //     }
  //   });
  // }
}
