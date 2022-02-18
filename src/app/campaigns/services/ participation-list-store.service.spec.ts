import { TestBed } from '@angular/core/testing';

import {HttpClientTestingModule} from "@angular/common/http/testing";
import {ParticipationListStoreService} from "@campaigns/services/participation-list-store.service";

describe(' ParticipationListStoreService', () => {
  let service:  ParticipationListStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject( ParticipationListStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
