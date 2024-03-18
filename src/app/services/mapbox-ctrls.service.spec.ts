import { TestBed } from '@angular/core/testing';

import { MapboxCtrlsService } from './mapbox-ctrls.service';

describe('MapboxCtrlsService', () => {
  let service: MapboxCtrlsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapboxCtrlsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
