import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoListComponent } from './crypto-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Ng2SearchPipe } from 'ng2-search-filter';
import { FilterBynamePipe } from '@app/shared/pipes/filter-byname.pipe';

describe('CryptoListComponent', () => {
  let component: CryptoListComponent;
  let fixture: ComponentFixture<CryptoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CryptoListComponent, Ng2SearchPipe, FilterBynamePipe],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot()
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
