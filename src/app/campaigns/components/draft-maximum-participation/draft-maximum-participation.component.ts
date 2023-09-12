import { Component, OnInit,ViewChild,Output,EventEmitter,OnDestroy } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CampaignHttpApiService } from '@core/services/campaign/campaign.service';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Subject,Subscription } from 'rxjs';
import { DraftCampaignService } from '@campaigns/services/draft-campaign.service';


@Component({
  selector: 'app-draft-maximum-participation',
  templateUrl: './draft-maximum-participation.component.html',
  styleUrls: ['./draft-maximum-participation.component.css']
})


export class DraftMaximumParticipationComponent implements OnInit {
   
  private inputValueSubject = new Subject<string>();
  private inputValueSubscription: Subscription | undefined;
  private isDestroyed = new Subject();

  form = new UntypedFormGroup({
    limitParticipation: new UntypedFormControl(0, [Validators.required])
  });
  constructor(private route: ActivatedRoute, 
              private campaignService: CampaignHttpApiService,
              private service :DraftCampaignService) {

                this.form = new UntypedFormGroup(
                  {
                    limitParticipation: new UntypedFormControl(0, {
                      validators: Validators.required
                    }),
                  }
                );
  }
  id! :any;
  ngOnInit(): void {
      // Accessing the ID parameter from the URL
  this.id = this.route.snapshot.paramMap.get('id');

  // Set up the subscription
  this.inputValueSubscription = this.inputValueSubject
    .pipe(
      debounceTime(1000), // Adjust the debounce time as needed (in milliseconds)
      switchMap((value) => {
        console.log('SwitchMap triggered with value:', value);

        return this.saveParticipantsNumber(+value)}
        ) // Convert value to a number and send the API request
    )
    .subscribe();

  }
  inputValue: string = '';
  @ViewChild('toggleSwitch', { static: true }) toggleSwitch: any;
onInputChanged() {
  console.log('Emitting value:', this.inputValue);
    this.saveForm();
    !this.toggleSwitch.checked && (this.inputValue = '');  
    this.form.get('limitParticipation')?.setValue(this.inputValue || 0)
    return this.campaignService.updateOneById({limitParticipation :this.inputValue || 0},this.id).subscribe((data : any)=>{console.log(data);})
  }

  private saveParticipantsNumber(limit : number){
 console.log('here')
    return this.campaignService.updateOneById({limit},this.id)
  }


  saveForm() {
    this.form.valueChanges
      .pipe(
        debounceTime(500),
        tap((values: any) => {
          if (this.id) {
            this.service.autoSaveFormOnValueChanges({
              formData: values,
              id: this.id
            });
          }
        }),
        takeUntil(this.isDestroyed)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    if (this.inputValueSubscription) {
      this.inputValueSubscription.unsubscribe();
    }
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
}
