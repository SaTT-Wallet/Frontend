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
  Inject,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Editor, Toolbar } from 'ngx-editor';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';
import { DraftCampaignService } from '@campaigns/services/draft-campaign.service';
import { Campaign } from '@app/models/campaign.model';
import { TranslateService } from '@ngx-translate/core';
import { ImageTransform } from 'ngx-image-cropper';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CampaignsService } from '@app/campaigns/facade/campaigns.facade';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  
  @ViewChild('iaModal', { static: false })
  private iaModal!: TemplateRef<any>;
  @Input() id = '';
  transform: ImageTransform = {};
  @Input() draftData: Campaign = new Campaign();
  @Input() notValidPresentation: any;
  @Output() validFormPresentation = new EventEmitter();
  @Output() saveFormStatus = new EventEmitter();
  private render: Renderer2;
  isGenerating: boolean = false;
  ai_result :any;
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
    private fb: FormBuilder,
    private http: HttpClient,
    private service: DraftCampaignService,
    public translate: TranslateService,
    private campaignFacade: CampaignsService,
    rendererFactory: RendererFactory2,
    public modalService: NgbModal,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    this.form = fb.group({
      titles: [''],
      title: ['', Validators.required],
      summary: ['', Validators.required],
      description: [''] // Assuming you have a descriptigit son field in your formtitle
    });
    this.render = rendererFactory.createRenderer(null, null);
    this.form = new UntypedFormGroup({
      titles: new UntypedFormControl(''),
      title: new UntypedFormControl('', Validators.required),
      brand: new UntypedFormControl('', Validators.required),
      reference: new UntypedFormControl(''),
      summary: new UntypedFormControl('', [
        Validators.required,
        Validators.maxLength(250)
      ]),
      description: new UntypedFormControl('', Validators.required),
    });
  }
closeModal(content: any) {
    this.modalService.dismissAll(content);
  }


  generateBrief() {
    this.isGenerating = true;
    this.campaignFacade.generateBriefIA(this.form.get('titles')?.value).subscribe(
      (data:any) => {
        if(data.message === 'success') {
          this.ai_result= data.data.choices[0].message.content;
          const jsonData = JSON.parse(this.ai_result);
        const title = jsonData.title;
        const description = jsonData.description;
        const shortDescription = jsonData.short_description;

        const rules: any= jsonData.rules; 
        const rulesArray = rules.split(/\d+\./);
        const formattedRules: string[] = rulesArray.filter((rule: string) => rule.trim() !== '').map((rule: string) => rule.trim());
        const formattedString = formattedRules.join('<br>');
        this.form.patchValue({ title: title });
        this.form.patchValue({ summary: shortDescription });
        this.form.patchValue({ description: '<p><b>DESCRIPTION: </b></p>'  + description + '<p><b>RULES: </b></p>'  + formattedString });
        this.isGenerating = false; 
        this.closeModalAi();
      } else this.isGenerating = false;
    }, (err:any) => {
      this.isGenerating = false;
    })
}
openModalAi(){
  this.isGenerating = false; 
  this.form.get('titles')?.setValue('');
  this.modalService.open(this.iaModal, {
  backdrop: 'static',
  keyboard: false
  });
  }
  closeModalAi() {
    this.closeModal(this.iaModal);
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
  checkValidForm() {
    const isValidForm = this.form.valid && this.descriptionPattern(this.form.get('description')?.value);
    this.validFormPresentation.emit(isValidForm); 
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
            this.checkValidForm()
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
