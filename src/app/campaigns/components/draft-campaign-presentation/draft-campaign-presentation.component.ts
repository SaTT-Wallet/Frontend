import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  Renderer2,
  RendererFactory2,
  PLATFORM_ID,
  Inject
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Editor, Toolbar } from 'ngx-editor';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';
import { DraftCampaignService } from '@campaigns/services/draft-campaign.service';
import { Campaign } from '@app/models/campaign.model';
import { TranslateService } from '@ngx-translate/core';
import { ImageTransform } from 'ngx-image-cropper';

@Component({
  selector: 'app-draft-campaign-presentation',
  templateUrl: './draft-campaign-presentation.component.html',
  styleUrls: [
    './../../../styles/edit-campaign.styles.css',
    './draft-campaign-presentation.component.css'
  ]
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DraftCampaignPresentationComponent implements OnInit {
  @Input() id = '';
  transform: ImageTransform = {};
  @Input() draftData: Campaign = new Campaign();
  @Input() notValidPresentation: any;
  @Output() validFormPresentation = new EventEmitter();
  @Output() saveFormStatus = new EventEmitter();
  private render: Renderer2;
  containWithinAspectRatio = false;
  form = new UntypedFormGroup({});
  editor = new Editor();
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['link', 'image']
  ];
  draftId: string = '';
  private isDestroyed$ = new Subject();

  constructor(
    private service: DraftCampaignService,
    public translate: TranslateService,
    rendererFactory: RendererFactory2,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    this.render = rendererFactory.createRenderer(null, null);
    this.form = new UntypedFormGroup({
      title: new UntypedFormControl('', Validators.required),
      brand: new UntypedFormControl('', Validators.required),
      reference: new UntypedFormControl(''),
      summary: new UntypedFormControl('', [
        Validators.required,
        Validators.maxLength(250)
      ]),
      description: new UntypedFormControl('', Validators.required)
    }); 
    
    
  }

  ngOnInit(): void {
    this.saveForm();
    this.emitFormStatus();
    this.fetchCampaignPresentation();
  }

  fetchCampaignPresentation() {
    this.form.get('title')?.setValue(this.draftData.title)
    this.form.get('brand')?.setValue(this.draftData.brand)
    this.form.get('reference')?.setValue(this.draftData.reference)
    this.form.get('summary')?.setValue(this.draftData.summary)
    this.form.get('description')?.setValue(this.draftData.description)
  }
  descriptionPattern(value: String): Boolean {
    return (value !== '<p></p>' && value !== '<h1></h1>' && value !== '<h2></h2>' && value !== '<h3></h3>' && value !== '<h4></h4>' && value !== '<h5></h5>')
  }
 
  saveForm() {
    this.form.valueChanges.pipe(
        debounceTime(500),
        tap((values: any) => {
          if(!!this.draftData.id) {
            this.service.autoSaveFormOnValueChanges({
              formData: values,
              id: this.id
            });
            if(this.form.valid && this.descriptionPattern(this.form.get('description')?.value)) this.validFormPresentation.emit(true);
            else this.validFormPresentation.emit(false); 
          }
        }),
        takeUntil(this.isDestroyed$)
      )
      .subscribe();
  }

  emitFormStatus() {
    this.service.saveStatus
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((status: string) => {
        this.saveFormStatus.emit(status);
      });
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next('');
    this.isDestroyed$.unsubscribe();
  }
}
