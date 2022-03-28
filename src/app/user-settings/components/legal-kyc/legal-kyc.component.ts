import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder
} from '@angular/forms';
import { FilesService } from '@core/services/files/files.Service';
import { sattUrl } from '@config/atn.config';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../../models/User';
import { ProfileService } from '@core/services/profile/profile.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ProfileSettingsFacadeService } from '@core/facades/profile-settings-facade.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { filter, map, mergeMap, takeUntil } from 'rxjs/operators';
import { forkJoin, of, Subject } from 'rxjs';
@Component({
  selector: 'app-legal-kyc',
  templateUrl: './legal-kyc.component.html',
  styleUrls: ['./legal-kyc.component.css']
})
export class LegalKYCComponent implements OnInit {
  formUploadProofID: FormGroup;
  formUploadProofDomicile: FormGroup;
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
  isIdentity: any;
  imgsrcId: any;
  imgsrcDomicile: any;
  user!: User;
  pdf: String = 'assets/Images/img_satt/pdf-xs.png';
  disabled: boolean = true;
  showSpinner!: boolean;
  private isDestroyed = new Subject();

  constructor(
    private FileService: FilesService,
    private modalService: NgbModal,
    private profileSettingsFacade: ProfileSettingsFacadeService,
    private sanitizer: DomSanitizer,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    this.formUploadProofID = new FormGroup({
      proofId: new FormControl(null, Validators.required)
    });
    this.formUploadProofDomicile = new FormGroup({
      proofDomicile: new FormControl(null, Validators.required)
    });
  }
  ngOnInit(): void {
    this.getListUserLegal();
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
        this.document.getElementById('KYC').disabled = false;

        // @ts-ignore
        this.document.getElementById('KYC')?.style.background = '#00CC9E';
        // @ts-ignore
        this.document.getElementById('KYC')?.style.color = 'white';
        // @ts-ignore
        this.document.getElementById('danger')?.style.display = 'none';
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
        this.document.getElementById('KYC')?.style.color = 'white';
        //    // @ts-ignore
        // this.document.getElementById("danger").style.display = "none";
        this.nameFile = this.srcFileIdentity.name;
        this.ispdfIdentity = 'false';
        let reader = new FileReader();
        reader.readAsDataURL(this.srcFileIdentity);
        reader.onload = () => {
          this.urlPic = reader.result;
        };
        // @ts-ignore
        this.document.getElementById('KYC')?.disabled = false;
        // @ts-ignore
        this.document.getElementById('KYC')?.style.background = '#00CC9E';
        // @ts-ignore
        this.document.getElementById('danger')?.style.display = 'none';
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
        // this.document.getElementById("KYC").disabled = true;
        // @ts-ignore
        this.document.getElementById('KYC')?.style.background = '#D6D6E8';

        let imgResponsive = this.document.getElementsByClassName(
          'img-responsive'
        ) as HTMLCollectionOf<HTMLElement>;
        if (imgResponsive) imgResponsive[0].style.display = 'none';

        // @ts-ignore
        this.document.getElementById('danger')?.style.display = 'block';
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
        this.document.getElementById('KYCC')?.disabled = false;
        // @ts-ignore
        this.document.getElementById('KYCC')?.style.background = '#00CC9E';
        // @ts-ignore
        this.document.getElementById('KYCC')?.style.background = '#00CC9E';
        // @ts-ignore
        this.document.getElementById('KYCC')?.style.color = 'white';
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
        this.document.getElementById('KYCC')?.style.color = 'white';
        this.nameFile = this.srcFileProof.name;
        let reader2 = new FileReader();
        reader2.readAsDataURL(this.srcFileProof);
        reader2.onload = () => {
          this.urlPicProof = reader2.result;
          // @ts-ignore
          this.document.getElementById('KYCC')?.disabled = false;
          // @ts-ignore
          this.document.getElementById('KYCC')?.style.background = '#00CC9E';
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
        this.document.getElementById('KYCC')?.disabled = true;
        // @ts-ignore
        this.isNotConformProof = 'true';
        // @ts-ignore
        this.document.getElementById('KYCC')?.style.background = '#D6D6E8';
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
      // this.FileService.getEstimation().subscribe((response:any)=>{
      // if(response.address){
      //   this.ContactMessageService.userNode(response.address).subscribe((response2:any)=>{
      //     if(response2){
      this.profileSettingsFacade
        .uploadProofID(this.formUploadProofID.value.proofId)
        .pipe(takeUntil(this.isDestroyed))
        .subscribe((response: any) => {
          if (response) {
            this.showSpinner = false;
            this.ngOnInit();
          }
        });
      //     }
      //   })
      // }
      // else if(response.err=='no_account'){
      //   this.showSpinner=false;
      //   Swal.fire({
      //     icon: "error",
      //     text:
      //         "no_account",
      //   });
      // }
      // })
    } else if (fileType === 'proofDomicile') {
      this.formUploadProofDomicile
        .get('proofDomicile')
        ?.updateValueAndValidity();
      // this.FileService.getEstimation().subscribe((response: any) => {
      //   if (response.address) {
      //     this.ContactMessageService.userNode(response.address).subscribe((response2: any) => {
      //       if (response2) {
      this.profileSettingsFacade
        .uploadProofDomicile(this.formUploadProofDomicile.value.proofDomicile)
        .pipe(takeUntil(this.isDestroyed))
        .subscribe((data: any) => {
          if (data) {
            this.showSpinner = false;
            this.ngOnInit();
          }
        });
      //         }
      //       })
      //     }
      //   })
    }
  }

  getListUserLegal() {
    this.showSpinner = true;
    this.profileSettingsFacade
      .getListUserLegal()
      .pipe(
        mergeMap((kyc: any) => {
          console.log(kyc)
          let arrayOfObs: any[] = [];
          if (kyc !== null && kyc !== undefined && kyc.message === 'success') {
            this.showSpinner = false;
            this.dataLegal = kyc.data.legal;
            this.dataLegal.forEach((item: any) => {
              switch (item.type) {
                case 'proofId':
                  this.dataLegalIdentity = item;
                  if (item.contentType !== 'application/pdf') {
                    arrayOfObs.push(
                      this.profileSettingsFacade.getUserLegalPic(item._id).pipe(
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
                      this.profileSettingsFacade.getUserLegalPic(item._id).pipe(
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
