import { TestBed } from '@angular/core/testing';

import { MapboxkeyService } from './mapboxkey.service';

describe('MapboxkeyService', () => {
  let service: MapboxkeyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapboxkeyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
