import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  PLATFORM_ID,
  QueryList,
  Renderer2,
  SimpleChanges,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Editor } from 'ngx-editor';
import {
  debounceTime,
  filter,
  map,
  mergeMap,
  take,
  takeUntil,
  tap
} from 'rxjs/operators';
import { DraftCampaignService } from '@campaigns/services/draft-campaign.service';
import { Campaign } from '@app/models/campaign.model';
import { CampaignHttpApiService } from '@core/services/campaign/campaign.service';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { forkJoin, of, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { urlValidator } from '@app/config/atn.config';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { WindowRefService } from '@app/core/windowRefService';
import FileSaver from 'file-saver';
@Component({
  selector: 'app-draft-campaign-kit',
  templateUrl: './draft-campaign-kit.component.html',
  styleUrls: ['./draft-campaign-kit.component.css'],
})
export class DraftCampaignKitComponent implements OnInit {
  @Input()
  id = '';
  @Input()
  draftData: Campaign = new Campaign();

  // @Input() notValidKit: any;
  // @Output() ValidFormKit = new EventEmitter();

  @Output()
  saveFormStatus = new EventEmitter();
  dropdownSettings: any;
  form = new UntypedFormGroup({});
  editor = new Editor();
  kits: any = [];
  isAcceptedImageFileType?: boolean;
  isConformKit!: boolean;
  selectedfile: any;
  selectedfilename: any;
  arrayofFile: any = [];
  showImage!: boolean;
  imageChangedEvent: any = '';
  isImageCroppedSubject = new Subject<boolean>();
  srcFile: any;
  srcFileLogo: any;
  isConform!: boolean;
  picName: any;
  draftId: string = '';
  campaignCoverImage: any;
  srcLogo: any;
  isNewPicLogo: boolean = false;
  firstimage: boolean = true;
  secondimage: boolean = true;
  thirdimage: boolean = true;
  zoomIn: boolean = true;
  zoomOut: boolean = false;
  idKit: any;
  scrollright: boolean = true;
  scrollleft: boolean = true;
  scrollrightdisable: boolean = false;
  scrollleftdisable: boolean = false;
  addLink: boolean = false;
  firstscrol: boolean = false;
  secondscrol: boolean = false;
  thirdscrol: boolean = false;
  fourthscrol: boolean = false;
  fithscrol: boolean = false;
  firstscroldisable: boolean = false;
  secondscroldisable: boolean = false;
  thirdscroldisable: boolean = false;
  fourthscroldisable: boolean = false;
  fithscroldisable: boolean = false;
  urlImage: any;
  iTestData: number;
  testDataShown: any;
  images: any = [];
  showKits: boolean = false;
  private isDestroyed = new Subject();

  
  
  pdf: String = 'assets/Images/img_satt/pdf-xs.png';

  @ViewChild('divUploadedFiles') divUploadedFiles: ElementRef | any;
  @ViewChildren('myImg') myImg!: QueryList<HTMLImageElement>;

  filterName: any;
  pdfZoom = false;

  constructor(
    
    private service: DraftCampaignService,
    private CampaignService: CampaignHttpApiService,
    public translate: TranslateService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) private documentRef: any,
    private windowRefService: WindowRefService,
    private renderer: Renderer2
  ) {
    
    
    this.form = new UntypedFormGroup({
      url: new UntypedFormControl('', [Validators.pattern(urlValidator)]),
      file: new UntypedFormControl('')
    });
    this.iTestData = 0;
  }

  ngOnInit(): void {
    
    this.scrollright = false;
    this.scrollrightdisable = true;
    this.saveForm();
    this.emitFormStatus();
    this.getKits(this.id); 
    
  }
 
  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    autoWidth: true,
    navSpeed: 700,
    navText: ['', ''],
    items: 3,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      }
    },
    nav: true
  };

  //   setShownData(){
  //     this.testDataShown = this.kits.slice(0, 3);
  // }
  // previous() {
  //     this.iTestData = this.iTestData - 1;
  //     for(let i=1;i<this.kits.length;i++){
  //       let aux=this.kits[i-1];
  //       this.kits[i]=aux;
  //     }
  //     this.setShownData();

  // }

  // next('') {
  //   if((this.iTestData*3)+1 < this.kits.length){
  //     this.iTestData = this.iTestData + 1;
  //     for(let i=0;i<this.kits.length;i++){
  //       let aux=this.kits[i+1];
  //       this.kits[i]=aux;
  //     }
  //     this.setShownData();
  //   }
  // }
  // getElement(index:number) {
  //   let firstElement=this.kits[index];
  //   let secondElement=this.kits[index+1];
  //   let thirdElement=this.kits[index+2];
  //   this.kits=[firstElement,secondElement,thirdElement];
  //   this.setShownData();
  // }

  ngOnChanges(changes: SimpleChanges) {

    if (changes.draftData && changes.draftData.currentValue.id) {
      this.populateForm(this.draftData);
    }
  }
  ngAfterViewInit() {
   
  }
  getKits(id: string) {
    
    this.CampaignService.getCampaignKitUrl(id)
      .pipe(
        map((res: any) => res.data),
        mergeMap((data: any) => {
          if (data) {
            data.forEach((kit: any) => {
              if (kit.link) {
                
                this.kits = [
                  ...this.kits,
                  {
                    name: kit.link,
                    link: kit.link,
                    campaign: id,
                    kits: kit.id
                  }
                ];
               
              }
              if (!kit.link) {
                this.firstimage = false;
                this.secondimage = false;
                this.thirdimage = false;
                this.kits = [
                  ...this.kits,
                  { name: kit.name, campaign: id, kits: kit.id }
                ];
              }
            });
            
            if (this.kits.length === 1) {
              this.firstscrol = true;
            }
            if (this.kits.length === 2) {
              this.firstscrol = true;

              this.secondscrol = true;
            }
            if (this.kits.length === 3) {
              this.firstscrol = true;

              this.secondscrol = true;
              this.thirdscrol = true;
            }
            if (this.kits.length === 4) {
              this.firstscrol = true;

              this.secondscrol = true;
              this.thirdscrol = true;
              this.fourthscrol = true;
            }
            if (this.kits.length === 5) {
              this.firstscrol = true;

              this.secondscrol = true;
              this.thirdscrol = true;
              this.fourthscrol = true;
              this.fithscrol = true;
            }
            let arrayOfObs: any[] = [];
            data.forEach((elem: any) => {
              if (!elem.link) {
                arrayOfObs.push(this.CampaignService.getKitPic(elem._id));
              } else {
                arrayOfObs.push(of(null));
              }
            });
            
            return forkJoin(arrayOfObs).pipe(
              map((resArray) => {
                return { resArray, data };
              })
            );
           
          }
          
          return of(null);
        })
      )

      /*.pipe(
        filter((res) => res !== null),
       
      )*/
      .subscribe(({ resArray, data }: any) => {
        
      
        resArray?.forEach((file: any, index: number) => {
          if (file !== null) {
            let imageUrl;
            let objectURL = URL.createObjectURL(file);
            imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
            let element = data[index];
            element.url = imageUrl;
            this.kits[index] = element;
          } else {
            this.kits[index] = data[index];
          }
        });
        
       

        
      });
  }
  onFileChange(e: any) {
    //  console.log( e.target.files[0].type)

    if (
      e.target.files[0].type === 'image/png' ||
      e.target.files[0].type === 'image/jpeg' ||
      e.target.files[0].type === 'image/jpg' ||
      e.target.files[0].type === 'application/pdf'
    ) {
      // console.log("aaaa")
      this.isAcceptedImageFileType = true;
      var file = e.target.files[0];
      var r = new FileReader();
      this.firstimage = false;
      this.secondimage = false;
      this.thirdimage = false;
      this.scrollleft = true;
      this.scrollleftdisable = false;
      if (e.target.files[0]) {
        r.readAsDataURL(file);
        r.onload = () => {
          let selectedFile = r.result;
          let selectedFilename = file.name;

          const FileKit = this.base64ToFile(selectedFile, selectedFilename);
          if (e.target.files[0].type === 'application/pdf') {
            this.kits = [
              ...this.kits,
              {
                new: true,
                file: FileKit,
                selectedFile: selectedFile,
                name: selectedFilename,
                campaign: this.draftData.id,
                contentType: 'application/pdf'
              }
            ];
          } else {
            this.kits = [
              ...this.kits,
              {
                new: true,
                file: FileKit,
                selectedFile: selectedFile,
                name: selectedFilename,
                campaign: this.draftData.id
              }
            ];
          }

          /*if (this.countImages() > 3) {
            this.customOptions.loop = true;
          } else {
            this.customOptions.loop = false;
          }*/
        };
        if (e.target.files[0].type === 'application/pdf') {
          this.pdf = 'assets/Images/img_satt/pdf-xs.png';
          // console.log("vv",this.pdf)
        }
      }
    } else {
      this.isAcceptedImageFileType = false;
    }
  }
  
  countImages() {
    let count = 0;
    
    for (let i = 0; i < this.kits.length; i++) {
      
      if (!this.kits[i].link) {
        count++;
      }
    }
    return count;
  }
  //isConformKit
  checkselectedfile(e: any) {
    if (
      e.target.files[0].type === 'image/png' ||
      e.target.files[0].type === 'image/jpeg' ||
      e.target.files[0].type === 'image/jpg'
    ) {
      this.isConformKit = true;
      var files = e.target.files;
      var r = new FileReader();
      if (e.target.files[0]) {
        r.readAsDataURL(files[0]);
        r.onload = () => {
          this.selectedfile = r.result;
          this.selectedfilename = files[0].name;
          this.arrayofFile.push(this.selectedfile);
          const FileKit = this.base64ToFile(
            this.selectedfile,
            this.selectedfilename
          );
          this.kits = [
            ...this.kits,
            {
              file: FileKit,
              selectedFile: this.selectedfile,
              name: this.selectedfilename,
              campaign: this.draftData.id
            }
          ];
        };
      }
    } else {
      this.isConformKit = false;
    }
  }

  addLinkToKits() {
    let url = this.form?.get('url')?.value;
    
    if (url && this.form.controls.url.valid) {
      
      this.kits.push({
        new: true,
        name: url,
        link: url,
        campaign: this.draftData?.id
      });
      
      this.service.autoSavekitFormOnValueChanges({
        kits: this.kits,
        id: this.id
      });
      this.form?.get('url')?.reset();
    }
    //this.filterName = '';
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

  handelkitTosend() {
    let _Kits = this.kits.map((elem: any) => {
      delete elem.name;
      delete elem.selectedFile;
      return elem;
    });
    return _Kits;
  }
  saveForm() {
    this.form
      .get('file')
      ?.valueChanges.pipe(
        debounceTime(500),
        tap(() => {
          this.service.autoSavekitFormOnValueChanges({
            kits: this.kits,
            id: this.id
          });
        }),
        takeUntil(this.isDestroyed)
      )
      .subscribe();
  }

  openModalZoomIn(url: any) {
    // console.log(url);
    if (isPlatformBrowser(this.platformId)) {
      if (!!url.changingThisBreaksApplicationSecurity) {
        let blob = url.changingThisBreaksApplicationSecurity;
        var xhr = new XMLHttpRequest();
        // console.warn(blob);

        xhr.open('GET', blob, true);
        xhr.responseType = 'blob';

        xhr.onload = (e: any) => {
          if (e.target.status === 200) {
            if (e.target.response.type === 'application/pdf') {
              var element = this.documentRef.getElementById('img-reader');
              element.style.display = 'none';
              this.pdfZoom = true;
              var element = this.documentRef.getElementById('pdf-reader');
              element.style.display = 'block';
              element.data = url.changingThisBreaksApplicationSecurity;
            } else {
              var element = this.documentRef.getElementById('pdf-reader');
              element.style.display = 'none';
              var element = this.documentRef.getElementById('img-reader');
              element.style.display = 'block';

              this.pdfZoom = false;
              this.urlImage = url;
            }
          }
        };
        xhr.send();
      } else {
        this.urlImage = url;
        var element = this.documentRef.getElementById('pdf-reader');
        element.src = url;
        element = this.documentRef.getElementById('img-reader');
        element.style.display = 'block';
      }
    }
  }

  emitFormStatus() {
    this.service.saveStatus
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((status: string) => {
        this.saveFormStatus.emit(status);
      });
  }

  populateForm(data: Campaign) {
    this.form.patchValue(
      {
        url: data.url,
        file: data.file
      },
      { emitEvent: false, onlySelf: true }
    );
  }

  showToaster(state: 'success' | 'error' | 'info', message: string) {
    this.translate
      .get(message)
      .pipe(take(1), takeUntil(this.isDestroyed))
      .subscribe((text: any) => {
        if (state === 'error') {
          this.toastr.error(text);
        } else if (state === 'success') {
          this.toastr.success(text);
        } else {
          this.toastr.info(text);
        }
      });
  }
  deleteKitElement(id: any) {
    let kit = this.kits[id]._id;
    // this.firstimage=true
    if (kit) {
      this.CampaignService.removeKit(kit)
        .pipe(takeUntil(this.isDestroyed))
        .subscribe(() => {
          this.kits.splice(id, 1);
        });
    } else {
      this.kits.splice(id, 1);
    }
    if (this.countImages() <= 3) {
      this.customOptions.loop = false;
    }
  }


  zoomin(id: any) {
    if (isPlatformBrowser(this.platformId)) {
      let kit = this.kits[id]._id;
      this.idKit = kit;
      var myImg = this.documentRef.getElementById('imagekit' + id);
      var width = myImg?.clientWidth;
      myImg.style.width = width + 200 + 'px';
      myImg.style.height = width + 200 + 'px';
      myImg.style.marginRight = '24px';
      this.zoomIn = false;
      this.zoomOut = true;
    }
  }
  zoomout(id: any) {
    if (isPlatformBrowser(this.platformId)) {
      var myImg = this.documentRef.getElementById('imagekit' + id);
      var width = myImg?.clientWidth;
      if (
        myImg?.style.width === '450px' ||
        myImg?.style.width === '360px' ||
        myImg?.style.width === '293px' ||
        myImg?.style.width === '276px'
      ) {
        myImg.style.width = width - 200 + 'px';
        myImg.style.height = width - 200 + 'px';
        myImg.style.marginRight = '0px';
        this.zoomIn = true;
        this.zoomOut = false;
      }
    }
  }

  downloadMyFile(i: any, id: any) {
    let kit = this.kits[i]._id;
    this.CampaignService.getCampaignKitUrl(id)
      .pipe(
        map((res: any) => res.data),
        mergeMap(() => {
          return this.CampaignService.getKitPic(kit);
        }),
        takeUntil(this.isDestroyed)
      )
      .subscribe((file) => {
        let objectURL = URL.createObjectURL(file);
        let imageUrl: any;
        imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        let filetype = file.type.split('/').pop();
        let fileName = `download.${filetype}`;
        let fileUrl = imageUrl.changingThisBreaksApplicationSecurity;
        FileSaver.saveAs(fileUrl, fileName);
      });
  }
  trackByKits(index: number, kits: any): string {
    return kits.code;
  }
  trackBykitelemnt(index: number, kitselement: any): string {
    return kitselement.code;
  }
  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
}
