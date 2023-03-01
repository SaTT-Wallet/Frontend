import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { sattUrl } from '@config/atn.config';
import { User } from '../../../models/User';
import { DomSanitizer } from '@angular/platform-browser';
import { ProfileSettingsFacadeService } from '@core/facades/profile-settings-facade.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { filter, map, mergeMap, takeUntil } from 'rxjs/operators';
import { forkJoin, of, Subject } from 'rxjs';
import { KycFacadeService } from '@app/core/facades/kyc-facade/kyc-facade.service';
@Component({
  selector: 'app-legal-kyc',
  templateUrl: './legal-kyc.component.html',
  styleUrls: ['./legal-kyc.component.css']
})
export class LegalKYCComponent implements OnInit {
  formUploadProofID: UntypedFormGroup;
  formUploadProofDomicile: UntypedFormGroup;
  dataLegalIdentity: any;
  dataLegalDomicile: any;
  srcFileIdentity: any;
  ispdfIdentity: any;
  isNotConformIdentity: any;
  isNotConformProof: any;
  nameFile: any;
  urlpic: any;
  urlPic: any;
  dataLegal: any;
  srcFileProof: any;
  ispdfProof: any;
  urlPicProof: any;
  srcLegalFile: any;
  display : any;
  isIdentity: any;
  color: any;
  background:any;
  imgsrcId: any;
  imgsrcDomicile: any;
  user!: User;
  pdf: String = 'assets/Images/img_satt/pdf-xs.png';
  disabled: boolean = true;
  showSpinner!: boolean;
  private isDestroyed = new Subject();
  private kyc$ = this.kycFacadeService.kyc$;

  constructor(
    private profileSettingsFacade: ProfileSettingsFacadeService,
    private sanitizer: DomSanitizer,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: string,
    private kycFacadeService: KycFacadeService
  ) {
    this.formUploadProofID = new UntypedFormGroup({
      proofId: new UntypedFormControl(null, Validators.required)
    });
    this.formUploadProofDomicile = new UntypedFormGroup({
      proofDomicile: new UntypedFormControl(null, Validators.required)
    });
  }
  ngOnInit(): void {
    this.uploadUserLegal();
  }
  ///////////////////////identity//////////////////////////////////
  fileChangeEventIdentity(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      let identity = event;
      this.srcFileIdentity = identity.target.files[0];
      this.formUploadProofID.setValue({ proofId: this.srcFileIdentity });
      ///pdf
      if (
        this.srcFileIdentity.type === 'application/pdf' &&
        this.srcFileIdentity.size <= 5000000 &&
        isPlatformBrowser(this.platformId)
      ) {
        this.ispdfIdentity = 'true';
        this.isNotConformIdentity = 'false';
        // @ts-ignore
       this.disabled = disabled;

        // @ts-ignore
        this.background = '#00CC9E';
        // @ts-ignore
       this.color = 'white';
        // @ts-ignore
        this.display = 'none';
        let imgResponsive = this.document.getElementsByClassName(
          'img-responsive'
        ) as HTMLCollectionOf<HTMLElement>;
        if (imgResponsive) imgResponsive[0].style.display = 'block';
        ///jpeg
      } else if (
        this.srcFileIdentity.type === 'image/jpeg' &&
        this.srcFileIdentity.size <= 5000000 &&
        isPlatformBrowser(this.platformId)
      ) {
        // @ts-ignore
        this.color = 'white';
        //    // @ts-ignore
        this.display = "none";
        this.nameFile = this.srcFileIdentity.name;
        this.ispdfIdentity = 'false';
        let reader = new FileReader();
        reader.readAsDataURL(this.srcFileIdentity);
        reader.onload = () => {
          this.urlPic = reader.result;
        };
        // @ts-ignore
       this.disabled = false;
        // @ts-ignore
      this.background = '#00CC9E';
        // @ts-ignore
        this.display = 'none';
        let imgResponsive = this.document.getElementsByClassName(
          'img-responsive'
        ) as HTMLCollectionOf<HTMLElement>;
        if (imgResponsive) imgResponsive[0].style.display = 'block';
      } else if (
        (isPlatformBrowser(this.platformId) &&
          this.srcFileIdentity.type !== 'image/jpeg' &&
          this.srcFileIdentity.type !== 'application/pdf') ||
        this.srcFileIdentity.size > 5000000
      ) {
        // this.srcFileProof ='';
        // this.urlPicProof ='';
        // this.pdf='';
        // @ts-ignore
        this.isNotConformIdentity = 'true';
        // @ts-ignore
        this.disabled = true;
        // @ts-ignore
       this.background = '#D6D6E8';

        let imgResponsive = this.document.getElementsByClassName(
          'img-responsive'
        ) as HTMLCollectionOf<HTMLElement>;
        if (imgResponsive) imgResponsive[0].style.display = 'none';

        // @ts-ignore
        this.display = 'block';
      }
    }
  }
  ///////////////////////proof domicile//////////////////////////////////
  fileChangeEventProof(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      let proof = event;
      this.srcFileProof = proof.target.files[0];
      this.formUploadProofDomicile.setValue({
        proofDomicile: this.srcFileProof
      });
      if (
        this.srcFileProof.type === 'application/pdf' &&
        this.srcFileProof.size <= 5000000 &&
        isPlatformBrowser(this.platformId)
      ) {
        this.ispdfProof = 'true';
        this.isNotConformProof = 'false';
        // @ts-ignore
        this.disabled = false;
        // @ts-ignore
        this.background = '#00CC9E';
        // @ts-ignore
        this.background = '#00CC9E';
        // @ts-ignore
        this.color = 'white';
        let imgResponsiveP = this.document.getElementsByClassName(
          'img-responsive p'
        ) as HTMLCollectionOf<HTMLElement>;
        if (imgResponsiveP) imgResponsiveP[0].style.display = 'block';
        // this.document.getElementsByClassName(
        //   'img-responsive p'
        // )[0]?.style.display = 'block';
      } else if (
        this.srcFileProof.type === 'image/jpeg' &&
        this.srcFileProof.size <= 5000000 &&
        isPlatformBrowser(this.platformId)
      ) {
        this.ispdfProof = 'false';
        this.isNotConformProof = 'false';
        // @ts-ignore
       this.color = 'white';
        this.nameFile = this.srcFileProof.name;
        let reader2 = new FileReader();
        reader2.readAsDataURL(this.srcFileProof);
        reader2.onload = () => {
          this.urlPicProof = reader2.result;
          // @ts-ignore
          this.disabled = false;
          // @ts-ignore
          this.background = '#00CC9E';
          let imgResponsiveP = this.document.getElementsByClassName(
            'img-responsive p'
          ) as HTMLCollectionOf<HTMLElement>;
          if (imgResponsiveP) imgResponsiveP[0].style.display = 'block';
        };
      } else if (
        (isPlatformBrowser(this.platformId) &&
          this.srcFileProof.type !== 'image/jpeg' &&
          this.srcFileProof.type !== 'application/pdf') ||
        this.srcFileProof.size > 5000000
      ) {
        // @ts-ignore
        this.disabled = true;
        // @ts-ignore
        this.isNotConformProof = 'true';
        // @ts-ignore
       this.background = '#D6D6E8';
        let imgResponsiveP = this.document.getElementsByClassName(
          'img-responsive p'
        ) as HTMLCollectionOf<HTMLElement>;
        if (imgResponsiveP) imgResponsiveP[0].style.display = 'none';
      }
    }
  }
  alert() {
    if (isPlatformBrowser(this.platformId)) window.alert('hi');
  }

  isDisabled() {
    return true;
  }
  /////////////////////////////////////////////////////////////////////////////////
  saveKyc(fileType: string) {
    this.showSpinner = true;

    if (fileType === 'proofId') {
      this.formUploadProofID.get('proofId')?.updateValueAndValidity();

      this.kycFacadeService
        .uploadProofID(this.formUploadProofID.value.proofId)
        .pipe(takeUntil(this.isDestroyed))
        .subscribe((response: any) => {
          if (response) {
            this.showSpinner = false;
            this.kycFacadeService.dispatchUpdatedKyc();
            // this.ngOnInit();
          }
        });
    } else if (fileType === 'proofDomicile') {
      this.formUploadProofDomicile
        .get('proofDomicile')
        ?.updateValueAndValidity();

      this.kycFacadeService
        .uploadProofDomicile(this.formUploadProofDomicile.value.proofDomicile)
        .pipe(takeUntil(this.isDestroyed))
        .subscribe((data: any) => {
          if (data) {
            this.showSpinner = false;
            this.kycFacadeService.dispatchUpdatedKyc();
            // this.ngOnInit();
          }
        });
    }
  }
  uploadUserLegal() {
    this.showSpinner = true;
    this.kyc$
      .pipe(
        takeUntil(this.isDestroyed),
        mergeMap((legal: any) => {
          if (legal !== null) {
            this.showSpinner = false;
            let arrayOfObs: any[] = [];
            this.dataLegal = legal.legal;
            this.dataLegal.forEach((item: any) => {
              switch (item.type) {
                case 'proofId':
                  this.dataLegalIdentity = item;
                  if (item.contentType !== 'application/pdf') {
                    arrayOfObs.push(
                      this.kycFacadeService.getUserLegalPic(item._id).pipe(
                        map((data) => {
                          return { data, type: 'proofId' };
                        })
                      )
                    );
                  }
                  break;
                case 'proofDomicile':
                  this.dataLegalDomicile = item;
                  if (item.contentType !== 'application/pdf') {
                    arrayOfObs.push(
                      this.kycFacadeService.getUserLegalPic(item._id).pipe(
                        map((data) => {
                          return { data, type: 'proofDomicile' };
                        })
                      )
                    );
                  }
                  break;
              }
            });
            return forkJoin(arrayOfObs);
          }
          return of(null);
        })
      )
      .pipe(
        filter((res) => res !== null),
        takeUntil(this.isDestroyed)
      )
      .subscribe((resArray: any) => {
        resArray.forEach(({ data, type }: any) => {
          if (type === 'proofId') {
            let objectURL = URL.createObjectURL(data);
            this.imgsrcId = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          } else if (type === 'proofDomicile') {
            let objectURL = URL.createObjectURL(data);
            this.imgsrcDomicile =
              this.sanitizer.bypassSecurityTrustUrl(objectURL);
          }
        });
      });
  }
  telecharger(id: any) {
    if (isPlatformBrowser(this.platformId))
      window.open(sattUrl + '/profile/UserLegal/' + id, '_blank');
  }
  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
}
