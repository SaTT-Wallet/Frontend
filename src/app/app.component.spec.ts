import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
// import { ContactService } from './services/contact/contact.service';
// import { SidebarService } from './services/sidebar/sidebar.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Ng2SearchPipe } from 'ng2-search-filter';
import { AngularFireMessaging } from '@angular/fire/compat/messaging/public_api';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [AppComponent, Ng2SearchPipe],
      providers: [{ provide: AngularFireMessaging, useValue: undefined }]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'wallet-satt-angular'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('wallet-satt-angular');
  });
  // it('should render title', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.nativeElement;
  //   expect(compiled.querySelector('.content span').textContent).toContain('wallet-satt-angular app is running!');
  // });
});
