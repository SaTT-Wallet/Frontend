import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { DraftCampaignService } from '@app/campaigns/services/draft-campaign.service';
import { arrayLength } from '@app/helpers/form-validators';
import { Campaign } from '@app/models/campaign.model';
import { FacebookLoginProvider } from 'angularx-social-login';
import { Subject } from 'rxjs';
import { debounceTime, ignoreElements, takeUntil, tap } from 'rxjs/operators';

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
  @Output() selectedYoutube = new EventEmitter();
  @Output() selectedTwitter = new EventEmitter();
  @Output() selectedFacebook = new EventEmitter();
  @Output() selectedInstagram = new EventEmitter();
  @Output() selectedLinkedin = new EventEmitter();
  isFacebookSelected = false;
  isYoutubeSelected = false;
  isInstagramSelected = false;
  isTwitterSelected = false;
  isLinkedinSelected = false;
  isReachLimitActivated = false;
  @Input() id = '';
  disableBtn!: boolean;
  @Input() draftData!: Campaign;
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
      })
    ])
  });

  missionsExamples = [
    {
      oracle: 'facebook',
      subMission: [
        'Make a post to introduce @product',
        'Make a story about @product',
        'Take a picture of you and the @product'
      ]
    },
    {
      oracle: 'twitter',
      subMission: [
        'Make a tweet of 100 caract. min about @product',
        'Use the tags #@product #@brand #tag3',
        'Mention @brand and @product'
      ]
    },
    {
      oracle: 'youtube',
      subMission: [
        'Make a video of at least 2min',
        'Make a tutorial on the @product',
        'Quote the @brand and the @product---'
      ]
    },
    {
      oracle: 'linkedin',
      subMission: [
        'Mention @brand and @product',
        'Add tags #tag01 #tag02 #tag03',
        'Unbox the @product'
      ]
    },
    {
      oracle: 'instagram',
      subMission: [
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
  constructor(private service: DraftCampaignService) {}
  ngOnDestroy(): void {
    this.isDestroyed$.next('');
    this.isDestroyed$.unsubscribe();
  }
  ngOnInit(): void {
    this.saveForm();
    // this.setPreSelectedMissions();
    //  this.prePopulateInputs(this.missionsExamples);
  }
  get f() {
    return this.form.controls;
  }
  get missions() {
    return this.form.get('missions') as FormArray;
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
          if (this.form.valid) {
            this.validFormMission.emit(true);
          } else {
            this.validFormMission.emit(false);
          }

          if (this.draftData.id && this.form.valid) {
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

  prePopulateInputs(missions: any[]) {
    const controls = missions.map((mission) => {
      const group = new FormGroup({
        oracle: new FormControl(mission.oracle),
        sub_missions: new FormArray(
          mission.subMission.map((sub_mission: string) => {
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
  onToggle(event: boolean, index: number, oracle: string) {
    const subMissions = this.missions
      .at(index)
      .get('sub_missions') as FormArray;
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
    miss?.subMission.forEach((sub_mission: string) => {
      (this.missions.at(index).get('sub_missions') as FormArray).push(
        new FormGroup({
          mission: new FormControl(sub_mission)
        })
      );
    });
    this.missions.at(index).get('sub_missions')?.setValidators([arrayLength()]);
    this.missions.at(index).updateValueAndValidity();
  }
  // setPreSelectedMissions() {
  //   let array = [];
  //   if (this.draftData.missions !== []) {
  //     array = this.draftData.missions;
  //     console.log(array, 'array');
  //   }
  // }
  ngOnChanges() {
    this.form?.valueChanges
      .pipe(
        debounceTime(500),
        tap((values: any) => {
          this.setPreSelectedMissions();
          if (this.form.valid) {
            this.validFormMission.emit(true);
          } else {
            this.validFormMission.emit(false);
          }
        }),
        takeUntil(this.isDestroyed$)
      )
      .subscribe();
  }
  setPreSelectedMissions() {
    let array = [];

    array = this.form.get('missions')?.value;

    // this.isFacebookSelected = array.find(
    //   (elem: any) => elem.oracle === 'facebook'
    // )
    //   ? true
    //   : false;
    // this.selectedFacebook.emit(this.isFacebookSelected);
    // if (this.isFacebookSelected === true) {
    //   this.selectedFacebook.emit(true);
    //   console.log(this.isFacebookSelected, 'fb selected');
    // }
    array.forEach((element: any) => {
      if (element.oracle === 'youtube') {
        if (element.sub_missions.length > 0) {
          this.isYoutubeSelected = true;
          this.selectedYoutube.emit(this.isYoutubeSelected);
        } else {
          this.isYoutubeSelected = false;
          this.selectedYoutube.emit(this.isYoutubeSelected);
        }
      } else if (element.oracle === 'twitter') {
        if (element.sub_missions.length > 0) {
          this.isTwitterSelected = true;
          this.selectedTwitter.emit(this.isTwitterSelected);
        } else {
          this.isTwitterSelected = false;
          this.selectedTwitter.emit(this.isTwitterSelected);
        }
      } else if (element.oracle === 'facebook') {
        if (element.sub_missions.length > 0) {
          this.isFacebookSelected = true;
          this.selectedFacebook.emit(this.isFacebookSelected);
        } else {
          this.isFacebookSelected = false;
          this.selectedFacebook.emit(this.isFacebookSelected);
        }
      } else if (element.oracle === 'instagram') {
        if (element.sub_missions.length > 0) {
          this.isInstagramSelected = true;
          this.selectedInstagram.emit(this.isInstagramSelected);
        } else {
          this.isInstagramSelected = false;
          this.selectedInstagram.emit(this.isInstagramSelected);
        }
      } else if (element.oracle === 'linkedin') {
        if (element.sub_missions.length > 0) {
          this.isLinkedinSelected = true;
          this.selectedLinkedin.emit(this.isLinkedinSelected);
        } else {
          this.isLinkedinSelected = false;
          this.selectedLinkedin.emit(this.isLinkedinSelected);
        }
      }
    });
  }

  // this.isYoutubeSelected = array.find((elem: any) => {
  //   elem.oracle === 'youtube' && elem.sub_missions.length > 0;
  // })
  //   ? true
  //   : false;
  // this.selectedYoutube.emit(this.isYoutubeSelected);
  // console.log(this.isYoutubeSelected, 'his.isYoutubeSelected form mis');
  // if (this.isYoutubeSelected === true) {

  //   console.log(this.isYoutubeSelected, 'youu selected');
  // }
  // this.isInstagramSelected = array.find(
  //   (elem: any) =>
  //     elem.oracle === 'instagram' && elem.sub_missions.sub_missions.length > 0
  // )
  //   ? true
  //   : false;
  // if (this.isInstagramSelected === true) {
  //   //this.selectedInstagram.emit(true);
  // }
  // this.isTwitterSelected = array.find(
  //   (elem: any) =>
  //     elem.oracle === 'twitter' && elem.sub_missions.sub_missions.length > 0
  // )
  //   ? true
  //   : false;
  // if (this.isTwitterSelected === true) {
  //   //  this.selectedTwitter.emit(true);
  // }
  // this.isLinkedinSelected = array.find(
  //   (elem: any) =>
  //     elem.oracle === 'linkedin' && elem.sub_missions.sub_missions.length > 0
  // )
  //   ? true
  //   : false;
  // if (this.isLinkedinSelected === true) {
  //   // this.selectedLinkedin.emit(true);
  // }
}
