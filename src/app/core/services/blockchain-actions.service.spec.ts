import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { BlockchainActionsService } from './blockchain-actions.service';

describe('BlockchainActionsService', () => {
  let service: BlockchainActionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ],
      imports:[HttpClientTestingModule]
    });
    service = TestBed.inject(BlockchainActionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
