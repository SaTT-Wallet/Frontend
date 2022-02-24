import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CampaignHttpApiService } from '@core/services/campaign/campaign.service';
import { CampaignsStoreService } from '@campaigns/services/campaigns-store.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CropperPosition,
  ImageCroppedEvent,
  ImageTransform
} from 'ngx-image-cropper';

@Component({
  selector: 'app-edit-cover-btn',
  templateUrl: './edit-cover-btn.component.html',
  styleUrls: ['./edit-cover-btn.component.scss']
})
export class EditCoverBtnComponent implements OnInit {
  @Input() imageBase64 = '';
  @Input() roundCropper = false;
  @Input() cropperStaticWidth = 1024;
  @Input() cropperStaticHeight = 576;
  @Input() resizeToWidth = 1024;
  @Input() hideResizeSquares = true;
  @Input() aspectRatio = 16 / 9;

  @Output() imageImported = new EventEmitter();
  @Output() imageCroppedEventEmitter = new EventEmitter();

  imageChangedEvent: any = '';
  croppedImage: any = '';
  scale = 1;
  transform: ImageTransform = {};

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  fileChangeEvent(event: any) {
    if (
      event.target.files[0].type === 'image/png' ||
      event.target.files[0].type === 'image/jpeg' ||
      event.target.files[0].type === 'image/jpg'
    ) {
      this.imageChangedEvent = event;
    }
  }

  closeModal(content: any) {
    this.modalService.dismissAll(content);
  }

  openModal(content: any) {
    this.modalService.open(content, { centered: true });
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.imageCroppedEventEmitter.emit(event.base64);
  }

  saveImage() {
    this.imageImported.emit(this.croppedImage);
  }

  zoomOut() {
    this.scale -= 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }
  zoomIn() {
    this.scale += 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }
}
