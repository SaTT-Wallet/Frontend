import { ImgCropperEvent } from '@alyle/ui/image-cropper';
import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  RendererFactory2,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { DraftCampaignService } from '@app/campaigns/services/draft-campaign.service';
import { CampaignHttpApiService } from '@app/core/services/campaign/campaign.service';
import { Campaign } from '@app/models/campaign.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-draft-picture',
  templateUrl: './draft-picture.component.html',
  styleUrls: ['./draft-picture.component.scss']
})
export class DraftPictureComponent implements OnInit, OnDestroy, OnChanges {
  @Input() id = '';
  transform: ImageTransform = {};
  transformMobile: ImageTransform = {};
  @Input() draftData: Campaign = new Campaign();
  @Input() notValidPicture: any;
  @Output() validFormPicture = new EventEmitter();
  @Output() saveFormStatus = new EventEmitter();
  @ViewChild('coverInputMobile', { static: false })
  coverInputMobile!: ElementRef;
  @ViewChild('pictureModal', { static: false }) pictureModal!: TemplateRef<any>;
  img = new Image();
  // ViewChild is used to access the input element.
  @ViewChild('coverInput', { static: false }) inputCover!: ElementRef;
  formUploadPic: FormGroup;
  form: FormGroup;
  logoName: string = '';
  imageLogoChangedEvent: any;
  srcFile: any;
  srcFileMobile: any;
  srcFileLogo: any;
  imageChangedEvent: any = '';
  imageChangedEventMobile: any = '';
  isImageCroppedSubject = new Subject<boolean>();
  isDestroyed$ = new Subject();
  isConformLogo!: boolean;
  isConformCover!: boolean;
  isConformCoverMobile!: boolean;
  picName: any;
  picNameMobile: any;
  showImage: boolean = false;
  showImageMobile: boolean = false;
  draftId: string = '';
  campaignCoverImage: any;
  srcLogo: any;
  base64: any;
  sizeErrorLogo: boolean = false;
  extensionErrorLogo: boolean = false;

  sizeErrorCover: boolean = false;
  extensionErrorCover: boolean = false;

  sizeErrorCoverMobile: boolean = false;
  extensionErrorCoverMobile: boolean = false;
  isNewPicLogo: boolean = false;
  cropper = {
    x1: 100,
    y1: 100,
    x2: 200,
    y2: 200
  };
  cropperMobile = {
    x1: 100,
    y1: 100,
    x2: 200,
    y2: 200
  };
  scale = 1;
  crop: any;
  isCropped: boolean = true;
  canvasRotation = 0;
  canvasRotationMobile = 0;
  cropperMinHeight = 0;
  cropperMinWidth = 0;
  cropperStaticWidth = 1024;
  cropperStaticHeight = 576;
  imageCover!: File;
  imageCoverMobile!: File;
  coverUploadWidthError: boolean = false;
  coverUploadWidthErrorMsg: string = '';
  scaleMob: number = 1;
  constructor(
    private modalService: NgbModal,
    private service: DraftCampaignService,
    private CampaignService: CampaignHttpApiService,
    private sanitizer: DomSanitizer,
    rendererFactory: RendererFactory2,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    this.form = new FormGroup({
      cover: new FormControl('', Validators.required),
      coverSrc: new FormControl('', Validators.required),
      logo: new FormControl('', Validators.required),
      coverMobile: new FormControl('', Validators.required),
      coverSrcMobile: new FormControl('', Validators.required)
    });
    this.formUploadPic = new FormGroup({
      file: new FormControl(null, Validators.required)
    });
  }
  /*
 cover
      coverSrc
      logo
      coverMobile
      coverSrcMobile
*/
  ngOnInit(): void {
    this.imageLoaded();
    this.imageLoadedMobile();
    this.saveForm();
    this.emitFormStatus();
  }
  isValidFile(controlName: any) {
    return (
      this.formUploadPic.get(controlName)?.invalid &&
      this.formUploadPic.get(controlName)?.touched
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.draftData && changes.draftData.currentValue.id) {
      //  this.populateForm(this.draftData);
      if (this.draftData.cover === '' || this.draftData.cover === undefined) {
        this.showImage = false;
      } else {
        this.showImage = true;
        this.form
          .get('cover')
          ?.setValue(this.draftData.cover, { emitEvent: false });
        this.form
          .get('coverSrc')
          ?.setValue(this.draftData.coverSrc, { emitEvent: false });
      }
      if (this.draftData.logo !== '' || this.draftData.logo !== undefined) {
        this.srcLogo = this.draftData.logo;
        this.form
          .get('logo')
          ?.setValue(this.draftData.logo, { emitEvent: false });
      }
      //showImageMobile
      if (
        this.draftData.coverMobile === '' ||
        this.draftData.coverMobile === undefined
      ) {
        this.showImageMobile = false;
      } else {
        this.showImageMobile = true;
        this.form
          .get('coverMobile')
          ?.setValue(this.draftData.coverMobile, { emitEvent: false });
        this.form
          .get('coverSrcMobile')
          ?.setValue(this.draftData.coverSrcMobile, { emitEvent: false });
      }
      if (this.draftData.isActive) {
        if (
          !this.draftData.coverSrc &&
          (this.draftData.cover || this.draftData.coverMobile)
        ) {
          this.draftData.coverSrc = this.draftData.cover
            ? this.draftData.cover
            : this.draftData.coverMobile;
          this.showImage = true;
        }
        if (
          !this.draftData.coverMobile &&
          (this.draftData.cover || this.draftData.coverMobile)
        ) {
          this.draftData.coverMobile = this.draftData.coverMobile
            ? this.draftData.coverMobile
            : this.draftData.cover;
          this.showImageMobile = true;
        }
      }

      if (this.form.valid) {
        this.validFormPicture.emit(true);
      } else {
        this.notValidPicture = false;
        this.validFormPicture.emit(false);
      }
    }
  }
  saveForm() {
    this.form.valueChanges
      .pipe(
        debounceTime(500),
        tap((values: any) => {
          if (this.draftData.id) {
            this.service.autoSaveFormOnValueChanges({
              formData: values,
              id: this.id
            });
          }
          if (this.form.valid) {
            this.validFormPicture.emit(true);
          } else {
            this.notValidPicture = false;
            this.validFormPicture.emit(false);
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
        cover: data.cover,
        coverSrc: data.coverSrc,
        logo: data.logo,
        coverMobile: data.coverMobile,
        coverSrcMobile: data.coverSrcMobile
      },
      { emitEvent: false, onlySelf: true }
    );
  }

  importLogo(event: any) {
    if (
      event.target.files[0].type === 'image/png' ||
      event.target.files[0].type === 'image/jpeg' ||
      event.target.files[0].type === 'image/jpg'
    ) {
      let fileUploaded = event.target.files[0];
      this.openModal(this.pictureModal);
      this.imageLogoChangedEvent = event;
      this.logoName = this.imageLogoChangedEvent.target.files[0].name;
      this.readAsBase64(fileUploaded).then((data) => {
        if (data.result.length < 2000000) {
          this.sizeErrorLogo = false;
          this.formUploadPic.get('file')?.setValue(data);
          this.isConformLogo = true;
        } else {
          this.closeModal(this.pictureModal);
          this.sizeErrorLogo = true;
          this.isConformLogo = false;
        }
      });

      this.isNewPicLogo = true;
    } else {
      this.isConformLogo = false;
      this.imageLogoChangedEvent = null;
    }
  }
  imageCropped(event: ImageCroppedEvent, type: string) {
    if (type === 'desktop') {
      this.srcFile = this.base64ToFile(
        event.base64,
        this.imageChangedEvent.target?.files[0].name
      );
      this.imageCover = this.base64ToFile(
        event.base64,
        this.imageChangedEvent.target?.files[0]
      );
      this.isImageCroppedSubject.next(true);
      this.readAsBase64(this.srcFile).then((data) => {
        if (data.result.length < 2500000) {

          this.sizeErrorCover = false;
          this.form.get('cover')?.setValue(data.result);
        } else {

          this.isConformCover = false;
          this.sizeErrorCover = true;
          this.inputCover.nativeElement.value = '';
        }
      });
      return this.srcFile;
    } else {
      this.srcFileMobile = this.base64ToFile(
        event.base64,
        this.imageChangedEventMobile.target?.files[0].name
      );
      this.imageCoverMobile = this.base64ToFile(
        event.base64,
        this.imageChangedEventMobile.target?.files[0]
      );
      this.isImageCroppedSubject.next(true);
      this.readAsBase64(this.srcFileMobile).then((data) => {
        if (data.result.length < 2000000) {
          this.sizeErrorCoverMobile = false;
          this.form.get('coverMobile')?.setValue(data.result);
        } else {
          this.isConformCoverMobile = false;
          this.sizeErrorCoverMobile = true;
          this.inputCover.nativeElement.value = '';
        }
      });
      return this.srcFileMobile;
    }
  }
  // Cropper
  fileChangeEvent(event: any, type: string): void {
    // console.log('eveeent', event.target.files[0]);
    // console.log('this.inputCover.nativeElement', this.inputCover.nativeElement);
    if (type === 'desktop') {
      this.isCropped = false;
      this.imageChangedEvent = null;
      this.picName = null;
      this.showImage = false;
      let fileUploaded = event.target.files[0];
      let imgExtensions: Array<string> = [
        'image/png',
        'image/jpeg',
        'image/jpg'
      ];
      if (!imgExtensions.includes(fileUploaded.type)) {
        this.extensionErrorCover = true;
        this.inputCover.nativeElement.value = '';
      } else if (fileUploaded.size > 2000000) {
        this.isConformCover = false;
        this.extensionErrorCover = false;
        this.sizeErrorCover = true;
        this.inputCover.nativeElement.value = '';

      } else if (this.coverUploadWidthError) {

        this.extensionErrorCover = false;
        this.inputCover.nativeElement.value = '';
      } else {

        this.extensionErrorCover = false;
        this.picName = fileUploaded.name;
        this.showImage = true;
        this.readAsBase64(fileUploaded).then((data) => {
          if (data.result.length < 2000000) {

            this.imageChangedEvent = event;
            this.isConformCover = true;
            this.sizeErrorCover = false;
            this.form.get('cover')?.setValue(data);
            this.form.get('coverSrc')?.setValue(data.result);
          } else {

            this.isConformCover = false;
            this.imageChangedEvent = null;
            this.sizeErrorCover = true;
            this.inputCover.nativeElement.value = '';
          }
        });
      }
    } else {

      this.isCropped = false;
      this.imageChangedEventMobile = null;
      this.picNameMobile = null;
      this.showImageMobile = false;
      let fileUploaded = event.target.files[0];
      let imgExtensions: Array<string> = [
        'image/png',
        'image/jpeg',
        'image/jpg'
      ];
      if (!imgExtensions.includes(fileUploaded.type)) {
        this.extensionErrorCoverMobile = true;
        this.coverInputMobile.nativeElement.value = '';
      } else if (fileUploaded.size > 2000000) {
        this.isConformCoverMobile = false;
        this.extensionErrorCoverMobile = false;
        this.sizeErrorCoverMobile = true;
        this.coverInputMobile.nativeElement.value = '';
      } else if (this.coverUploadWidthError) {

        this.extensionErrorCoverMobile = false;
        this.coverInputMobile.nativeElement.value = '';
      } else {

        this.picNameMobile = fileUploaded.name;
        this.extensionErrorCoverMobile = false;
        this.readAsBase64(fileUploaded).then((data) => {
          if (data.result.length < 2000000) {

            this.imageChangedEventMobile = event;
            this.isConformCoverMobile = true;
            this.showImageMobile = true;
            this.sizeErrorCoverMobile = false;
            this.form.get('coverMobile')?.setValue(data);
            this.form.get('coverSrcMobile')?.setValue(data.result);
          } else {

            this.imageChangedEvent = null;
            this.isConformCoverMobile = false;
            this.sizeErrorCoverMobile = true;
            this.coverInputMobile.nativeElement.value = '';
          }
        });
      }
    }
  }
  readAsBase64(file: File): Promise<any> {
    /*upload file*/
    const myReader: FileReader = new FileReader();
    const fileValue = new Promise((resolve, reject) => {
      myReader.onloadend = () => {
        let img = new Image();
        img.onload = function () {
          resolve({
            result: myReader.result,
            width: img.width,
            height: img.height
          });
        };
        img.src = myReader.result as any;
        this.base64 = myReader.result;
      };

      try {
        myReader.readAsDataURL(file);
      } catch (e) {
        reject(e);
      }
    });
    return fileValue;
  }
  logoCropped(event: ImageCroppedEvent) {
    this.srcLogo = event.base64;
    if (this.srcLogo.length < 2000000) {
      this.form.get('logo')?.setValue(this.srcLogo);
    } else {
      this.extensionErrorLogo = true;
      this.isConformLogo = false;
    }
  }
  onCrop(e: ImgCropperEvent) {
    this.crop = e.dataURL;
  }

  base64ToFile(data: any, filename: any) {
    const arr = data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
  rotateLeft(type: string) {
    if (type === 'mobile') {
      this.canvasRotationMobile--;
      this.flipAfterRotate(type);
    } else {
      this.canvasRotation--;
      this.flipAfterRotate(type);
    }
  }
  rotateRight(type: string) {
    if (type === 'mobile') {
      this.canvasRotationMobile++;
      this.flipAfterRotate(type);
    } else {
      this.canvasRotation++;
      this.flipAfterRotate(type);
    }
  }
  private flipAfterRotate(type: string) {
    if (type === 'mobile') {
      const flippedH = this.transformMobile.flipH;
      const flippedV = this.transformMobile.flipV;
      this.transformMobile = {
        ...this.transformMobile,
        flipH: flippedV,
        flipV: flippedH
      };
    } else {
      const flippedH = this.transform.flipH;
      const flippedV = this.transform.flipV;
      this.transform = {
        ...this.transform,
        flipH: flippedV,
        flipV: flippedH
      };
    }
  }

  imageLoaded() {
    setTimeout(() => {
      this.cropper = {
        x1: 100,
        y1: 100,
        x2: 200,
        y2: 200
      };
    });
  }

  imageLoadedMobile() {
    setTimeout(() => {
      this.cropperMobile = {
        x1: 100,
        y1: 100,
        x2: 200,
        y2: 200
      };
    });
  }
  zoomOut(type: string) {
    if (type === 'mobile') {
      this.scaleMob -= 0.1;
      this.transformMobile = {
        ...this.transformMobile,
        scale: this.scaleMob
      };
    } else {
      this.scale -= 0.1;
      this.transform = {
        ...this.transform,
        scale: this.scale
      };
    }
  }
  zoomIn(type: string) {
    if (type === 'mobile') {
      this.scaleMob += 0.1;
      this.transformMobile = {
        ...this.transformMobile,
        scale: this.scaleMob
      };
    } else {
      this.scale += 0.1;
      this.transform = {
        ...this.transform,
        scale: this.scale
      };
    }
  }
  openModal(content: any) {
    this.modalService.open(content);
  }

  closeModal(content: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.modalService.dismissAll(content);
      $('#formUploadPic').trigger('reset');
      this.picName = '';
    }
  }
  ngOnDestroy(): void {
    this.isDestroyed$.next('');
    this.isDestroyed$.complete();
  }
}
