import { TestBed } from '@angular/core/testing';

import { LeylineService } from './leyline.service';

describe('LeylineService', () => {
  let service: LeylineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeylineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
