import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { DraftCampaignService } from '@app/campaigns/services/draft-campaign.service';
import { arrayLength } from '@app/helpers/form-validators';
import { Campaign } from '@app/models/campaign.model';
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
  isTwitterSelected = false;
  isLinkedinSelected = false;
  isTikTokSelected = false;
  isReachLimitActivated = false;
  @Input() id = '';
  disableBtn!: boolean;
  @Input() draftData!: Campaign;
  campaignMissionsOracl: string[] = [];
  form: FormGroup = new FormGroup({
    missions: new FormArray([
      new FormGroup({
        oracle: new FormControl('facebook'),
        sub_missions: new FormArray([], Validators.max(5))
      }),
      new FormGroup({
        oracle: new FormControl('twitter'),
        sub_missions: new FormArray([])
      }),
      new FormGroup({
        oracle: new FormControl('linkedin'),
        sub_missions: new FormArray([])
      }),
      new FormGroup({
        oracle: new FormControl('youtube'),
        sub_missions: new FormArray([])
      }),
      new FormGroup({
        oracle: new FormControl('instagram'),
        sub_missions: new FormArray([])
      }),
      new FormGroup({
        oracle: new FormControl('tikTok'),
        sub_missions: new FormArray([])
      })
    ])
  });

  missionsExamples = [
    {
      oracle: 'facebook',
      sub_missions: [
        'Make a post to introduce @product',
        'Make a story about @product',
        'Take a picture of you and the @product'
      ]
    },
    {
      oracle: 'twitter',
      sub_missions: [
        'Make a tweet of 100 caract. min about @product',
        'Use the tags #@product #@brand #tag3',
        'Mention @brand and @product'
      ]
    },
    {
      oracle: 'youtube',
      sub_missions: [
        'Make a video of at least 2min',
        'Make a tutorial on the @product',
        'Quote the @brand and the @product---'
      ]
    },
    {
      oracle: 'linkedin',
      sub_missions: [
        'Mention @brand and @product',
        'Add tags #tag01 #tag02 #tag03',
        'Unbox the @product'
      ]
    },
    {
      oracle: 'instagram',
      sub_missions: [
        'Post a photo of the product “xxx”',
        'Add tags #tag01 #tag02 #tag03',
        'Indicate as a paid partnership with our brand'
      ]
    },
    {
      oracle: 'tikTok',
      sub_missions: [
        'Post a photo of the product “xxx”',
        'Add tags #tag01 #tag02 #tag03',
        'Indicate as a paid partnership with our brand'
      ]
    }
  ];

  selecledOracle!: string;
  isDestroyed$ = new Subject<any>();
  showFacebook: boolean = false;
  showInstagram: boolean = false;
  showYoutube: boolean = false;
  showLinkedIn: boolean = false;
  showTwitter: boolean = false;
  showTikTok: boolean = false;
  constructor(private service: DraftCampaignService) {}
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
    return this.form.get('missions') as FormArray;
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
        (this.missions.at(0).get('sub_missions') as FormArray).clear();
      } else if (this.closeOracle === 'twitter') {
        (this.missions.at(1).get('sub_missions') as FormArray).clear();
      } else if (this.closeOracle === 'youtube') {
        (this.missions.at(3).get('sub_missions') as FormArray).clear();
      } else if (this.closeOracle === 'linkedin') {
        (this.missions.at(2).get('sub_missions') as FormArray).clear();
      } else if (this.closeOracle === 'instagram') {
        (this.missions.at(4).get('sub_missions') as FormArray).clear();
      } else if (this.closeOracle === 'tikTok') {
        (this.missions.at(4).get('sub_missions') as FormArray).clear();
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
        const group = new FormGroup({
          oracle: new FormControl(mission.oracle),
          sub_missions: new FormArray(
            mission.sub_missions.map((sub_mission: any) => {
              return new FormGroup(
                {
                  mission: new FormControl(
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

      this.form.setControl('missions', new FormArray(controls));
    }
  }
  isIncludeOracle(oracle: string) {
    return this.campaignMissionsOracl.includes(oracle);
  }
  prePopulateInputs(missions: any[]) {
    if (missions) {
      const controls = missions.map((mission) => {
        const group = new FormGroup({
          oracle: new FormControl(mission.oracle),
          sub_missions: new FormArray(
            mission.sub_missions.map((sub_mission: string) => {
              return new FormGroup(
                {
                  mission: new FormControl(sub_mission)
                },
                Validators.required
              );
            }),
            [arrayLength()]
          )
        });
        return group;
      });

      this.form.setControl('missions', new FormArray(controls));
    }
  }
  removeValue(missionIndex: number, index: number) {
    const subMissions = this.missions
      .at(missionIndex)
      .get('sub_missions') as FormArray;
    subMissions.removeAt(index);
  }

  getSubMissions(index: number) {
    return this.missions.at(index).get('sub_missions') as FormArray;
  }

  addSubMissions(missionIndex: number): void {
    const subMissions = this.missions
      .at(missionIndex)
      .get('sub_missions') as FormArray;
    subMissions.push(this.newMission());
  }

  newMission(): FormGroup {
    return new FormGroup({
      mission: new FormControl(null)
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
      (this.missions.at(index).get('sub_missions') as FormArray).clear();
    }
  }
  prePopulateOneInputs(index: number, oracle: string) {
    let miss = this.missionsExamples.find((elem) => elem.oracle === oracle);
    miss?.sub_missions.forEach((sub_mission: string) => {
      (this.missions.at(index).get('sub_missions') as FormArray).push(
        new FormGroup({
          mission: new FormControl(sub_mission)
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
