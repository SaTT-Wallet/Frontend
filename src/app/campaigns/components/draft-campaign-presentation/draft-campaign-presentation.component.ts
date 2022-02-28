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
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  form = new FormGroup({});
  editor = new Editor();
  toolbar: Toolbar = [
    ['bold', 'italic'],
        ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['link', 'image'],

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
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      brand: new FormControl(''),
      reference: new FormControl(''),
      summary: new FormControl('', [
        Validators.required,
        Validators.maxLength(250)
      ]),
      description: new FormControl('', Validators.required)
    });
  }
  ngOnInit(): void {
    //this.getCampaignLogo();
    //this.getCampaignCover();
    this.saveForm();
    this.emitFormStatus();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.draftData && changes.draftData.currentValue.id) {
      this.populateForm(this.draftData);
      if (this.form.valid) {
        this.validFormPresentation.emit(true);
      } else {
        this.validFormPresentation.emit(false);
      }
    }
  }
  saveForm() {
    this.form.valueChanges
      .pipe(
        debounceTime(500),
        tap((values: any) => {
          if (this.draftData.id && this.form.valid) {
            this.validFormPresentation.emit(true);
            this.service.autoSaveFormOnValueChanges({
              formData: values,
              id: this.id
            });
          } else {
            this.validFormPresentation.emit(false);
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

  populateForm(data: Campaign) {
    this.form.patchValue(
      {
        title: data.title,
        brand: data.brand,
        summary: data.summary,
        reference: data.reference,
        description: data.description
      },
      { emitEvent: false, onlySelf: true }
    );
  }

  onImgError(event: any) {
    event.target.src = 'assets/Images/moonboy/Default_avatar_MoonBoy.png';
  }
  ngOnDestroy(): void {
    this.isDestroyed$.next('');
    this.isDestroyed$.unsubscribe();
  }
}
