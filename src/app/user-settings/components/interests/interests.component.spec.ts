import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { InterestsComponent } from './interests.component';
import {Ng2SearchPipe} from "ng2-search-filter";
import { OrderByPipe } from '@shared/pipes/order-by.pipe';


describe('InterestsComponent', () => {
  let component: InterestsComponent;
  let fixture: ComponentFixture<InterestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterestsComponent,Ng2SearchPipe ,    OrderByPipe,
      ],
      imports: [ HttpClientModule,HttpClientTestingModule,ReactiveFormsModule,  ReactiveFormsModule,TranslateModule.forRoot(),ToastrModule.forRoot()]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
