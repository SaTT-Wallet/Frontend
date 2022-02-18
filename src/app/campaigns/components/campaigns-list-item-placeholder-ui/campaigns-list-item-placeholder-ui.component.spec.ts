import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignsListItemPlaceholderUIComponent } from './campaigns-list-item-placeholder-ui.component';

describe('CampaignsListItemPlaceholderUIComponent', () => {
  let component: CampaignsListItemPlaceholderUIComponent;
  let fixture: ComponentFixture<CampaignsListItemPlaceholderUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignsListItemPlaceholderUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignsListItemPlaceholderUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
