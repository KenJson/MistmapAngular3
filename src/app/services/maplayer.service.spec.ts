import { TestBed } from '@angular/core/testing';

import { MaplayerService } from './maplayer.service';

describe('MaplayerService', () => {
  let service: MaplayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaplayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
