import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialNetworksComponent } from './social-networks.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {ProfileService} from "@core/services/profile/profile.service";
import {ActivatedRoute} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";

describe('SocialNetworksComponent', () => {
  let component: SocialNetworksComponent;
  let fixture: ComponentFixture<SocialNetworksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocialNetworksComponent ],
      imports: [HttpClientTestingModule, RouterTestingModule, TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateFakeLoader
        }
      })],
      providers: [ProfileService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialNetworksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
