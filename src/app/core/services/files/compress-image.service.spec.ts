import { TestBed } from '@angular/core/testing';

import { CompressImageService } from './compress-image.service';

describe('CompressImageService', () => {
  let service: CompressImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompressImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
