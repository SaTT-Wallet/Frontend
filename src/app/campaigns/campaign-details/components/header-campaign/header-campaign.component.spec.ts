import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderCampaignComponent } from './header-campaign.component';

describe('HeaderCampaignComponent', () => {
  let component: HeaderCampaignComponent;
  let fixture: ComponentFixture<HeaderCampaignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderCampaignComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
